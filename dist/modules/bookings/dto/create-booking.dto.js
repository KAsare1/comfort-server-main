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
class CreateBookingDto {
    name;
    phone;
    pickupLocation;
    pickupLatitude;
    pickupLongitude;
    dropoffLocation;
    dropoffLatitude;
    dropoffLongitude;
    pickupTime;
    dropoffTime;
    tripType;
    bookingDates;
    notes;
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the customer',
        example: 'Ama Asante',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The phone number of the customer (Ghana format)',
        example: '+233201234567',
        pattern: '^\\+233[0-9]{9}$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\+233[0-9]{9}$/, { message: 'Phone must be a valid Ghanaian number (+233XXXXXXXXX)' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The pickup location address',
        example: 'Kotoka International Airport, Accra',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "pickupLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The pickup location latitude',
        example: 5.6037,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "pickupLatitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The pickup location longitude',
        example: -0.1670,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "pickupLongitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The dropoff location address',
        example: 'Kwame Nkrumah Circle, Accra',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "dropoffLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The dropoff location latitude',
        example: 5.5560,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "dropoffLatitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The dropoff location longitude',
        example: -0.1969,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "dropoffLongitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The pickup time in HH:MM format',
        example: '14:30',
        pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'pickupTime must be in HH:MM format' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "pickupTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The dropoff time in HH:MM format',
        example: '15:30',
        pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'dropoffTime must be in HH:MM format' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "dropoffTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of trip',
        enum: enums_1.TripType,
        example: enums_1.TripType.SINGLE,
    }),
    (0, class_validator_1.IsEnum)(enums_1.TripType),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "tripType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of booking dates in ISO format',
        example: ['2025-10-15', '2025-10-16'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsDateString)({}, { each: true }),
    __metadata("design:type", Array)
], CreateBookingDto.prototype, "bookingDates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes or special requests for the booking',
        example: 'Please bring a child seat',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "notes", void 0);
//# sourceMappingURL=create-booking.dto.js.map