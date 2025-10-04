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
const tracking_entity_1 = require("../../database/entities/tracking.entity");
const booking_service_1 = require("../bookings/booking.service");
const enums_1 = require("../../shared/enums");
let TrackingService = class TrackingService {
    trackingRepository;
    bookingsService;
    driversService;
    constructor(trackingRepository, bookingsService, driversService) {
        this.trackingRepository = trackingRepository;
        this.bookingsService = bookingsService;
        this.driversService = driversService;
    }
    async updateDriverLocation(updateDto) {
        const { bookingId, driverId, latitude, longitude, speed, heading, accuracy } = updateDto;
        const booking = await this.bookingsService.findById(bookingId);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.driverId !== driverId) {
            throw new common_1.BadRequestException('Driver not assigned to this booking');
        }
        const trackableStatuses = [
            enums_1.BookingStatus.ASSIGNED,
            enums_1.BookingStatus.EN_ROUTE,
            enums_1.BookingStatus.ARRIVED,
            enums_1.BookingStatus.IN_PROGRESS,
        ];
        if (!trackableStatuses.includes(booking.status)) {
            throw new common_1.BadRequestException('Booking is not in a trackable state');
        }
        await this.driversService.updateLocation(driverId, {
            latitude,
            longitude,
            speed,
            heading,
            accuracy,
        });
        const trackingData = this.trackingRepository.create({
            bookingId,
            driverId,
            latitude,
            longitude,
            speed,
            heading,
            accuracy,
            timestamp: new Date(),
        });
        return this.trackingRepository.save(trackingData);
    }
    async getBookingTracking(getTrackingDto) {
        const { bookingId, startTime, endTime } = getTrackingDto;
        const query = this.trackingRepository.createQueryBuilder('tracking')
            .where('tracking.bookingId = :bookingId', { bookingId })
            .orderBy('tracking.timestamp', 'ASC');
        if (startTime) {
            query.andWhere('tracking.timestamp >= :startTime', { startTime: new Date(startTime) });
        }
        if (endTime) {
            query.andWhere('tracking.timestamp <= :endTime', { endTime: new Date(endTime) });
        }
        return query.getMany();
    }
    async getLatestDriverLocation(driverId, bookingId) {
        const query = this.trackingRepository.createQueryBuilder('tracking')
            .where('tracking.driverId = :driverId', { driverId })
            .orderBy('tracking.timestamp', 'DESC')
            .limit(1);
        if (bookingId) {
            query.andWhere('tracking.bookingId = :bookingId', { bookingId });
        }
        return query.getOne();
    }
    async getActiveBookingLocation(bookingReference) {
        const booking = await this.bookingsService.findByReference(bookingReference);
        if (!booking.driver) {
            throw new common_1.BadRequestException('No driver assigned to booking');
        }
        const latestLocation = await this.getLatestDriverLocation(booking.driverId, booking.id);
        return {
            booking: {
                id: booking.id,
                reference: booking.reference,
                status: booking.status,
                pickupLocation: booking.pickupLocation,
                dropoffLocation: booking.dropoffLocation,
                pickupLatitude: booking.pickupLatitude,
                pickupLongitude: booking.pickupLongitude,
                dropoffLatitude: booking.dropoffLatitude,
                dropoffLongitude: booking.dropoffLongitude,
                driver: {
                    id: booking.driver.id,
                    name: booking.driver.name,
                    phone: booking.driver.phone,
                    vehicle: booking.driver.vehicle,
                },
            },
            latestLocation,
            route: booking.route,
        };
    }
    async getDriverTrackingHistory(driverId, startDate, endDate) {
        return this.trackingRepository.find({
            where: {
                driverId,
                timestamp: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: { timestamp: 'ASC' },
            relations: ['booking'],
        });
    }
    async calculateDistance(trackingData) {
        if (trackingData.length < 2)
            return 0;
        let totalDistance = 0;
        for (let i = 1; i < trackingData.length; i++) {
            const prev = trackingData[i - 1];
            const current = trackingData[i];
            const distance = this.haversineDistance(prev.latitude, prev.longitude, current.latitude, current.longitude);
            totalDistance += distance;
        }
        return totalDistance;
    }
    haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    async getTripSummary(bookingId) {
        const tracking = await this.getBookingTracking({ bookingId });
        if (tracking.length === 0) {
            return {
                bookingId,
                totalDistance: 0,
                duration: 0,
                averageSpeed: 0,
                maxSpeed: 0,
                startTime: null,
                endTime: null,
            };
        }
        const totalDistance = await this.calculateDistance(tracking);
        const startTime = tracking[0].timestamp;
        const endTime = tracking[tracking.length - 1].timestamp;
        const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
        const speeds = tracking.filter(t => t.speed && t.speed > 0).map(t => t.speed);
        const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
        const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
        return {
            bookingId,
            totalDistance: Math.round(totalDistance * 100) / 100,
            duration: Math.round(duration * 100) / 100,
            averageSpeed: Math.round(averageSpeed * 100) / 100,
            maxSpeed: Math.round(maxSpeed * 100) / 100,
            startTime,
            endTime,
            totalPoints: tracking.length,
        };
    }
    async cleanupOldTracking(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await this.trackingRepository
            .createQueryBuilder()
            .delete()
            .where('timestamp < :cutoffDate', { cutoffDate })
            .execute();
        return result.affected || 0;
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tracking_entity_1.TrackingData)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        booking_service_1.BookingsService,
        drivers_service_1.DriversService])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map