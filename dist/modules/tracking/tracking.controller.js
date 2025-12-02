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
exports.TrackingController = void 0;
const common_1 = require("@nestjs/common");
const tracking_service_1 = require("./tracking.service");
const tracking_gateway_1 = require("./tracking.gateway");
const update_driver_location_dto_1 = require("../drivers/dto/update-driver-location.dto");
const booking_service_1 = require("../bookings/booking.service");
let TrackingController = class TrackingController {
    trackingService;
    trackingGateway;
    bookingsService;
    constructor(trackingService, trackingGateway, bookingsService) {
        this.trackingService = trackingService;
        this.trackingGateway = trackingGateway;
        this.bookingsService = bookingsService;
    }
    async getBookingDriverLocation(reference) {
        try {
            const booking = await this.bookingsService.findByReference(reference);
            if (!booking.driverId) {
                throw new common_1.HttpException('No driver assigned to this booking', common_1.HttpStatus.NOT_FOUND);
            }
            return await this.getDriverLocation(booking.driverId);
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to get booking driver location',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBookingDriverHistory(reference, startDate, endDate) {
        try {
            const booking = await this.bookingsService.findByReference(reference);
            if (!booking.driverId) {
                throw new common_1.HttpException('No driver assigned to this booking', common_1.HttpStatus.NOT_FOUND);
            }
            return await this.getDriverHistory(booking.driverId, startDate, endDate);
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to get booking driver history',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBookingDriverSummary(reference, startDate, endDate) {
        try {
            const booking = await this.bookingsService.findByReference(reference);
            if (!booking.driverId) {
                throw new common_1.HttpException('No driver assigned to this booking', common_1.HttpStatus.NOT_FOUND);
            }
            return await this.getDriverSummary(booking.driverId, startDate, endDate);
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to get booking driver summary',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getBookingDriverStatus(reference) {
        try {
            const booking = await this.bookingsService.findByReference(reference);
            if (!booking.driverId) {
                throw new common_1.HttpException('No driver assigned to this booking', common_1.HttpStatus.NOT_FOUND);
            }
            return await this.getDriverStatus(booking.driverId);
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to get booking driver status',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateDriverLocation(updateDto) {
        try {
            const locationData = await this.trackingService.updateDriverLocation(updateDto);
            this.trackingGateway.server
                .to(`driver-${updateDto.driverId}`)
                .emit('locationUpdate', {
                driverId: updateDto.driverId,
                latitude: updateDto.latitude,
                longitude: updateDto.longitude,
                speed: updateDto.speed,
                heading: updateDto.heading,
                accuracy: updateDto.accuracy,
                timestamp: locationData.timestamp,
            });
            return {
                success: true,
                message: 'Location updated successfully',
                data: locationData,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to update location',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDriverLocation(driverId) {
        try {
            const trackingInfo = await this.trackingService.getDriverTrackingInfo(driverId);
            return {
                success: true,
                data: trackingInfo,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to get driver location',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDriverHistory(driverId, startDate, endDate) {
        try {
            const history = await this.trackingService.getDriverLocationHistory(driverId, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
            return {
                success: true,
                data: history,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to get driver history',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDriverSummary(driverId, startDate, endDate) {
        try {
            const summary = await this.trackingService.getDriverTripSummary(driverId, new Date(startDate), new Date(endDate));
            return {
                success: true,
                data: summary,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to get driver summary',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getActiveDrivers() {
        try {
            const drivers = await this.trackingService.getAllActiveDriversLocations();
            return {
                success: true,
                data: drivers,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to get active drivers',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getNearbyDrivers(lat, lng, radius) {
        try {
            const nearbyDrivers = await this.trackingService.getNearbyDrivers(parseFloat(lat), parseFloat(lng), radius ? parseFloat(radius) : 5);
            return {
                success: true,
                data: nearbyDrivers,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to find nearby drivers',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDriverStatus(driverId) {
        try {
            const isMoving = await this.trackingService.isDriverMoving(driverId);
            return {
                success: true,
                data: {
                    driverId,
                    isMoving,
                    status: isMoving ? 'moving' : 'stationary',
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to get driver status',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async cleanupOldData(body) {
        try {
            const deleted = await this.trackingService.cleanupOldLocations(body.days || 30);
            return {
                success: true,
                message: `Deleted ${deleted} old location records`,
                data: { deleted },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error.message || 'Failed to cleanup data',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TrackingController = TrackingController;
__decorate([
    (0, common_1.Get)('booking/:reference/location'),
    __param(0, (0, common_1.Param)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getBookingDriverLocation", null);
__decorate([
    (0, common_1.Get)('booking/:reference/history'),
    __param(0, (0, common_1.Param)('reference')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getBookingDriverHistory", null);
__decorate([
    (0, common_1.Get)('booking/:reference/summary'),
    __param(0, (0, common_1.Param)('reference')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getBookingDriverSummary", null);
__decorate([
    (0, common_1.Get)('booking/:reference/status'),
    __param(0, (0, common_1.Param)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getBookingDriverStatus", null);
__decorate([
    (0, common_1.Post)('driver/location'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_driver_location_dto_1.UpdateDriverLocationDto]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "updateDriverLocation", null);
__decorate([
    (0, common_1.Get)('driver/:driverId'),
    __param(0, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getDriverLocation", null);
__decorate([
    (0, common_1.Get)('driver/:driverId/history'),
    __param(0, (0, common_1.Param)('driverId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getDriverHistory", null);
__decorate([
    (0, common_1.Get)('driver/:driverId/summary'),
    __param(0, (0, common_1.Param)('driverId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getDriverSummary", null);
__decorate([
    (0, common_1.Get)('drivers/active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getActiveDrivers", null);
__decorate([
    (0, common_1.Get)('drivers/nearby'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getNearbyDrivers", null);
__decorate([
    (0, common_1.Get)('driver/:driverId/status'),
    __param(0, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "getDriverStatus", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrackingController.prototype, "cleanupOldData", null);
exports.TrackingController = TrackingController = __decorate([
    (0, common_1.Controller)('tracking'),
    __metadata("design:paramtypes", [tracking_service_1.TrackingService,
        tracking_gateway_1.TrackingGateway,
        booking_service_1.BookingsService])
], TrackingController);
//# sourceMappingURL=tracking.controller.js.map