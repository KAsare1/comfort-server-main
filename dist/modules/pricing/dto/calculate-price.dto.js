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
exports.CalculatePriceDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
class CalculatePriceDto {
    pickupLatitude;
    pickupLongitude;
    dropoffLatitude;
    dropoffLongitude;
    tripType;
    bookingDates;
    pickupTime;
    estimatedDuration;
    distance;
}
exports.CalculatePriceDto = CalculatePriceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The latitude of the pickup location',
        example: 5.6037,
        minimum: -90,
        maximum: 90,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "pickupLatitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The longitude of the pickup location',
        example: -0.1870,
        minimum: -180,
        maximum: 180,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "pickupLongitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The latitude of the dropoff location',
        example: 5.5560,
        minimum: -90,
        maximum: 90,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "dropoffLatitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The longitude of the dropoff location',
        example: -0.1969,
        minimum: -180,
        maximum: 180,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "dropoffLongitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of trip',
        enum: enums_1.TripType,
        example: enums_1.TripType.SINGLE,
    }),
    (0, class_validator_1.IsEnum)(enums_1.TripType),
    __metadata("design:type", String)
], CalculatePriceDto.prototype, "tripType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of booking dates in ISO format',
        example: ['2025-10-15', '2025-10-16'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CalculatePriceDto.prototype, "bookingDates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The pickup time in HH:mm format',
        example: '14:30',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CalculatePriceDto.prototype, "pickupTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The estimated duration of the trip in minutes',
        example: 45,
        minimum: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "estimatedDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The distance of the trip in kilometers',
        example: 12.5,
        minimum: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CalculatePriceDto.prototype, "distance", void 0);
//# sourceMappingURL=calculate-price.dto.js.map