"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const drivers_service_1 = require("./drivers.service");
const drivers_controller_1 = require("./drivers.controller");
const driver_entity_1 = require("../../database/entities/driver.entity");
const jwt_strategy_1 = require("../auth/jwt.strategy");
let DriversModule = class DriversModule {
};
exports.DriversModule = DriversModule;
exports.DriversModule = DriversModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([driver_entity_1.Driver]),
            passport_1.PassportModule.register({ defaultStrategy: 'driver-jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-secret-key-change-in-production',
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
                    },
                }),
            }),
        ],
        controllers: [drivers_controller_1.DriversController],
        providers: [drivers_service_1.DriversService, jwt_strategy_1.JwtStrategy],
        exports: [drivers_service_1.DriversService],
    })
], DriversModule);
//# sourceMappingURL=drivers.module.js.map