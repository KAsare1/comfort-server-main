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
exports.Batch = exports.BatchStatus = void 0;
const typeorm_1 = require("typeorm");
const driver_entity_1 = require("./driver.entity");
const vehicle_entity_1 = require("./vehicle.entity");
const booking_entity_1 = require("./booking.entity");
var BatchStatus;
(function (BatchStatus) {
    BatchStatus["ACTIVE"] = "active";
    BatchStatus["COMPLETED"] = "completed";
    BatchStatus["CANCELLED"] = "cancelled";
})(BatchStatus || (exports.BatchStatus = BatchStatus = {}));
let Batch = class Batch {
    id;
    driver;
    driverId;
    vehicle;
    vehicleId;
    pickupLocation;
    pickupStop;
    dropoffLocation;
    dropoffStop;
    status;
    seatsBooked;
    totalSeats;
    seatsAvailable;
    departureDate;
    departureTime;
    startedAt;
    completedAt;
    bookings;
    createdAt;
    updatedAt;
};
exports.Batch = Batch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Batch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, (driver) => driver.batches, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", driver_entity_1.Driver)
], Batch.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driver_id', nullable: true }),
    __metadata("design:type", String)
], Batch.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'vehicle_id' }),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], Batch.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_id', nullable: true }),
    __metadata("design:type", String)
], Batch.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Batch.prototype, "pickupLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Batch.prototype, "pickupStop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Batch.prototype, "dropoffLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Batch.prototype, "dropoffStop", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BatchStatus,
        default: BatchStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Batch.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Batch.prototype, "seatsBooked", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 4 }),
    __metadata("design:type", Number)
], Batch.prototype, "totalSeats", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 4 }),
    __metadata("design:type", Number)
], Batch.prototype, "seatsAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Batch.prototype, "departureDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Batch.prototype, "departureTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Batch.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Batch.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.batch),
    __metadata("design:type", Array)
], Batch.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Batch.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Batch.prototype, "updatedAt", void 0);
exports.Batch = Batch = __decorate([
    (0, typeorm_1.Entity)('batches')
], Batch);
//# sourceMappingURL=batch.entity.js.map