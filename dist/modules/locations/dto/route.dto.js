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
exports.RouteDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RouteDto {
    start;
    end;
    profile = 'driving';
    alternatives = false;
    steps = true;
    geometries = true;
}
exports.RouteDto = RouteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The starting coordinates [longitude, latitude]',
        example: [-0.187, 5.6037],
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], RouteDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The ending coordinates [longitude, latitude]',
        example: [-0.1969, 5.556],
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], RouteDto.prototype, "end", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The routing profile to use',
        enum: ['driving', 'walking', 'cycling'],
        example: 'driving',
        default: 'driving',
        required: false,
    }),
    (0, class_validator_1.IsEnum)(['driving', 'walking', 'cycling']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RouteDto.prototype, "profile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to return alternative routes',
        example: false,
        default: false,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], RouteDto.prototype, "alternatives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to include step-by-step directions',
        example: true,
        default: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], RouteDto.prototype, "steps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether to include route geometries',
        example: true,
        default: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], RouteDto.prototype, "geometries", void 0);
//# sourceMappingURL=route.dto.js.map