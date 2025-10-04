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
const pricing_service_1 = require("../pricing/pricing.service");
const locations_service_1 = require("../locations/locations.service");
let BookingsService = class BookingsService {
    bookingsRepository;
    usersService;
    pricingService;
    locationsService;
    constructor(bookingsRepository, usersService, pricingService, locationsService) {
        this.bookingsRepository = bookingsRepository;
        this.usersService = usersService;
        this.pricingService = pricingService;
        this.locationsService = locationsService;
    }
    async create(createBookingDto) {
        const user = await this.usersService.findOrCreate({
            name: createBookingDto.name,
            phone: createBookingDto.phone,
        });
        const pricing = await this.pricingService.calculateBookingPrice({
            pickupLatitude: createBookingDto.pickupLatitude,
            pickupLongitude: createBookingDto.pickupLongitude,
            dropoffLatitude: createBookingDto.dropoffLatitude,
            dropoffLongitude: createBookingDto.dropoffLongitude,
            tripType: createBookingDto.tripType,
            bookingDates: createBookingDto.bookingDates,
            pickupTime: createBookingDto.pickupTime,
        });
        const route = await this.locationsService.getRoute([createBookingDto.pickupLongitude, createBookingDto.pickupLatitude], [createBookingDto.dropoffLongitude, createBookingDto.dropoffLatitude]);
        const booking = this.bookingsRepository.create({
            reference: generator_1.Generators.generateBookingReference(),
            customerId: user.id,
            pickupLocation: createBookingDto.pickupLocation,
            pickupLatitude: createBookingDto.pickupLatitude,
            pickupLongitude: createBookingDto.pickupLongitude,
            dropoffLocation: createBookingDto.dropoffLocation,
            dropoffLatitude: createBookingDto.dropoffLatitude,
            dropoffLongitude: createBookingDto.dropoffLongitude,
            pickupTime: createBookingDto.pickupTime,
            dropoffTime: createBookingDto.dropoffTime,
            tripType: createBookingDto.tripType,
            bookingDates: createBookingDto.bookingDates,
            totalAmount: pricing.totalAmount,
            distance: route.distance,
            estimatedDuration: route.duration,
            route: route.geometry,
            notes: createBookingDto.notes,
            status: enums_1.BookingStatus.PENDING,
        });
        return this.bookingsRepository.save(booking);
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
            relations: ['customer', 'driver', 'driver.vehicle', 'payment', 'trackingData'],
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
                break;
            case enums_1.BookingStatus.IN_PROGRESS:
                updateData.startedAt = new Date();
                break;
            case enums_1.BookingStatus.COMPLETED:
                updateData.completedAt = new Date();
                break;
        }
        await this.bookingsRepository.update(id, updateData);
        return this.findById(id);
    }
    async assignDriver(bookingId, driverId) {
        return this.updateStatus(bookingId, enums_1.BookingStatus.ASSIGNED, { driverId });
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
        const { page = 1, limit = 10, status, tripType, customerId, driverId, startDate, endDate, search } = queryDto;
        const query = this.bookingsRepository.createQueryBuilder('booking')
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
            query.andWhere('booking.createdAt >= :startDate', { startDate: new Date(startDate) });
        if (endDate)
            query.andWhere('booking.createdAt <= :endDate', { endDate: new Date(endDate) });
        if (search)
            query.andWhere('(booking.reference ILIKE :search OR booking.pickupLocation ILIKE :search OR booking.dropoffLocation ILIKE :search OR customer.name ILIKE :search)', { search: `%${search}%` });
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
        return this.bookingsRepository.find({
            where: [
                { status: enums_1.BookingStatus.CONFIRMED },
                { status: enums_1.BookingStatus.ASSIGNED },
            ],
            relations: ['customer', 'driver', 'driver.vehicle'],
            order: { scheduledAt: 'ASC' },
        });
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
        await this.bookingsRepository.update(id, locationData);
        return this.findById(id);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        pricing_service_1.PricingService,
        locations_service_1.LocationsService])
], BookingsService);
//# sourceMappingURL=booking.service.js.map