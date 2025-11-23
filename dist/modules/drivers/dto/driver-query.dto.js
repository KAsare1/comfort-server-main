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
exports.DriverQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
class DriverQueryDto {
    page = 1;
    limit = 10;
    status;
    hasVehicle;
    search;
}
exports.DriverQueryDto = DriverQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number for pagination',
        example: 1,
        default: 1,
        minimum: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DriverQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10,
        default: 10,
        minimum: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DriverQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter drivers by status',
        enum: enums_1.DriverStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.DriverStatus),
    __metadata("design:type", String)
], DriverQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter drivers by whether they have an assigned vehicle',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], DriverQueryDto.prototype, "hasVehicle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search drivers by name, phone, or license number',
        example: 'Kwame',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DriverQueryDto.prototype, "search", void 0);
//# sourceMappingURL=driver-query.dto.js.map