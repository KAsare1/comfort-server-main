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
exports.UpdateVehicleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
class UpdateVehicleDto {
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
}
exports.UpdateVehicleDto = UpdateVehicleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated license plate number',
        example: 'GH-5678-21',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "licensePlate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated make/manufacturer',
        example: 'Honda',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "make", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated model',
        example: 'Civic',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated manufacturing year',
        example: 2023,
        minimum: 1900,
        maximum: new Date().getFullYear() + 1,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(new Date().getFullYear() + 1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateVehicleDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated color',
        example: 'Black',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated passenger capacity',
        example: 5,
        minimum: 1,
        maximum: 8,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(8),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateVehicleDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated total number of seats',
        example: 5,
        minimum: 1,
        maximum: 20,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateVehicleDto.prototype, "totalSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated number of seats available',
        example: 3,
        minimum: 0,
        maximum: 20,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateVehicleDto.prototype, "seatsAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated status of the vehicle',
        enum: enums_1.VehicleStatus,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(enums_1.VehicleStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated VIN',
        example: '1HGBH41JXMN109187',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "vin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated insurance expiry date',
        example: '2026-12-31',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "insuranceExpiry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated roadworthiness expiry date',
        example: '2026-06-30',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "roadworthinessExpiry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated list of vehicle features',
        example: ['Air Conditioning', 'GPS', 'Bluetooth', 'Heated Seats'],
        type: [String],
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateVehicleDto.prototype, "features", void 0);
//# sourceMappingURL=update-vehicle.dto.js.map