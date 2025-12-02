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
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const locations_service_1 = require("./locations.service");
const create_location_dto_1 = require("./dto/create-location.dto");
const geocode_dto_1 = require("./dto/geocode.dto");
let LocationsController = class LocationsController {
    locationsService;
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    create(createLocationDto) {
        return this.locationsService.create(createLocationDto);
    }
    findAll() {
        return this.locationsService.findAll();
    }
    findPopular() {
        return this.locationsService.findPopular();
    }
    searchLocations(query, limit) {
        const limitNum = limit ? parseInt(limit) : 10;
        return this.locationsService.searchLocations(query, limitNum);
    }
    findNearby(lat, lng, radius) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = radius ? parseFloat(radius) : 5;
        return this.locationsService.findNearby(latitude, longitude, radiusKm);
    }
    geocodeForward(geocodeDto) {
        return this.locationsService.geocodeForward(geocodeDto);
    }
    geocodeReverse(lat, lng) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        return this.locationsService.geocodeReverse(latitude, longitude);
    }
    getRoute(routeData) {
        return this.locationsService.getRoute(routeData.start, routeData.end, routeData.profile);
    }
    getOptimizedRoute(routeData) {
        return this.locationsService.getOptimizedRoute(routeData.start, routeData.waypoints, routeData.end);
    }
    getStats() {
        return this.locationsService.getLocationStats();
    }
    findOne(id) {
        return this.locationsService.findById(id);
    }
    update(id, updateLocationDto) {
        return this.locationsService.updateLocation(id, updateLocationDto);
    }
    remove(id) {
        return this.locationsService.deactivateLocation(id);
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_location_dto_1.CreateLocationDto]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('popular'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "findPopular", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "searchLocations", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Post)('geocode/forward'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [geocode_dto_1.GeocodeDto]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "geocodeForward", null);
__decorate([
    (0, common_1.Get)('geocode/reverse'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "geocodeReverse", null);
__decorate([
    (0, common_1.Post)('route'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getRoute", null);
__decorate([
    (0, common_1.Post)('route/optimized'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getOptimizedRoute", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "remove", null);
exports.LocationsController = LocationsController = __decorate([
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map