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
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const driver_entity_1 = require("../../database/entities/driver.entity");
const enums_1 = require("../../shared/enums");
const distance_calculator_1 = require("../../common/utils/distance.calculator");
let DriversService = class DriversService {
    driversRepository;
    constructor(driversRepository) {
        this.driversRepository = driversRepository;
    }
    async create(createDriverDto) {
        const existingDriver = await this.findByPhone(createDriverDto.phone);
        if (existingDriver) {
            throw new common_1.ConflictException('Driver with this phone number already exists');
        }
        const driver = this.driversRepository.create(createDriverDto);
        return this.driversRepository.save(driver);
    }
    async findAll() {
        return this.driversRepository.find({
            where: { isActive: true },
            relations: ['vehicle', 'bookings'],
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const driver = await this.driversRepository.findOne({
            where: { id, isActive: true },
            relations: ['vehicle', 'bookings', 'trackingData'],
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        return driver;
    }
    async findByPhone(phone) {
        return this.driversRepository.findOne({
            where: { phone, isActive: true },
            relations: ['vehicle'],
        });
    }
    async findAvailableDrivers() {
        return this.driversRepository.find({
            where: {
                status: enums_1.DriverStatus.AVAILABLE,
                isActive: true,
            },
            relations: ['vehicle'],
        });
    }
    async findNearbyDrivers(latitude, longitude, radiusKm = 10) {
        const availableDrivers = await this.findAvailableDrivers();
        const driversWithLocation = availableDrivers.filter((driver) => driver.currentLatitude && driver.currentLongitude);
        return distance_calculator_1.DistanceCalculator.findNearestDrivers(latitude, longitude, driversWithLocation.map((driver) => ({
            id: driver.id,
            currentLatitude: driver.currentLatitude,
            currentLongitude: driver.currentLongitude,
        })), radiusKm)
            .filter((result) => typeof result.id === 'string')
            .map((result) => {
            const driver = driversWithLocation.find((d) => d.id === result.id);
            if (!driver) {
                throw new common_1.NotFoundException(`Driver with id ${result.id} not found`);
            }
            return { ...driver, distance: result.distance };
        });
    }
    async updateLocation(id, locationDto) {
        const driver = await this.findById(id);
        await this.driversRepository.update(id, {
            currentLatitude: locationDto.latitude,
            currentLongitude: locationDto.longitude,
            lastLocationUpdate: new Date(),
        });
        return this.findById(id);
    }
    async updateStatus(id, status) {
        const driver = await this.findById(id);
        await this.driversRepository.update(id, { status });
        return this.findById(id);
    }
    async assignToBooking(driverId, bookingId) {
        const driver = await this.findById(driverId);
        if (driver.status !== enums_1.DriverStatus.AVAILABLE) {
            throw new common_1.BadRequestException('Driver is not available');
        }
        return driver;
    }
    async completeTrip(driverId) {
        const driver = await this.findById(driverId);
        await this.driversRepository.update(driverId, {
            totalTrips: driver.totalTrips + 1,
            status: enums_1.DriverStatus.AVAILABLE,
        });
        return this.findById(driverId);
    }
    async updateRating(driverId, newRating) {
        const driver = await this.findById(driverId);
        const updatedRating = (driver.rating * driver.totalTrips + newRating) / (driver.totalTrips + 1);
        await this.driversRepository.update(driverId, {
            rating: Math.round(updatedRating * 100) / 100,
        });
        return this.findById(driverId);
    }
    async getDriverStats(driverId) {
        const driver = await this.findById(driverId);
        const bookingStats = await this.driversRepository
            .createQueryBuilder('driver')
            .leftJoin('driver.bookings', 'booking')
            .select([
            'COUNT(booking.id) as totalBookings',
            "COUNT(CASE WHEN booking.status = 'completed' THEN 1 END) as completedBookings",
            "COUNT(CASE WHEN booking.status = 'cancelled' THEN 1 END) as cancelledBookings",
            'AVG(booking.totalAmount) as averageEarnings',
            "SUM(CASE WHEN booking.status = 'completed' THEN booking.totalAmount ELSE 0 END) as totalEarnings",
        ])
            .where('driver.id = :driverId', { driverId })
            .getRawOne();
        return {
            driver: {
                id: driver.id,
                name: driver.name,
                rating: driver.rating,
                totalTrips: driver.totalTrips,
                status: driver.status,
                vehicle: driver.vehicle,
            },
            stats: {
                totalBookings: parseInt(bookingStats.totalBookings) || 0,
                completedBookings: parseInt(bookingStats.completedBookings) || 0,
                cancelledBookings: parseInt(bookingStats.cancelledBookings) || 0,
                averageEarnings: parseFloat(bookingStats.averageEarnings) || 0,
                totalEarnings: parseFloat(bookingStats.totalEarnings) || 0,
                completionRate: bookingStats.totalBookings > 0
                    ? (bookingStats.completedBookings / bookingStats.totalBookings) *
                        100
                    : 0,
            },
        };
    }
    async deactivate(id) {
        await this.driversRepository.update(id, {
            isActive: false,
            status: enums_1.DriverStatus.OFFLINE,
        });
    }
    async findWithPagination(queryDto) {
        const { page = 1, limit = 10, status, hasVehicle, search } = queryDto;
        const query = this.driversRepository
            .createQueryBuilder('driver')
            .leftJoinAndSelect('driver.vehicle', 'vehicle')
            .where('driver.isActive = :isActive', { isActive: true });
        if (status) {
            query.andWhere('driver.status = :status', { status });
        }
        if (hasVehicle !== undefined) {
            if (hasVehicle) {
                query.andWhere('vehicle.id IS NOT NULL');
            }
            else {
                query.andWhere('vehicle.id IS NULL');
            }
        }
        if (search) {
            query.andWhere('(driver.name ILIKE :search OR driver.phone ILIKE :search OR driver.email ILIKE :search OR driver.licenseNumber ILIKE :search)', { search: `%${search}%` });
        }
        const total = await query.getCount();
        const drivers = await query
            .orderBy('driver.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const totalPages = Math.ceil(total / limit);
        return {
            data: drivers,
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
    async getOverallDriverStats() {
        const totalDrivers = await this.driversRepository.count({
            where: { isActive: true },
        });
        const statusCounts = await this.driversRepository
            .createQueryBuilder('driver')
            .select('driver.status, COUNT(driver.id) as count')
            .where('driver.isActive = :isActive', { isActive: true })
            .groupBy('driver.status')
            .getRawMany();
        const averageRating = await this.driversRepository
            .createQueryBuilder('driver')
            .select('AVG(driver.rating)', 'average')
            .where('driver.isActive = :isActive', { isActive: true })
            .getRawOne();
        const topDrivers = await this.driversRepository.find({
            where: { isActive: true },
            order: { rating: 'DESC', totalTrips: 'DESC' },
            take: 5,
            relations: ['vehicle'],
        });
        return {
            totalDrivers,
            statusCounts,
            averageRating: parseFloat(averageRating?.average || '0'),
            topDrivers,
        };
    }
    async getExpiringLicenses(daysAhead = 30) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        return this.driversRepository.find({
            where: {
                isActive: true,
            },
            relations: ['vehicle'],
            order: { licenseExpiry: 'ASC' },
        });
    }
    async updateDocuments(id, documents) {
        const driver = await this.findById(id);
        const updatedDocuments = {
            ...driver.documents,
            ...documents,
        };
        await this.driversRepository.update(id, { documents: updatedDocuments });
        return this.findById(id);
    }
    async deactivateAll() {
        await this.driversRepository.update({ isActive: true }, {
            isActive: false,
            status: enums_1.DriverStatus.OFFLINE,
        });
    }
};
exports.DriversService = DriversService;
exports.DriversService = DriversService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DriversService);
//# sourceMappingURL=drivers.service.js.map