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
exports.DriverLocation = void 0;
const typeorm_1 = require("typeorm");
const driver_entity_1 = require("./driver.entity");
let DriverLocation = class DriverLocation {
    id;
    driverId;
    latitude;
    longitude;
    speed;
    heading;
    accuracy;
    timestamp;
    createdAt;
    driver;
};
exports.DriverLocation = DriverLocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DriverLocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], DriverLocation.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 8 }),
    __metadata("design:type", Number)
], DriverLocation.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 11, scale: 8 }),
    __metadata("design:type", Number)
], DriverLocation.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DriverLocation.prototype, "speed", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DriverLocation.prototype, "heading", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 6, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DriverLocation.prototype, "accuracy", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], DriverLocation.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DriverLocation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'driverId' }),
    __metadata("design:type", driver_entity_1.Driver)
], DriverLocation.prototype, "driver", void 0);
exports.DriverLocation = DriverLocation = __decorate([
    (0, typeorm_1.Entity)('driver_locations'),
    (0, typeorm_1.Index)(['driverId', 'timestamp'])
], DriverLocation);
//# sourceMappingURL=driver-location.entity.js.map