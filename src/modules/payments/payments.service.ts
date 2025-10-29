import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaystackService } from './paystack/paystack.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { Payment } from 'src/database/entities/payment.entity';
import { BookingsService } from '../bookings/booking.service';
import { BookingStatus, PaymentStatus } from 'src/shared/enums';
import { Generators } from 'src/common/utils/generator';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private bookingsService: BookingsService,
    private paystackService: PaystackService,
  ) {}

  async initializePayment(initializeDto: InitializePaymentDto) {
    const booking = await this.bookingsService.findById(
      initializeDto.bookingId,
    );

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Can only pay for pending bookings');
    }

    // Check if payment already exists
    const existingPayment = await this.paymentsRepository.findOne({
      where: { bookingId: initializeDto.bookingId },
    });

    if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException(
        'Payment already completed for this booking',
      );
    }

    const reference = Generators.generatePaymentReference();

    // Initialize payment with Paystack
    const paystackResponse = await this.paystackService.initializePayment(
      initializeDto.customerEmail ||
        booking.customer.email ||
        `${booking.customer.phone}@comfort.com`,
      initializeDto.amount,
      reference,
      initializeDto.callbackUrl,
      {
        bookingId: booking.id,
        bookingReference: booking.reference,
        customerName: booking.customer.name,
        customerPhone: booking.customer.phone,
      },
    );

    /**
     * Create or update payment record
     * Always store paystackResponse as a JSON string for consistency
     */
    let payment: Payment;
    if (existingPayment) {
      payment = await this.paymentsRepository.save({
        ...existingPayment,
        reference,
        amount: initializeDto.amount,
        method: initializeDto.method,
        status: PaymentStatus.PENDING,
        paystackReference: paystackResponse.data.reference,
        paystackResponse: paystackResponse.data,
      });
    } else {
      payment = await this.paymentsRepository.save({
        bookingId: booking.id,
        reference,
        amount: initializeDto.amount,
        method: initializeDto.method,
        status: PaymentStatus.PENDING,
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

  async verifyPayment(verifyDto: VerifyPaymentDto) {
    const payment = await this.paymentsRepository.findOne({
      where: { reference: verifyDto.reference },
      relations: ['booking'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify with Paystack
    const paystackResponse = await this.paystackService.verifyPayment(
      payment.paystackReference,
    );
    if (paystackResponse.data.status === 'success') {
      // Update payment status
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
        paystackResponse: paystackResponse.data as any,
      });

      // Update booking status
      await this.bookingsService.updateStatus(
        payment.bookingId,
        BookingStatus.CONFIRMED,
      );

      return await this.findById(payment.id);
    } else {
      // Payment failed
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failureReason: paystackResponse.data.gateway_response,
        paystackResponse: paystackResponse.data as any,
      });

      throw new BadRequestException(
        `Payment failed: ${paystackResponse.data.gateway_response}`,
      );
    }
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['booking', 'booking.customer'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findByReference(reference: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { reference },
      relations: ['booking', 'booking.customer'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async findByBooking(bookingId: string): Promise<Payment | null> {
    return this.paymentsRepository.findOne({
      where: { bookingId },
      relations: ['booking'],
    });
  }

  async getAllPayments(
    page: number = 1,
    limit: number = 10,
    status?: PaymentStatus,
    startDate?: Date,
    endDate?: Date,
  ) {
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

  async getPaymentStats(startDate?: Date, endDate?: Date) {
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
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
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

  async refundPayment(paymentId: string, reason?: string) {
    const payment = await this.findById(paymentId);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Can only refund completed payments');
    }

    // Process refund with Paystack
    const refundResponse = await this.paystackService.refundTransaction(
      payment.paystackResponse.id.toString(),
    );

    if (refundResponse.status) {
      // Update payment status
      await this.paymentsRepository.update(paymentId, {
        status: PaymentStatus.REFUNDED,
        failureReason: reason,
      });

      // Update booking status
      await this.bookingsService.updateStatus(
        payment.bookingId,
        BookingStatus.CANCELLED,
      );

      return await this.findById(paymentId);
    } else {
      throw new BadRequestException('Refund failed');
    }
  }
}
