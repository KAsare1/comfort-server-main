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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const typeorm_1 = require("typeorm");
const driver_entity_1 = require("./driver.entity");
const enums_1 = require("../../shared/enums");
let Vehicle = class Vehicle {
    id;
    licensePlate;
    make;
    model;
    year;
    color;
    capacity;
    totalSeats;
    seatsAvailable;
    status;
    vin;
    insuranceExpiry;
    roadworthinessExpiry;
    features;
    driver;
    createdAt;
    updatedAt;
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "licensePlate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Vehicle.prototype, "make", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Vehicle.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Vehicle.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 4 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 4 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "totalSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 4 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "seatsAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.VehicleStatus,
        default: enums_1.VehicleStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Vehicle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 17, nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "vin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Vehicle.prototype, "insuranceExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Vehicle.prototype, "roadworthinessExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Vehicle.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => driver_entity_1.Driver, (driver) => driver.vehicle),
    __metadata("design:type", driver_entity_1.Driver)
], Vehicle.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Vehicle.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Vehicle.prototype, "updatedAt", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)('vehicles')
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map