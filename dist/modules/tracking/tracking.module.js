"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tracking_service_1 = require("./tracking.service");
const tracking_controller_1 = require("./tracking.controller");
const tracking_gateway_1 = require("./tracking.gateway");
const bookings_module_1 = require("../bookings/bookings.module");
const drivers_module_1 = require("../drivers/drivers.module");
const tracking_entity_1 = require("../../database/entities/tracking.entity");
const driver_location_entity_1 = require("../../database/entities/driver-location.entity");
let TrackingModule = class TrackingModule {
};
exports.TrackingModule = TrackingModule;
exports.TrackingModule = TrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([tracking_entity_1.TrackingData, driver_location_entity_1.DriverLocation]),
            bookings_module_1.BookingsModule,
            drivers_module_1.DriversModule,
        ],
        controllers: [tracking_controller_1.TrackingController],
        providers: [tracking_service_1.TrackingService, tracking_gateway_1.TrackingGateway],
        exports: [tracking_service_1.TrackingService, tracking_gateway_1.TrackingGateway],
    })
], TrackingModule);
//# sourceMappingURL=tracking.module.js.map