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
const create_vehicle_dto_1 = require("./dto/create-vehicle.dto");
const vehicle_service_1 = require("./vehicle.service");
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
    findWithPagination(queryDto) {
        return this.vehiclesService.findWithPagination(queryDto);
    }
    getVehiclesByMake() {
        return this.vehiclesService.getVehiclesByMake();
    }
    getMaintenanceAlerts() {
        return this.vehiclesService.getMaintenanceAlerts();
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_dto_1.CreateVehicleDto]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findAvailable", null);
__decorate([
    (0, common_1.Get)('unassigned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findUnassigned", null);
__decorate([
    (0, common_1.Get)('expiring-documents'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getExpiringDocuments", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('license/:licensePlate'),
    __param(0, (0, common_1.Param)('licensePlate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findByLicensePlate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "assignToDriver", null);
__decorate([
    (0, common_1.Put)(':id/unassign'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "unassignFromDriver", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vehicle_query_dto_1.VehicleQueryDto]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findWithPagination", null);
__decorate([
    (0, common_1.Get)('by-make'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getVehiclesByMake", null);
__decorate([
    (0, common_1.Get)('maintenance-alerts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "getMaintenanceAlerts", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, common_1.Controller)('vehicles'),
    __metadata("design:paramtypes", [vehicle_service_1.VehiclesService])
], VehiclesController);
//# sourceMappingURL=vehicle.controller.js.map