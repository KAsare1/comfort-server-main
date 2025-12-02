"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const bull_1 = require("@nestjs/bull");
const throttler_1 = require("@nestjs/throttler");
const redisStore = __importStar(require("cache-manager-redis-store"));
const database_config_1 = require("./config/database.config");
const drivers_module_1 = require("./modules/drivers/drivers.module");
const payments_module_1 = require("./modules/payments/payments.module");
const locations_module_1 = require("./modules/locations/locations.module");
const users_module_1 = require("./modules/users/users.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const batch_module_1 = require("./modules/batches/batch.module");
const vehicle_module_1 = require("./modules/vehicle/vehicle.module");
const tracking_module_1 = require("./modules/tracking/tracking.module");
const pricing_module_1 = require("./modules/pricing/pricing.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => (0, database_config_1.getDatabaseConfig)(configService),
            }),
            cache_manager_1.CacheModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    store: redisStore,
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                    password: configService.get('REDIS_PASSWORD'),
                    ttl: 300,
                }),
                isGlobal: true,
            }),
            bull_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            users_module_1.UsersModule,
            bookings_module_1.BookingsModule,
            batch_module_1.BatchModule,
            drivers_module_1.DriversModule,
            vehicle_module_1.VehiclesModule,
            payments_module_1.PaymentsModule,
            locations_module_1.LocationsModule,
            tracking_module_1.TrackingModule,
            pricing_module_1.PricingModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map