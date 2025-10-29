"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const paystack_service_1 = require("./paystack/paystack.service");
const common_2 = require("@nestjs/common");
const bookings_module_1 = require("../bookings/bookings.module");
const payment_entity_1 = require("../../database/entities/payment.entity");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment]),
            (0, common_2.forwardRef)(() => bookings_module_1.BookingsModule),
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService, paystack_service_1.PaystackService],
        exports: [payments_service_1.PaymentsService, paystack_service_1.PaystackService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map