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
exports.CreateVehicleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
class CreateVehicleDto {
    licensePlate;
    make;
    model;
    year;
    color;
    capacity;
    totalSeats;
    seatsAvailable;
    status = enums_1.VehicleStatus.ACTIVE;
    vin;
    insuranceExpiry;
    roadworthinessExpiry;
    features;
}
exports.CreateVehicleDto = CreateVehicleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The license plate number of the vehicle',
        example: 'GH-1234-20',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "licensePlate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The make/manufacturer of the vehicle',
        example: 'Toyota',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "make", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The model of the vehicle',
        example: 'Corolla',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The year the vehicle was manufactured',
        example: 2022,
        minimum: 1900,
        maximum: new Date().getFullYear() + 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(new Date().getFullYear() + 1),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The color of the vehicle',
        example: 'Silver',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The passenger capacity of the vehicle',
        example: 4,
        minimum: 1,
        maximum: 8,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(8),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of seats in the vehicle',
        example: 4,
        minimum: 1,
        maximum: 20,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "totalSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of seats currently available',
        example: 4,
        minimum: 0,
        maximum: 20,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(20),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "seatsAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the vehicle',
        enum: enums_1.VehicleStatus,
        default: enums_1.VehicleStatus.ACTIVE,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(enums_1.VehicleStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The Vehicle Identification Number (VIN)',
        example: '1HGBH41JXMN109186',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "vin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The insurance expiry date',
        example: '2025-12-31',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "insuranceExpiry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The roadworthiness certificate expiry date',
        example: '2025-06-30',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "roadworthinessExpiry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of vehicle features',
        example: ['Air Conditioning', 'GPS', 'Bluetooth'],
        type: [String],
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateVehicleDto.prototype, "features", void 0);
//# sourceMappingURL=create-vehicle.dto.js.map