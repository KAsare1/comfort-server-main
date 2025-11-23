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
exports.CreateDriverDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
class CreateDriverDto {
    name;
    phone;
    email;
    licenseNumber;
    licenseExpiry;
    status = enums_1.DriverStatus.OFFLINE;
    documents;
}
exports.CreateDriverDto = CreateDriverDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the driver',
        example: 'Kwame Mensah',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The phone number of the driver (Ghana format)',
        example: '+233201234567',
    }),
    (0, class_validator_1.IsPhoneNumber)('GH'),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The email address of the driver',
        example: 'kwame.mensah@example.com',
        required: false,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The driver license number',
        example: 'GH-DL-123456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The driver license expiry date',
        example: '2026-12-31',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "licenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The current status of the driver',
        enum: enums_1.DriverStatus,
        default: enums_1.DriverStatus.OFFLINE,
        required: false,
    }),
    (0, class_validator_1.IsEnum)(enums_1.DriverStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDriverDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Driver documents as key-value pairs (document type: URL)',
        example: {
            license: 'https://example.com/license.pdf',
            insurance: 'https://example.com/insurance.pdf',
        },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDriverDto.prototype, "documents", void 0);
//# sourceMappingURL=create-driver.dto.js.map