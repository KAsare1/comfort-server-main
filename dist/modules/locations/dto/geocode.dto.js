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
exports.GeocodeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GeocodeDto {
    query;
    proximity_lat;
    proximity_lng;
    limit;
}
exports.GeocodeDto = GeocodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The search query for geocoding (address or place name)',
        example: 'Kwame Nkrumah Circle, Accra',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GeocodeDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Proximity bias latitude for search results',
        example: 5.6037,
        minimum: -90,
        maximum: 90,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], GeocodeDto.prototype, "proximity_lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Proximity bias longitude for search results',
        example: -0.187,
        minimum: -180,
        maximum: 180,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], GeocodeDto.prototype, "proximity_lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum number of results to return',
        example: 5,
        minimum: 1,
        maximum: 10,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], GeocodeDto.prototype, "limit", void 0);
//# sourceMappingURL=geocode.dto.js.map