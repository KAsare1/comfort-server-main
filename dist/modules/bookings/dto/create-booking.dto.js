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
exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
const enums_2 = require("../../../shared/enums");
class CreateBookingDto {
    seatsBooked;
    name;
    phone;
    pickupLocation;
    pickupStop;
    dropoffLocation;
    dropoffStop;
    departureTime;
    departureDate;
    tripType;
    notes;
    paymentMethod;
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of seats to book',
        example: 2,
        minimum: 1,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "seatsBooked", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the customer',
        example: 'Ama Asante',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The phone number of the customer (Ghana format)',
        example: '+233201234567',
        pattern: '^\\+233[0-9]{9}$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Main pickup location', example: 'Sofoline' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "pickupLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specific pickup stop',
        example: 'Sofoline Main Station',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "pickupStop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Main dropoff location', example: 'Adum' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "dropoffLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Specific dropoff stop', example: 'Adum Market' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "dropoffStop", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Departure time range',
        example: '05:30-05:45',
        pattern: '^[0-2][0-9]:[0-5][0-9]-[0-2][0-9]:[0-5][0-9]$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "departureTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Departure date (YYYY-MM-DD)',
        example: '2025-10-15',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "departureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of trip',
        enum: enums_1.TripType,
        example: enums_1.TripType.ONE_WAY,
    }),
    (0, class_validator_1.IsEnum)(enums_1.TripType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "tripType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes or special requests',
        example: 'Please bring a child seat',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method',
        enum: enums_2.PaymentMethod,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(enums_2.PaymentMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "paymentMethod", void 0);
//# sourceMappingURL=create-booking.dto.js.map