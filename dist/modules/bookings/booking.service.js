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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const booking_entity_1 = require("../../database/entities/booking.entity");
const generator_1 = require("../../common/utils/generator");
const enums_1 = require("../../shared/enums");
const payments_service_1 = require("../payments/payments.service");
const sms_service_1 = require("../notifications/sms/sms.service");
const vehicle_service_1 = require("../vehicle/vehicle.service");
const drivers_service_1 = require("../drivers/drivers.service");
const batch_service_1 = require("../batches/batch.service");
let BookingsService = class BookingsService {
    bookingsRepository;
    usersService;
    paymentsService;
    smsService;
    vehiclesService;
    driversService;
    batchService;
    async completeTripsForDriver(driverId, dto) {
        let bookings = [];
        if (dto.all === '*') {
            bookings = await this.bookingsRepository.find({
                where: { driverId, status: (0, typeorm_2.Not)(enums_1.BookingStatus.COMPLETED) },
                relations: ['driver', 'driver.vehicle'],
            });
        }
        else if (dto.startDate && dto.endDate) {
            bookings = await this.bookingsRepository.find({
                where: {
                    driverId,
                    status: (0, typeorm_2.Not)(enums_1.BookingStatus.COMPLETED),
                    departureDate: (0, typeorm_2.Between)(dto.startDate, dto.endDate),
                },
                relations: ['driver', 'driver.vehicle'],
            });
        }
        else {
            throw new common_1.BadRequestException('Provide either all="*" or a valid date range');
        }
        const results = [];
        let vehicleId;
        let vehicleTotalSeats;
        let vehicleCapacity;
        for (const booking of bookings) {
            results.push(await this.updateStatus(booking.id, enums_1.BookingStatus.COMPLETED));
            if (!vehicleId && booking.driver && booking.driver.vehicle) {
                vehicleId = booking.driver.vehicle.id;
                vehicleTotalSeats = booking.driver.vehicle.totalSeats;
                vehicleCapacity = booking.driver.vehicle.capacity;
            }
        }
        if (vehicleId) {
            const vehicle = await this.vehiclesService.findById(vehicleId);
            const resetSeats = (vehicleTotalSeats && vehicleTotalSeats > 0)
                ? vehicleTotalSeats
                : (vehicle && vehicle.capacity ? vehicle.capacity : 4);
            await this.vehiclesService.update(vehicleId, { seatsAvailable: resetSeats });
            await this.driversService.updateStatus(driverId, enums_1.DriverStatus.AVAILABLE);
        }
        return {
            message: `Completed ${results.length} trip(s) for driver`,
            bookingIds: results.map(b => b.id),
        };
    }
    pricingMatrix = {
        Abuakwa: {
            Adum: 10,
            Kejetia: 9,
            Sofoline: 7,
            Kwadaso: 7,
            Asuoyeboah: 6,
            Tanoso: 6,
        },
        Tanoso: { Adum: 8, Kejetia: 7, Sofoline: 6, Kwadaso: 5, Asuoyeboah: 5 },
        Asuoyeboah: { Adum: 6, Kejetia: 5, Kwadaso: 5, Sofoline: 5 },
        Kwadaso: { Adum: 6, Kejetia: 5, Sofoline: 5 },
    };
    constructor(bookingsRepository, usersService, paymentsService, smsService, vehiclesService, driversService, batchService) {
        this.bookingsRepository = bookingsRepository;
        this.usersService = usersService;
        this.paymentsService = paymentsService;
        this.smsService = smsService;
        this.vehiclesService = vehiclesService;
        this.driversService = driversService;
        this.batchService = batchService;
    }
    calculateFare(pickupLocation, dropoffLocation, tripType) {
        if (!pickupLocation ||
            !dropoffLocation ||
            pickupLocation === dropoffLocation) {
            return 0;
        }
        let fare = this.pricingMatrix[pickupLocation]?.[dropoffLocation];
        if (!fare) {
            fare = this.pricingMatrix[dropoffLocation]?.[pickupLocation];
        }
        if (!fare) {
            throw new common_1.BadRequestException('Route not available between selected locations');
        }
        return tripType === enums_1.TripType.ROUND_TRIP ? fare * 2 : fare;
    }
    async create(createBookingDto) {
        const user = await this.usersService.findOrCreate({
            name: createBookingDto.name,
            phone: createBookingDto.phone,
        });
        const totalAmount = this.calculateFare(createBookingDto.pickupLocation, createBookingDto.dropoffLocation, createBookingDto.tripType);
        const booking = this.bookingsRepository.create({
            reference: generator_1.Generators.generateBookingReference(),
            customerId: user.id,
            pickupLocation: createBookingDto.pickupLocation,
            pickupStop: createBookingDto.pickupStop,
            dropoffLocation: createBookingDto.dropoffLocation,
            dropoffStop: createBookingDto.dropoffStop,
            departureTime: createBookingDto.departureTime,
            departureDate: createBookingDto.departureDate,
            tripType: createBookingDto.tripType,
            totalAmount,
            notes: createBookingDto.notes,
            status: enums_1.BookingStatus.PENDING,
        });
        const savedBooking = await this.bookingsRepository.save(booking);
        let paymentInitResponse = undefined;
        if (createBookingDto.paymentMethod === enums_1.PaymentMethod.MOMO ||
            createBookingDto.paymentMethod === enums_1.PaymentMethod.VISA ||
            createBookingDto.paymentMethod === enums_1.PaymentMethod.MASTERCARD) {
            paymentInitResponse = await this.paymentsService.initializePayment({
                bookingId: savedBooking.id,
                amount: totalAmount,
                method: createBookingDto.paymentMethod,
                customerEmail: user.email || `${user.phone}@comfort.com`,
                callbackUrl: '',
            });
        }
        return { booking: savedBooking, paymentInitResponse };
    }
    async findAll() {
        return this.bookingsRepository.find({
            relations: ['customer', 'driver', 'driver.vehicle', 'payment'],
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: [
                'customer',
                'driver',
                'driver.vehicle',
                'payment',
                'trackingData',
            ],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async findByReference(reference) {
        const booking = await this.bookingsRepository.findOne({
            where: { reference },
            relations: ['customer', 'driver', 'driver.vehicle', 'payment'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.driverId && (!booking.driver || !booking.driver.vehicle)) {
            throw new common_1.BadRequestException('Assigned driver does not have a vehicle');
        }
        return booking;
    }
    async findByCustomer(customerId) {
        return this.bookingsRepository.find({
            where: { customerId },
            relations: ['driver', 'driver.vehicle', 'payment'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByDriver(driverId) {
        return this.bookingsRepository.find({
            where: { driverId },
            relations: ['customer', 'payment'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateStatus(id, status, metadata) {
        const booking = await this.findById(id);
        const updateData = { status };
        switch (status) {
            case enums_1.BookingStatus.ASSIGNED:
                updateData.assignedAt = new Date();
                if (metadata?.driverId) {
                    updateData.driverId = metadata.driverId;
                }
                if (metadata?.batchId) {
                    updateData.batchId = metadata.batchId;
                }
                break;
            case enums_1.BookingStatus.IN_PROGRESS:
                updateData.startedAt = new Date();
                break;
            case enums_1.BookingStatus.COMPLETED:
                updateData.completedAt = new Date();
                break;
        }
        await this.bookingsRepository.update(id, updateData);
        const updatedBooking = await this.findById(id);
        if (status === enums_1.BookingStatus.COMPLETED && updatedBooking.batchId) {
            await this.checkAndCompleteBatchIfAllBookingsCompleted(updatedBooking.batchId);
        }
        return updatedBooking;
    }
    async checkAndCompleteBatchIfAllBookingsCompleted(batchId) {
        try {
            const batchBookings = await this.bookingsRepository.find({
                where: { batchId },
            });
            const allCompleted = batchBookings.every((b) => b.status === enums_1.BookingStatus.COMPLETED);
            if (allCompleted && batchBookings.length > 0) {
                await this.batchService.completeBatch(batchId);
            }
        }
        catch (error) {
            console.error(`Error auto-completing batch ${batchId}:`, error);
        }
    }
    async assignDriver(bookingId, driverId) {
        const booking = await this.findById(bookingId);
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (!booking.seatsBooked)
            booking.seatsBooked = 1;
        const driver = await this.driversService.findById(driverId);
        if (!driver)
            throw new common_1.BadRequestException('Driver not found');
        if (!driver.vehicle)
            throw new common_1.BadRequestException('Assigned driver does not have a vehicle');
        const vehicle = await this.vehiclesService.findById(driver.vehicle.id);
        if (!vehicle)
            throw new common_1.BadRequestException('Vehicle not found');
        const canAccept = await this.batchService.canAcceptMoreBookings(driverId);
        let batchId;
        if (canAccept.canAccept && canAccept.currentBatch) {
            const currentBatch = canAccept.currentBatch;
            if (currentBatch.dropoffLocation !== booking.dropoffLocation) {
                throw new common_1.BadRequestException(`Cannot add booking to current batch. Current batch is going to ${currentBatch.dropoffLocation}, but this booking requires dropoff at ${booking.dropoffLocation}. Please complete current batch first.`);
            }
            await this.batchService.addBookingToBatch(currentBatch.id, bookingId, booking.seatsBooked);
            batchId = currentBatch.id;
        }
        else {
            const batch = await this.batchService.createBatch(driverId, vehicle.id, booking.pickupLocation, booking.pickupStop, booking.dropoffLocation, booking.dropoffStop, booking.departureDate, booking.departureTime, booking.seatsBooked, vehicle.totalSeats);
            batchId = batch.id;
        }
        const updatedBooking = await this.updateStatus(bookingId, enums_1.BookingStatus.ASSIGNED, {
            driverId,
            batchId,
        });
        if (updatedBooking && updatedBooking.customer && updatedBooking.customer.phone) {
            const smsMessage = this.smsService.getBookingConfirmationMessage(updatedBooking.reference, updatedBooking.departureTime, updatedBooking.pickupLocation);
            await this.smsService.sendSms(updatedBooking.customer.phone, smsMessage);
        }
        return updatedBooking;
    }
    async cancel(id, reason) {
        const booking = await this.findById(id);
        if ([enums_1.BookingStatus.COMPLETED, enums_1.BookingStatus.CANCELLED].includes(booking.status)) {
            throw new common_1.BadRequestException('Cannot cancel this booking');
        }
        return this.updateStatus(id, enums_1.BookingStatus.CANCELLED);
    }
    async getActiveBookings() {
        return this.bookingsRepository.find({
            where: [
                { status: enums_1.BookingStatus.CONFIRMED },
                { status: enums_1.BookingStatus.ASSIGNED },
                { status: enums_1.BookingStatus.EN_ROUTE },
                { status: enums_1.BookingStatus.ARRIVED },
                { status: enums_1.BookingStatus.IN_PROGRESS },
            ],
            relations: ['customer', 'driver', 'driver.vehicle'],
            order: { createdAt: 'ASC' },
        });
    }
    async getBookingStats(startDate, endDate) {
        const query = this.bookingsRepository.createQueryBuilder('booking');
        if (startDate) {
            query.andWhere('booking.createdAt >= :startDate', { startDate });
        }
        if (endDate) {
            query.andWhere('booking.createdAt <= :endDate', { endDate });
        }
        const totalBookings = await query.getCount();
        const statusCounts = await query
            .select('booking.status, COUNT(booking.id) as count')
            .groupBy('booking.status')
            .getRawMany();
        const totalRevenue = await query
            .select('SUM(booking.totalAmount)', 'total')
            .where('booking.status = :status', { status: enums_1.BookingStatus.COMPLETED })
            .getRawOne();
        return {
            totalBookings,
            statusCounts,
            totalRevenue: parseFloat(totalRevenue?.total || '0'),
        };
    }
    async findWithPagination(queryDto) {
        const { page = 1, limit = 10, status, tripType, customerId, driverId, startDate, endDate, search, } = queryDto;
        const query = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.customer', 'customer')
            .leftJoinAndSelect('booking.driver', 'driver')
            .leftJoinAndSelect('driver.vehicle', 'vehicle')
            .leftJoinAndSelect('booking.payment', 'payment');
        if (status)
            query.andWhere('booking.status = :status', { status });
        if (tripType)
            query.andWhere('booking.tripType = :tripType', { tripType });
        if (customerId)
            query.andWhere('booking.customerId = :customerId', { customerId });
        if (driverId)
            query.andWhere('booking.driverId = :driverId', { driverId });
        if (startDate)
            query.andWhere('booking.createdAt >= :startDate', {
                startDate: new Date(startDate),
            });
        if (endDate)
            query.andWhere('booking.createdAt <= :endDate', {
                endDate: new Date(endDate),
            });
        if (search) {
            query.andWhere('(booking.reference ILIKE :search OR booking.pickupLocation ILIKE :search OR booking.pickupStop ILIKE :search OR booking.dropoffLocation ILIKE :search OR booking.dropoffStop ILIKE :search OR customer.name ILIKE :search)', { search: `%${search}%` });
        }
        const total = await query.getCount();
        const bookings = await query
            .orderBy('booking.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const totalPages = Math.ceil(total / limit);
        return {
            data: bookings,
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
    async getBookingsByDateRange(startDate, endDate) {
        return this.bookingsRepository.find({
            where: { createdAt: (0, typeorm_2.Between)(startDate, endDate) },
            relations: ['customer', 'driver', 'driver.vehicle', 'payment'],
            order: { createdAt: 'DESC' },
        });
    }
    async getUpcomingBookings() {
        const today = new Date().toISOString().split('T')[0];
        return this.bookingsRepository
            .createQueryBuilder('booking')
            .where('booking.departureDate >= :today', { today })
            .andWhere('booking.status IN (:...statuses)', {
            statuses: [
                enums_1.BookingStatus.CONFIRMED,
                enums_1.BookingStatus.ASSIGNED,
                enums_1.BookingStatus.PENDING,
            ],
        })
            .leftJoinAndSelect('booking.customer', 'customer')
            .leftJoinAndSelect('booking.driver', 'driver')
            .leftJoinAndSelect('driver.vehicle', 'vehicle')
            .orderBy('booking.departureDate', 'ASC')
            .addOrderBy('booking.departureTime', 'ASC')
            .getMany();
    }
    async getRecentBookings(limit = 10) {
        return this.bookingsRepository.find({
            relations: ['customer', 'driver', 'driver.vehicle'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }
    async updateBookingLocation(id, locationData) {
        const booking = await this.findById(id);
        if (booking.status !== enums_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Can only update location for pending bookings');
        }
        if (locationData.pickupLocation || locationData.dropoffLocation) {
            const newPickup = locationData.pickupLocation || booking.pickupLocation;
            const newDropoff = locationData.dropoffLocation || booking.dropoffLocation;
            const totalAmount = this.calculateFare(newPickup, newDropoff, booking.tripType);
            await this.bookingsRepository.update(id, {
                ...locationData,
                totalAmount,
            });
        }
        else {
            await this.bookingsRepository.update(id, locationData);
        }
        return this.findById(id);
    }
    async getBookingsByDepartureDate(departureDate) {
        return this.bookingsRepository.find({
            where: { departureDate },
            relations: ['customer', 'driver', 'driver.vehicle'],
            order: { departureTime: 'ASC' },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => payments_service_1.PaymentsService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => batch_service_1.BatchService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        payments_service_1.PaymentsService,
        sms_service_1.SmsService,
        vehicle_service_1.VehiclesService,
        drivers_service_1.DriversService,
        batch_service_1.BatchService])
], BookingsService);
//# sourceMappingURL=booking.service.js.map