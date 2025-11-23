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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vehicle_entity_1 = require("../../database/entities/vehicle.entity");
const typeorm_2 = require("typeorm");
const enums_1 = require("../../shared/enums");
let VehiclesService = class VehiclesService {
    vehiclesRepository;
    constructor(vehiclesRepository) {
        this.vehiclesRepository = vehiclesRepository;
    }
    async create(createVehicleDto) {
        const existingVehicle = await this.findByLicensePlate(createVehicleDto.licensePlate);
        if (existingVehicle) {
            throw new common_1.ConflictException('Vehicle with this license plate already exists');
        }
        const vehicle = this.vehiclesRepository.create(createVehicleDto);
        return this.vehiclesRepository.save(vehicle);
    }
    async findAll() {
        return this.vehiclesRepository.find({
            relations: ['driver'],
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const vehicle = await this.vehiclesRepository.findOne({
            where: { id },
            relations: ['driver'],
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return vehicle;
    }
    async findByLicensePlate(licensePlate) {
        return this.vehiclesRepository.findOne({
            where: { licensePlate },
            relations: ['driver'],
        });
    }
    async findAvailableVehicles() {
        return this.vehiclesRepository.find({
            where: { status: enums_1.VehicleStatus.ACTIVE },
            relations: ['driver'],
        });
    }
    async findUnassignedVehicles() {
        return this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.driver', 'driver')
            .where('vehicle.status = :status', { status: enums_1.VehicleStatus.ACTIVE })
            .andWhere('driver.id IS NULL')
            .getMany();
    }
    async assignToDriver(vehicleId, driverId) {
        const vehicle = await this.findById(vehicleId);
        const previousDriverId = vehicle.driver ? vehicle.driver.id : null;
        if (previousDriverId && previousDriverId !== driverId) {
        }
        await this.vehiclesRepository
            .createQueryBuilder()
            .relation(vehicle_entity_1.Vehicle, 'driver')
            .of(vehicleId)
            .set(driverId);
        return this.findById(vehicleId);
    }
    async unassignFromDriver(vehicleId) {
        await this.vehiclesRepository
            .createQueryBuilder()
            .relation(vehicle_entity_1.Vehicle, 'driver')
            .of(vehicleId)
            .set(null);
        return this.findById(vehicleId);
    }
    async updateStatus(id, status) {
        const vehicle = await this.findById(id);
        await this.vehiclesRepository.update(id, { status });
        return this.findById(id);
    }
    async update(id, updateData) {
        const vehicle = await this.findById(id);
        if (updateData.licensePlate &&
            updateData.licensePlate !== vehicle.licensePlate) {
            const existingVehicle = await this.findByLicensePlate(updateData.licensePlate);
            if (existingVehicle) {
                throw new common_1.ConflictException('Vehicle with this license plate already exists');
            }
        }
        await this.vehiclesRepository.update(id, updateData);
        return this.findById(id);
    }
    async getExpiringDocuments(daysAhead = 30) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        return this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.driver', 'driver')
            .where('vehicle.insuranceExpiry <= :futureDate OR vehicle.roadworthinessExpiry <= :futureDate', { futureDate })
            .orderBy('vehicle.insuranceExpiry', 'ASC')
            .getMany();
    }
    async getVehicleStats() {
        const totalVehicles = await this.vehiclesRepository.count();
        const statusCounts = await this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .select('vehicle.status, COUNT(vehicle.id) as count')
            .groupBy('vehicle.status')
            .getRawMany();
        const assignedCount = await this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .leftJoin('vehicle.driver', 'driver')
            .where('driver.id IS NOT NULL')
            .getCount();
        const unassignedCount = totalVehicles - assignedCount;
        return {
            totalVehicles,
            assignedCount,
            unassignedCount,
            statusCounts,
        };
    }
    async delete(id) {
        const vehicle = await this.findById(id);
        await this.vehiclesRepository.remove(vehicle);
    }
    async findWithPagination(queryDto) {
        const { page = 1, limit = 10, status, hasDriver, search, make, year, } = queryDto;
        const query = this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.driver', 'driver');
        if (status) {
            query.andWhere('vehicle.status = :status', { status });
        }
        if (hasDriver !== undefined) {
            if (hasDriver) {
                query.andWhere('driver.id IS NOT NULL');
            }
            else {
                query.andWhere('driver.id IS NULL');
            }
        }
        if (search) {
            query.andWhere('(vehicle.licensePlate ILIKE :search OR vehicle.make ILIKE :search OR vehicle.model ILIKE :search OR vehicle.vin ILIKE :search)', { search: `%${search}%` });
        }
        if (make) {
            query.andWhere('vehicle.make ILIKE :make', { make: `%${make}%` });
        }
        if (year) {
            query.andWhere('vehicle.year = :year', { year });
        }
        const total = await query.getCount();
        const vehicles = await query
            .orderBy('vehicle.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        const totalPages = Math.ceil(total / limit);
        return {
            data: vehicles,
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
    async getVehiclesByMake() {
        return this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .select('vehicle.make, COUNT(vehicle.id) as count')
            .groupBy('vehicle.make')
            .orderBy('count', 'DESC')
            .getRawMany();
    }
    async resetSeats(id, seats) {
        const vehicle = await this.findById(id);
        let resetSeats;
        if (typeof seats === 'number' && seats > 0) {
            resetSeats = seats;
        }
        else if (vehicle.totalSeats && vehicle.totalSeats > 0) {
            resetSeats = vehicle.totalSeats;
        }
        else if (vehicle.capacity && vehicle.capacity > 0) {
            resetSeats = vehicle.capacity;
        }
        else {
            resetSeats = 4;
        }
        await this.vehiclesRepository.update(id, { seatsAvailable: resetSeats });
        return this.findById(id);
    }
    async getMaintenanceAlerts() {
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);
        const expiringInsurance = await this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.driver', 'driver')
            .where('vehicle.insuranceExpiry <= :date AND vehicle.insuranceExpiry >= :now', { date: thirtyDaysFromNow, now })
            .orderBy('vehicle.insuranceExpiry', 'ASC')
            .getMany();
        const expiringRoadworthiness = await this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.driver', 'driver')
            .where('vehicle.roadworthinessExpiry <= :date AND vehicle.roadworthinessExpiry >= :now', { date: thirtyDaysFromNow, now })
            .orderBy('vehicle.roadworthinessExpiry', 'ASC')
            .getMany();
        const maintenanceRequired = await this.vehiclesRepository.find({
            where: { status: enums_1.VehicleStatus.MAINTENANCE },
            relations: ['driver'],
        });
        return {
            expiringInsurance,
            expiringRoadworthiness,
            maintenanceRequired,
        };
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicle.service.js.map