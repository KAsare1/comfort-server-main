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
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_vehicle_dto_1 = require("./dto/create-vehicle.dto");
const reset_seats_dto_1 = require("./dto/reset-seats.dto");
const vehicle_service_1 = require("./vehicle.service");
const enums_1 = require("../../shared/enums");
const vehicle_query_dto_1 = require("./dto/vehicle-query.dto");
let VehiclesController = class VehiclesController {
    vehiclesService;
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    create(createVehicleDto) {
        return this.vehiclesService.create(createVehicleDto);
    }
    findAll() {
        return this.vehiclesService.findAll();
    }
    findAvailable() {
        return this.vehiclesService.findAvailableVehicles();
    }
    findUnassigned() {
        return this.vehiclesService.findUnassignedVehicles();
    }
    getExpiringDocuments(days) {
        const daysAhead = days ? parseInt(days) : 30;
        return this.vehiclesService.getExpiringDocuments(daysAhead);
    }
    getStats() {
        return this.vehiclesService.getVehicleStats();
    }
    findWithPagination(queryDto) {
        return this.vehiclesService.findWithPagination(queryDto);
    }
    getVehiclesByMake() {
        return this.vehiclesService.getVehiclesByMake();
    }
    getMaintenanceAlerts() {
        return this.vehiclesService.getMaintenanceAlerts();
    }
    findByLicensePlate(licensePlate) {
        return this.vehiclesService.findByLicensePlate(licensePlate);
    }
    findOne(id) {
        return this.vehiclesService.findById(id);
    }
    update(id, updateVehicleDto) {
        return this.vehiclesService.update(id, updateVehicleDto);
    }
    updateStatus(id, body) {
        return this.vehiclesService.updateStatus(id, body.status);
    }
    assignToDriver(id, body) {
        return this.vehiclesService.assignToDriver(id, body.driverId);
    }
    unassignFromDriver(id) {
        return this.vehiclesService.unassignFromDriver(id);
    }
    remove(id) {
        return this.vehiclesService.delete(id);
    }
    async resetSeats(id, body) {
        return this.vehiclesService.resetSeats(id, body.seats);
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new vehicle' }),
    (0, swagger_1.ApiBody)({ type: create_vehicle_dto_1.CreateVehicleDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vehicle created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_dto_1.CreateVehicleDto]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vehicles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all vehicles.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available vehicles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of available vehicles.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findAvailable", null);
__decorate([
    (0, common_1.Get)('unassigned'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all unassigned vehicles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of unassigned vehicles.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findUnassigned", null);
__decorate([
    (0, common_1.Get)('expiring-documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vehicles with expiring documents' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, description: 'Days ahead to check for expiring documents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of vehicles with expiring documents.' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getExpiringDocuments", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vehicle statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle statistics.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search vehicles with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated list of vehicles.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicle_query_dto_1.VehicleQueryDto]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findWithPagination", null);
__decorate([
    (0, common_1.Get)('by-make'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vehicles grouped by make' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicles grouped by make.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getVehiclesByMake", null);
__decorate([
    (0, common_1.Get)('maintenance-alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get maintenance alerts for vehicles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Maintenance alerts for vehicles.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getMaintenanceAlerts", null);
__decorate([
    (0, common_1.Get)('license/:licensePlate'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vehicle by license plate' }),
    (0, swagger_1.ApiParam)({ name: 'licensePlate', description: 'License plate of the vehicle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle with the given license plate.' }),
    __param(0, (0, common_1.Param)('licensePlate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findByLicensePlate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get vehicle by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vehicle ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle with the given ID.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vehicle ID' }),
    (0, swagger_1.ApiBody)({ type: create_vehicle_dto_1.CreateVehicleDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle updated successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle status' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vehicle ID' }),
    (0, swagger_1.ApiBody)({ schema: { properties: { status: { type: 'string', enum: Object.values(enums_1.VehicleStatus) } } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle status updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign vehicle to driver' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vehicle ID' }),
    (0, swagger_1.ApiBody)({ schema: { properties: { driverId: { type: 'string' } } } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle assigned to driver.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "assignToDriver", null);
__decorate([
    (0, common_1.Put)(':id/unassign'),
    (0, swagger_1.ApiOperation)({ summary: 'Unassign vehicle from driver' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vehicle ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle unassigned from driver.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "unassignFromDriver", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete vehicle' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vehicle ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/reset-seats'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset available seats of a vehicle' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Vehicle ID' }),
    (0, swagger_1.ApiBody)({ type: reset_seats_dto_1.ResetSeatsDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle seats reset.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_seats_dto_1.ResetSeatsDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "resetSeats", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, swagger_1.ApiTags)('vehicles'),
    (0, common_1.Controller)('vehicles'),
    __metadata("design:paramtypes", [vehicle_service_1.VehiclesService])
], VehiclesController);
//# sourceMappingURL=vehicle.controller.js.map