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
exports.UpdateDriverDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
class UpdateDriverDto {
    name;
    phone;
    email;
    licenseNumber;
    licenseExpiry;
    status;
    isActive;
    documents;
}
exports.UpdateDriverDto = UpdateDriverDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated name of the driver',
        example: 'Kwame Mensah',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDriverDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated phone number (Ghana format)',
        example: '+233207654321',
        required: false,
    }),
    (0, class_validator_1.IsPhoneNumber)('GH'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDriverDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated email address',
        example: 'kwame.new@example.com',
        required: false,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDriverDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated driver license number',
        example: 'GH-DL-654321',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDriverDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated license expiry date',
        example: '2027-12-31',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDriverDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The updated status of the driver',
        enum: enums_1.DriverStatus,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(enums_1.DriverStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDriverDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the driver account is active',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDriverDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated driver documents as key-value pairs',
        example: { license: 'https://example.com/new-license.pdf' },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDriverDto.prototype, "documents", void 0);
//# sourceMappingURL=update-driver.dto.js.map