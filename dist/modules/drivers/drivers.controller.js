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
const swagger_1 = require("@nestjs/swagger");
const drivers_service_1 = require("./drivers.service");
const create_driver_dto_1 = require("./dto/create-driver.dto");
const update_driver_location_dto_1 = require("./dto/update-driver-location.dto");
const driver_login_dto_1 = require("./dto/driver-login.dto");
const enums_1 = require("../../shared/enums");
const driver_query_dto_1 = require("./dto/driver-query.dto");
const current_driver_decorator_1 = require("./decorators/current-driver.decorator");
const public_decorator_1 = require("./decorators/public.decorator");
const driver_entity_1 = require("../../database/entities/driver.entity");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DriversController = class DriversController {
    driversService;
    constructor(driversService) {
        this.driversService = driversService;
    }
    async login(loginDto) {
        return this.driversService.login(loginDto);
    }
    async getProfile(driver) {
        return this.driversService.getProfile(driver.id);
    }
    async updatePassword(driver, body) {
        await this.driversService.updatePassword(driver.id, body.currentPassword, body.newPassword);
        return { message: 'Password updated successfully' };
    }
    async resetPassword(id, body) {
        await this.driversService.changePassword(id, body.newPassword);
        return { message: 'Password reset successfully' };
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
    findOne(id) {
        return this.driversService.findById(id);
    }
    getStats(id) {
        return this.driversService.getDriverStats(id);
    }
    updateOwnLocation(driver, locationDto) {
        return this.driversService.updateLocation(driver.id, locationDto);
    }
    updateLocation(id, locationDto) {
        return this.driversService.updateLocation(id, locationDto);
    }
    updateOwnStatus(driver, body) {
        if (!body || typeof body.status === 'undefined') {
            throw new (require('@nestjs/common').BadRequestException)('Missing required field: status');
        }
        return this.driversService.updateStatus(driver.id, body.status);
    }
    updateStatus(id, body) {
        if (!body || typeof body.status === 'undefined') {
            throw new (require('@nestjs/common').BadRequestException)('Missing required field: status');
        }
        return this.driversService.updateStatus(id, body.status);
    }
    assignToBooking(id, body) {
        return this.driversService.assignToBooking(id, body.bookingId);
    }
    completeOwnTrip(driver) {
        return this.driversService.completeTrip(driver.id);
    }
    completeTrip(id) {
        return this.driversService.completeTrip(id);
    }
    updateRating(id, body) {
        return this.driversService.updateRating(id, body.rating);
    }
    updateOwnDocuments(driver, body) {
        return this.driversService.updateDocuments(driver.id, body.documents);
    }
    updateDocuments(id, body) {
        return this.driversService.updateDocuments(id, body.documents);
    }
    remove(id) {
        return this.driversService.deactivate(id);
    }
    async removeAll() {
        await this.driversService.deactivateAll();
        return { success: true, message: 'All drivers deactivated' };
    }
};
exports.DriversController = DriversController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login driver with phone and password' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_login_dto_1.DriverLoginDto]),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current authenticated driver profile' }),
    __param(0, (0, current_driver_decorator_1.CurrentDriver)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_entity_1.Driver]),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('password'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change current driver password (requires current password)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                currentPassword: { type: 'string', example: 'oldPassword123' },
                newPassword: { type: 'string', example: 'newPassword456', minLength: 6 },
            },
            required: ['currentPassword', 'newPassword'],
        },
    }),
    __param(0, (0, current_driver_decorator_1.CurrentDriver)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_entity_1.Driver, Object]),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "updatePassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(':id/password/reset'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset driver password (admin only - no verification required)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                newPassword: { type: 'string', example: 'newPassword456', minLength: 6 },
            },
            required: ['newPassword'],
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "resetPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new driver with auto-generated password',
        description: 'Creates a driver and returns the generated password. Save this password to share with the driver.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_driver_dto_1.CreateDriverDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all drivers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available drivers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findAvailable", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Find nearby drivers' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findNearby", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search drivers with pagination' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_query_dto_1.DriverQueryDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findWithPagination", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall driver statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getOverallStats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('expiring-licenses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get drivers with expiring licenses' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getExpiringLicenses", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get driver by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get driver statistics' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "getStats", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('location'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current driver location' }),
    __param(0, (0, current_driver_decorator_1.CurrentDriver)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_entity_1.Driver,
        update_driver_location_dto_1.UpdateDriverLocationDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateOwnLocation", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(':id/location'),
    (0, swagger_1.ApiOperation)({ summary: 'Update driver location by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_driver_location_dto_1.UpdateDriverLocationDto]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateLocation", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current driver status' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: Object.values(enums_1.DriverStatus),
                    description: 'New status for the driver',
                },
            },
            required: ['status'],
        },
    }),
    __param(0, (0, current_driver_decorator_1.CurrentDriver)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_entity_1.Driver, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateOwnStatus", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update driver status by ID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: Object.values(enums_1.DriverStatus),
                },
            },
            required: ['status'],
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateStatus", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(':id/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign driver to booking' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "assignToBooking", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('complete-trip'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete current driver trip' }),
    __param(0, (0, current_driver_decorator_1.CurrentDriver)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_entity_1.Driver]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "completeOwnTrip", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(':id/complete-trip'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete driver trip by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "completeTrip", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(':id/rating'),
    (0, swagger_1.ApiOperation)({ summary: 'Update driver rating' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateRating", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current driver documents' }),
    __param(0, (0, current_driver_decorator_1.CurrentDriver)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [driver_entity_1.Driver, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateOwnDocuments", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Put)(':id/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Update driver documents by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "updateDocuments", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate driver by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriversController.prototype, "remove", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate all drivers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DriversController.prototype, "removeAll", null);
exports.DriversController = DriversController = __decorate([
    (0, swagger_1.ApiTags)('drivers'),
    (0, common_1.Controller)('drivers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [drivers_service_1.DriversService])
], DriversController);
//# sourceMappingURL=drivers.controller.js.map