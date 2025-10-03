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
exports.DriverAssignmentDto = exports.AssignmentStrategy = void 0;
const class_validator_1 = require("class-validator");
var AssignmentStrategy;
(function (AssignmentStrategy) {
    AssignmentStrategy["NEAREST"] = "nearest";
    AssignmentStrategy["MANUAL"] = "manual";
    AssignmentStrategy["ROUND_ROBIN"] = "round_robin";
    AssignmentStrategy["RATING_BASED"] = "rating_based";
})(AssignmentStrategy || (exports.AssignmentStrategy = AssignmentStrategy = {}));
class DriverAssignmentDto {
    bookingId;
    strategy;
    driverId;
}
exports.DriverAssignmentDto = DriverAssignmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DriverAssignmentDto.prototype, "bookingId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(AssignmentStrategy),
    __metadata("design:type", String)
], DriverAssignmentDto.prototype, "strategy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DriverAssignmentDto.prototype, "driverId", void 0);
//# sourceMappingURL=driver-assignment.dto.js.map