"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
const drivers_module_1 = require("../drivers/drivers.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("../users/users.module");
const pricing_module_1 = require("../pricing/pricing.module");
const locations_module_1 = require("../locations/locations.module");
const booking_entity_1 = require("../../database/entities/booking.entity");
const booking_controller_1 = require("./booking.controller");
const booking_service_1 = require("./booking.service");
const common_2 = require("@nestjs/common");
const notifications_module_1 = require("../notifications/notifications.module");
const vehicle_module_1 = require("../vehicle/vehicle.module");
const payments_module_1 = require("../payments/payments.module");
const batch_module_1 = require("../batches/batch.module");
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking]),
            users_module_1.UsersModule,
            pricing_module_1.PricingModule,
            locations_module_1.LocationsModule,
            notifications_module_1.NotificationsModule,
            vehicle_module_1.VehiclesModule,
            drivers_module_1.DriversModule,
            (0, common_2.forwardRef)(() => payments_module_1.PaymentsModule),
            (0, common_2.forwardRef)(() => batch_module_1.BatchModule),
        ],
        controllers: [booking_controller_1.BookingsController],
        providers: [booking_service_1.BookingsService],
        exports: [booking_service_1.BookingsService],
    })
], BookingsModule);
//# sourceMappingURL=bookings.module.js.map