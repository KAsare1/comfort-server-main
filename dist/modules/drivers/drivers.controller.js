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
exports.DriversController = void 0;
const common_1 = require("@nestjs/common");
const drivers_service_1 = require("./drivers.service");
const create_driver_dto_1 = require("./dto/create-driver.dto");
const update_driver_location_dto_1 = require("./dto/update-driver-location.dto");
const driver_query_dto_1 = require("./dto/driver-query.dto");
let DriversController = class DriversController {
    driversService;
    constructor(driversService) {
        this.driversService = driversService;
    }
    create(createDriverDto) {
        return this.driversService.create(createDriverDto);
    }
    findAll() {
        return this.driversService.findAll();
    }
    findAvailable() {
        return this.driversService.findAvailableDrivers();
    }
    findNearby(lat, lng, radius) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = radius ? parseFloat(radius) : 10;
        return this.driversService.findNearbyDrivers(latitude, longitude, radiusKm);
    }
    findOne(id) {
        return this.driversService.findById(id);
    }
    getStats(id) {
        return this.driversService.getDriverStats(id);
    }
    updateLocation(id, locationDto) {
        return this.driversService.updateLocation(id, locationDto);
    }
    updateStatus(id, body) {
        return this.driversService.updateStatus(id, body.status);
    }
    assignToBooking(id, body) {
        return this.driversService.assignToBooking(id, body.bookingId);
    }
    completeTrip(id) {
        return this.driversService.completeTrip(id);
    }
    updateRating(id, body) {
        return this.driversService.updateRating(id, body.rating);
    }
    remove(id) {
        return this.driversService.deactivate(id);
    }
    findWithPagination(queryDto) {
        return this.driversService.findWithPagination(queryDto);
    }
    getOverallStats() {
        return this.driversService.getOverallDriverStats();
    }
    getExpiringLicenses(days) {
        const daysAhead = days ? parseInt(days) : 30;
        return this.driversService.getExpiringLicenses(daysAhead);
    }
    updateDocuments(id, body) {
        return this.driversService.updateDocuments(id, body.documents);
    }
};
exports.DriversController = DriversController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_driver_dto_1.CreateDriverDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findAvailable", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getStats", null);
__decorate([
    (0, common_1.Put)(':id/location'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_driver_location_dto_1.UpdateDriverLocationDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "assignToBooking", null);
__decorate([
    (0, common_1.Put)(':id/complete-trip'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "completeTrip", null);
__decorate([
    (0, common_1.Put)(':id/rating'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateRating", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_query_dto_1.DriverQueryDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findWithPagination", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getOverallStats", null);
__decorate([
    (0, common_1.Get)('expiring-licenses'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getExpiringLicenses", null);
__decorate([
    (0, common_1.Put)(':id/documents'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateDocuments", null);
exports.DriversController = DriversController = __decorate([
    (0, common_1.Controller)('drivers'),
    __metadata("design:paramtypes", [drivers_service_1.DriversService])
], DriversController);
//# sourceMappingURL=drivers.controller.js.map