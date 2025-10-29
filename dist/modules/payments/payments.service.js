"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const paystack_service_1 = require("./paystack/paystack.service");
const payment_entity_1 = require("../../database/entities/payment.entity");
const booking_service_1 = require("../bookings/booking.service");
const enums_1 = require("../../shared/enums");
const generator_1 = require("../../common/utils/generator");
let PaymentsService = class PaymentsService {
    paymentsRepository;
    bookingsService;
    paystackService;
    constructor(paymentsRepository, bookingsService, paystackService) {
        this.paymentsRepository = paymentsRepository;
        this.bookingsService = bookingsService;
        this.paystackService = paystackService;
    }
    async initializePayment(initializeDto) {
        const booking = await this.bookingsService.findById(initializeDto.bookingId);
        if (booking.status !== enums_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Can only pay for pending bookings');
        }
        const existingPayment = await this.paymentsRepository.findOne({
            where: { bookingId: initializeDto.bookingId },
        });
        if (existingPayment && existingPayment.status === enums_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Payment already completed for this booking');
        }
        const reference = generator_1.Generators.generatePaymentReference();
        const paystackResponse = await this.paystackService.initializePayment(initializeDto.customerEmail ||
            booking.customer.email ||
            `${booking.customer.phone}@comfort.com`, initializeDto.amount, reference, initializeDto.callbackUrl, {
            bookingId: booking.id,
            bookingReference: booking.reference,
            customerName: booking.customer.name,
            customerPhone: booking.customer.phone,
        });
        let payment;
        if (existingPayment) {
            payment = await this.paymentsRepository.save({
                ...existingPayment,
                reference,
                amount: initializeDto.amount,
                method: initializeDto.method,
                status: enums_1.PaymentStatus.PENDING,
                paystackReference: paystackResponse.data.reference,
                paystackResponse: paystackResponse.data,
            });
        }
        else {
            payment = await this.paymentsRepository.save({
                bookingId: booking.id,
                reference,
                amount: initializeDto.amount,
                method: initializeDto.method,
                status: enums_1.PaymentStatus.PENDING,
                paystackReference: paystackResponse.data.reference,
                paystackResponse: paystackResponse.data,
            });
        }
        return {
            payment,
            authorizationUrl: paystackResponse.data.authorization_url,
            accessCode: paystackResponse.data.access_code,
        };
    }
    async verifyPayment(verifyDto) {
        const payment = await this.paymentsRepository.findOne({
            where: { reference: verifyDto.reference },
            relations: ['booking'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const paystackResponse = await this.paystackService.verifyPayment(payment.paystackReference);
        if (paystackResponse.data.status === 'success') {
            await this.paymentsRepository.update(payment.id, {
                status: enums_1.PaymentStatus.COMPLETED,
                paidAt: new Date(),
                paystackResponse: paystackResponse.data,
            });
            await this.bookingsService.updateStatus(payment.bookingId, enums_1.BookingStatus.CONFIRMED);
            return await this.findById(payment.id);
        }
        else {
            await this.paymentsRepository.update(payment.id, {
                status: enums_1.PaymentStatus.FAILED,
                failureReason: paystackResponse.data.gateway_response,
                paystackResponse: paystackResponse.data,
            });
            throw new common_1.BadRequestException(`Payment failed: ${paystackResponse.data.gateway_response}`);
        }
    }
    async findById(id) {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: ['booking', 'booking.customer'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async findByReference(reference) {
        const payment = await this.paymentsRepository.findOne({
            where: { reference },
            relations: ['booking', 'booking.customer'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async findByBooking(bookingId) {
        return this.paymentsRepository.findOne({
            where: { bookingId },
            relations: ['booking'],
        });
    }
    async getAllPayments(page = 1, limit = 10, status, startDate, endDate) {
        const query = this.paymentsRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.booking', 'booking')
            .leftJoinAndSelect('booking.customer', 'customer');
        if (status) {
            query.andWhere('payment.status = :status', { status });
        }
        if (startDate) {
            query.andWhere('payment.createdAt >= :startDate', { startDate });
        }
        if (endDate) {
            query.andWhere('payment.createdAt <= :endDate', { endDate });
        }
        const total = await query.getCount();
        const payments = await query
            .orderBy('payment.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const totalPages = Math.ceil(total / limit);
        return {
            data: payments,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
    async getPaymentStats(startDate, endDate) {
        const query = this.paymentsRepository.createQueryBuilder('payment');
        if (startDate) {
            query.andWhere('payment.createdAt >= :startDate', { startDate });
        }
        if (endDate) {
            query.andWhere('payment.createdAt <= :endDate', { endDate });
        }
        const totalPayments = await query.getCount();
        const statusCounts = await query
            .select('payment.status, COUNT(payment.id) as count')
            .groupBy('payment.status')
            .getRawMany();
        const totalRevenue = await query
            .select('SUM(payment.amount)', 'total')
            .where('payment.status = :status', { status: enums_1.PaymentStatus.COMPLETED })
            .getRawOne();
        const methodCounts = await query
            .select('payment.method, COUNT(payment.id) as count')
            .groupBy('payment.method')
            .getRawMany();
        return {
            totalPayments,
            statusCounts,
            methodCounts,
            totalRevenue: parseFloat(totalRevenue?.total || '0'),
        };
    }
    async refundPayment(paymentId, reason) {
        const payment = await this.findById(paymentId);
        if (payment.status !== enums_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Can only refund completed payments');
        }
        const refundResponse = await this.paystackService.refundTransaction(payment.paystackResponse.id.toString());
        if (refundResponse.status) {
            await this.paymentsRepository.update(paymentId, {
                status: enums_1.PaymentStatus.REFUNDED,
                failureReason: reason,
            });
            await this.bookingsService.updateStatus(payment.bookingId, enums_1.BookingStatus.CANCELLED);
            return await this.findById(paymentId);
        }
        else {
            throw new common_1.BadRequestException('Refund failed');
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        booking_service_1.BookingsService,
        paystack_service_1.PaystackService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map