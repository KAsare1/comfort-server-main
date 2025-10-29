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
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const drivers_service_1 = require("../drivers/drivers.service");
const driver_location_entity_1 = require("../../database/entities/driver-location.entity");
let TrackingService = class TrackingService {
    driverLocationRepository;
    driversService;
    constructor(driverLocationRepository, driversService) {
        this.driverLocationRepository = driverLocationRepository;
        this.driversService = driversService;
    }
    async updateDriverLocation(updateDto) {
        const { driverId, latitude, longitude, speed, heading, accuracy, } = updateDto;
        const driver = await this.driversService.findById(driverId);
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const locationData = this.driverLocationRepository.create({
            driverId,
            latitude,
            longitude,
            speed,
            heading,
            accuracy,
            timestamp: new Date(),
        });
        return this.driverLocationRepository.save(locationData);
    }
    async getDriverLatestLocation(driverId) {
        const location = await this.driverLocationRepository
            .createQueryBuilder('location')
            .where('location.driverId = :driverId', { driverId })
            .orderBy('location.timestamp', 'DESC')
            .limit(1)
            .getOne();
        return location;
    }
    async getDriverTrackingInfo(driverId) {
        const driver = await this.driversService.findById(driverId);
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const location = await this.getDriverLatestLocation(driverId);
        return {
            driver: {
                id: driver.id,
                name: driver.name,
                phone: driver.phone,
                vehicle: driver.vehicle,
                status: driver.status,
            },
            location,
        };
    }
    async getDriverLocationHistory(driverId, startDate, endDate) {
        const query = this.driverLocationRepository
            .createQueryBuilder('location')
            .where('location.driverId = :driverId', { driverId })
            .orderBy('location.timestamp', 'ASC');
        if (startDate) {
            query.andWhere('location.timestamp >= :startDate', { startDate });
        }
        if (endDate) {
            query.andWhere('location.timestamp <= :endDate', { endDate });
        }
        return query.getMany();
    }
    async getAllActiveDriversLocations() {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentLocations = await this.driverLocationRepository
            .createQueryBuilder('location')
            .where('location.timestamp >= :cutoff', { cutoff: fiveMinutesAgo })
            .distinctOn(['location.driverId'])
            .orderBy('location.driverId')
            .addOrderBy('location.timestamp', 'DESC')
            .getMany();
        const driversWithLocations = await Promise.all(recentLocations.map(async (location) => {
            try {
                const driver = await this.driversService.findById(location.driverId);
                return {
                    driver: {
                        id: driver.id,
                        name: driver.name,
                        phone: driver.phone,
                        vehicle: driver.vehicle,
                        status: driver.status,
                    },
                    location,
                };
            }
            catch (error) {
                return null;
            }
        }));
        return driversWithLocations.filter(item => item !== null);
    }
    async calculateDriverDistance(driverId, startDate, endDate) {
        const locations = await this.getDriverLocationHistory(driverId, startDate, endDate);
        if (locations.length < 2)
            return 0;
        let totalDistance = 0;
        for (let i = 1; i < locations.length; i++) {
            const prev = locations[i - 1];
            const current = locations[i];
            const distance = this.haversineDistance(prev.latitude, prev.longitude, current.latitude, current.longitude);
            totalDistance += distance;
        }
        return totalDistance;
    }
    async getDriverTripSummary(driverId, startDate, endDate) {
        const locations = await this.getDriverLocationHistory(driverId, startDate, endDate);
        if (locations.length === 0) {
            return {
                driverId,
                totalDistance: 0,
                duration: 0,
                averageSpeed: 0,
                maxSpeed: 0,
                startTime: null,
                endTime: null,
                totalPoints: 0,
            };
        }
        const totalDistance = await this.calculateDriverDistance(driverId, startDate, endDate);
        const startTime = locations[0].timestamp;
        const endTime = locations[locations.length - 1].timestamp;
        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        const speeds = locations
            .map((l) => l.speed)
            .filter((speed) => typeof speed === 'number' && speed > 0);
        const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
        const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
        return {
            driverId,
            totalDistance: Math.round(totalDistance * 100) / 100,
            duration: Math.round(duration * 100) / 100,
            averageSpeed: Math.round(averageSpeed * 100) / 100,
            maxSpeed: Math.round(maxSpeed * 100) / 100,
            startTime,
            endTime,
            totalPoints: locations.length,
        };
    }
    async isDriverMoving(driverId) {
        const location = await this.getDriverLatestLocation(driverId);
        if (!location)
            return false;
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (location.timestamp < fiveMinutesAgo)
            return false;
        return location.speed !== null && location.speed > 5;
    }
    async getNearbyDrivers(latitude, longitude, radiusKm = 5) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentLocations = await this.driverLocationRepository
            .createQueryBuilder('location')
            .where('location.timestamp >= :cutoff', { cutoff: fiveMinutesAgo })
            .distinctOn(['location.driverId'])
            .orderBy('location.driverId')
            .addOrderBy('location.timestamp', 'DESC')
            .getMany();
        const nearbyDrivers = [];
        for (const location of recentLocations) {
            const distance = this.haversineDistance(latitude, longitude, location.latitude, location.longitude);
            if (distance <= radiusKm) {
                try {
                    const driver = await this.driversService.findById(location.driverId);
                    nearbyDrivers.push({
                        driver: {
                            id: driver.id,
                            name: driver.name,
                            phone: driver.phone,
                            vehicle: driver.vehicle,
                            status: driver.status,
                        },
                        location,
                        distance: Math.round(distance * 100) / 100,
                    });
                }
                catch (error) {
                    continue;
                }
            }
        }
        return nearbyDrivers.sort((a, b) => a.distance - b.distance);
    }
    async cleanupOldLocations(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await this.driverLocationRepository
            .createQueryBuilder()
            .delete()
            .where('timestamp < :cutoffDate', { cutoffDate })
            .execute();
        return result.affected || 0;
    }
    haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(driver_location_entity_1.DriverLocation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        drivers_service_1.DriversService])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map