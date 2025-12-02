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
exports.BatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const batch_entity_1 = require("../../database/entities/batch.entity");
const booking_entity_1 = require("../../database/entities/booking.entity");
const driver_entity_1 = require("../../database/entities/driver.entity");
const vehicle_entity_1 = require("../../database/entities/vehicle.entity");
const enums_1 = require("../../shared/enums");
const drivers_service_1 = require("../drivers/drivers.service");
const vehicle_service_1 = require("../vehicle/vehicle.service");
let BatchService = class BatchService {
    batchRepository;
    bookingRepository;
    driverRepository;
    vehicleRepository;
    driversService;
    vehiclesService;
    constructor(batchRepository, bookingRepository, driverRepository, vehicleRepository, driversService, vehiclesService) {
        this.batchRepository = batchRepository;
        this.bookingRepository = bookingRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.driversService = driversService;
        this.vehiclesService = vehiclesService;
    }
    async createBatch(driverId, vehicleId, pickupLocation, pickupStop, dropoffLocation, dropoffStop, departureDate, departureTime, seatsBooked, totalSeats) {
        const driver = await this.driverRepository.findOne({
            where: { id: driverId, isActive: true },
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const vehicle = await this.vehicleRepository.findOne({
            where: { id: vehicleId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        const batch = this.batchRepository.create({
            driverId,
            vehicleId,
            pickupLocation,
            pickupStop: pickupStop ?? null,
            dropoffLocation,
            dropoffStop: dropoffStop ?? null,
            departureDate,
            departureTime,
            status: batch_entity_1.BatchStatus.ACTIVE,
            seatsBooked,
            totalSeats,
            seatsAvailable: Math.max(totalSeats - seatsBooked, 0),
            startedAt: new Date(),
        });
        const saved = await this.batchRepository.save(batch);
        const savedBatch = Array.isArray(saved) ? saved[0] : saved;
        await this.driverRepository.update(driverId, {
            currentBatchId: savedBatch.id,
        });
        return savedBatch;
    }
    async addBookingToBatch(batchId, bookingId, seatsToAdd) {
        const batch = await this.findById(batchId);
        if (batch.status !== batch_entity_1.BatchStatus.ACTIVE) {
            throw new common_1.BadRequestException('Batch is not active');
        }
        if (batch.seatsAvailable < seatsToAdd) {
            throw new common_1.BadRequestException('Not enough seats available in batch');
        }
        const updatedSeatsAvailable = batch.seatsAvailable - seatsToAdd;
        const updatedSeatsBooked = batch.seatsBooked + seatsToAdd;
        await this.batchRepository.update(batchId, {
            seatsAvailable: updatedSeatsAvailable,
            seatsBooked: updatedSeatsBooked,
        });
        const batchNumber = (await this.bookingRepository.count({
            where: { batchId },
        })) + 1;
        await this.bookingRepository.update(bookingId, {
            batchId,
            batchNumber,
        });
        if (updatedSeatsAvailable === 0) {
            await this.driversService.updateStatus(batch.driverId, enums_1.DriverStatus.BUSY);
        }
        return this.findById(batchId);
    }
    async findById(id) {
        const batch = await this.batchRepository.findOne({
            where: { id },
            relations: ['driver', 'vehicle', 'bookings'],
        });
        if (!batch) {
            throw new common_1.NotFoundException('Batch not found');
        }
        return batch;
    }
    async getActiveBatchesForDriver(driverId) {
        return this.batchRepository.find({
            where: { driverId, status: batch_entity_1.BatchStatus.ACTIVE },
            relations: ['bookings', 'vehicle'],
            order: { createdAt: 'DESC' },
        });
    }
    async getCurrentBatchForDriver(driverId) {
        return this.batchRepository.findOne({
            where: { driverId, status: batch_entity_1.BatchStatus.ACTIVE },
            relations: ['bookings', 'vehicle'],
        });
    }
    async verifyBatchDropoffLocation(batchId, currentLocation) {
        const batch = await this.findById(batchId);
        if (batch.dropoffLocation !== currentLocation) {
            throw new common_1.BadRequestException(`Cannot drop off batch at ${currentLocation}. Expected location: ${batch.dropoffLocation}`);
        }
        const bookings = await this.bookingRepository.find({
            where: { batchId },
        });
        const allMatch = bookings.every((booking) => booking.dropoffLocation === currentLocation);
        if (!allMatch) {
            throw new common_1.BadRequestException('Not all bookings in batch have matching dropoff location');
        }
        return true;
    }
    async completeBatch(batchId, dropoffLocation) {
        const batch = await this.findById(batchId);
        if (batch.status !== batch_entity_1.BatchStatus.ACTIVE) {
            throw new common_1.BadRequestException('Batch is not active');
        }
        if (dropoffLocation) {
            await this.verifyBatchDropoffLocation(batchId, dropoffLocation);
        }
        await this.batchRepository.update(batchId, {
            status: batch_entity_1.BatchStatus.COMPLETED,
            completedAt: new Date(),
        });
        await this.bookingRepository.update({ batchId }, { status: enums_1.BookingStatus.COMPLETED, completedAt: new Date() });
        if (batch.vehicleId) {
            const vehicle = await this.vehiclesService.findById(batch.vehicleId);
            await this.vehiclesService.update(batch.vehicleId, {
                seatsAvailable: vehicle.totalSeats,
            });
        }
        if (batch.driverId) {
            await this.driverRepository.update(batch.driverId, {
                currentBatchId: null,
            });
            await this.driversService.updateStatus(batch.driverId, enums_1.DriverStatus.AVAILABLE);
        }
        return this.findById(batchId);
    }
    async cancelBatch(batchId, reason) {
        const batch = await this.findById(batchId);
        if (batch.status !== batch_entity_1.BatchStatus.ACTIVE) {
            throw new common_1.BadRequestException('Only active batches can be cancelled');
        }
        await this.batchRepository.update(batchId, {
            status: batch_entity_1.BatchStatus.CANCELLED,
        });
        const bookings = await this.bookingRepository.find({
            where: { batchId },
        });
        for (const booking of bookings) {
            if (booking.status === enums_1.BookingStatus.ASSIGNED) {
                await this.bookingRepository.update(booking.id, {
                    status: enums_1.BookingStatus.PENDING,
                    driverId: null,
                    batchId: null,
                    batchNumber: null,
                });
            }
        }
        if (batch.vehicleId) {
            const vehicle = await this.vehiclesService.findById(batch.vehicleId);
            await this.vehiclesService.update(batch.vehicleId, {
                seatsAvailable: vehicle.totalSeats,
            });
        }
        if (batch.driverId) {
            await this.driverRepository.update(batch.driverId, {
                currentBatchId: null,
            });
            await this.driversService.updateStatus(batch.driverId, enums_1.DriverStatus.AVAILABLE);
        }
        return this.findById(batchId);
    }
    async getBatchByBookingReference(reference) {
        const booking = await this.bookingRepository.findOne({
            where: { reference },
        });
        if (!booking || !booking.batchId) {
            return null;
        }
        return this.findById(booking.batchId);
    }
    async getBatchesForDriver(driverId, page = 1, limit = 10, status) {
        const query = this.batchRepository
            .createQueryBuilder('batch')
            .where('batch.driverId = :driverId', { driverId })
            .leftJoinAndSelect('batch.bookings', 'bookings')
            .leftJoinAndSelect('batch.vehicle', 'vehicle');
        if (status) {
            query.andWhere('batch.status = :status', { status });
        }
        const total = await query.getCount();
        const batches = await query
            .orderBy('batch.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const totalPages = Math.ceil(total / limit);
        return {
            data: batches,
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
    async canAcceptMoreBookings(driverId) {
        const currentBatch = await this.getCurrentBatchForDriver(driverId);
        if (!currentBatch) {
            return { canAccept: true };
        }
        if (currentBatch.status !== batch_entity_1.BatchStatus.ACTIVE) {
            return {
                canAccept: false,
                reason: 'Current batch is not active',
            };
        }
        if (currentBatch.seatsAvailable <= 0) {
            return {
                canAccept: false,
                currentBatch,
                reason: 'Current batch is full',
            };
        }
        return {
            canAccept: true,
            currentBatch,
        };
    }
};
exports.BatchService = BatchService;
exports.BatchService = BatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(batch_entity_1.Batch)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(2, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(3, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        drivers_service_1.DriversService,
        vehicle_service_1.VehiclesService])
], BatchService);
//# sourceMappingURL=batch.service.js.map