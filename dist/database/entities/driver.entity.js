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
exports.Driver = void 0;
const typeorm_1 = require("typeorm");
const vehicle_entity_1 = require("./vehicle.entity");
const booking_entity_1 = require("./booking.entity");
const batch_entity_1 = require("./batch.entity");
const tracking_entity_1 = require("./tracking.entity");
const enums_1 = require("../../shared/enums");
const class_transformer_1 = require("class-transformer");
let Driver = class Driver {
    id;
    name;
    phone;
    email;
    password;
    licenseNumber;
    licenseExpiry;
    status;
    currentLatitude;
    currentLongitude;
    lastLocationUpdate;
    rating;
    totalTrips;
    isActive;
    currentBatchId;
    documents;
    vehicle;
    bookings;
    batches;
    trackingData;
    createdAt;
    updatedAt;
};
exports.Driver = Driver;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Driver.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Driver.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Driver.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Driver.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, default: "asare" }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], Driver.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Driver.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Driver.prototype, "licenseExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.DriverStatus,
        default: enums_1.DriverStatus.OFFLINE,
    }),
    __metadata("design:type", String)
], Driver.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Driver.prototype, "currentLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Driver.prototype, "currentLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Driver.prototype, "lastLocationUpdate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 5.0 }),
    __metadata("design:type", Number)
], Driver.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "totalTrips", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Driver.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_batch_id', nullable: true }),
    __metadata("design:type", String)
], Driver.prototype, "currentBatchId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Driver.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => vehicle_entity_1.Vehicle, (vehicle) => vehicle.driver),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], Driver.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.driver),
    __metadata("design:type", Array)
], Driver.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => batch_entity_1.Batch, (batch) => batch.driver),
    __metadata("design:type", Array)
], Driver.prototype, "batches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tracking_entity_1.TrackingData, (tracking) => tracking.driver),
    __metadata("design:type", Array)
], Driver.prototype, "trackingData", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Driver.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Driver.prototype, "updatedAt", void 0);
exports.Driver = Driver = __decorate([
    (0, typeorm_1.Entity)('drivers')
], Driver);
//# sourceMappingURL=driver.entity.js.map