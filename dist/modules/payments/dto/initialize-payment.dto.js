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
exports.InitializePaymentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../shared/enums");
class InitializePaymentDto {
    bookingId;
    amount;
    method;
    customerEmail;
    callbackUrl;
}
exports.InitializePaymentDto = InitializePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ID of the booking',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "bookingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The payment amount',
        example: 150.5,
        minimum: 0.01,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], InitializePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The payment method to use',
        enum: enums_1.PaymentMethod,
        example: enums_1.PaymentMethod.MOMO,
    }),
    (0, class_validator_1.IsEnum)(enums_1.PaymentMethod),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The customer email address for payment receipt',
        example: 'customer@example.com',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "customerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The callback URL for payment confirmation',
        example: 'https://example.com/payment/callback',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InitializePaymentDto.prototype, "callbackUrl", void 0);
//# sourceMappingURL=initialize-payment.dto.js.map