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
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const arkesel_service_1 = require("./arkesel.service");
let SmsService = class SmsService {
    arkeselService;
    constructor(arkeselService) {
        this.arkeselService = arkeselService;
    }
    async sendSms(to, message, sender) {
        return this.arkeselService.sendSms(to, message, sender);
    }
    async sendBulkSms(recipients, message, sender) {
        return this.arkeselService.sendBulkSms(recipients, message, sender);
    }
    async checkBalance() {
        return this.arkeselService.checkBalance();
    }
    getBookingConfirmationMessage(bookingRef, pickupTime, pickupLocation) {
        return this.arkeselService.getBookingConfirmationMessage(bookingRef, pickupTime, pickupLocation);
    }
    getDriverAssignedMessage(bookingRef, driverName, vehiclePlate, eta) {
        return this.arkeselService.getDriverAssignedMessage(bookingRef, driverName, vehiclePlate, eta);
    }
    getDriverArrivedMessage(bookingRef, driverName) {
        return this.arkeselService.getDriverArrivedMessage(bookingRef, driverName);
    }
    getTripCompletedMessage(bookingRef, amount) {
        return this.arkeselService.getTripCompletedMessage(bookingRef, amount);
    }
    getPaymentConfirmationMessage(bookingRef, amount, paymentMethod) {
        return this.arkeselService.getPaymentConfirmationMessage(bookingRef, amount, paymentMethod);
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [arkesel_service_1.ArkeselService])
], SmsService);
//# sourceMappingURL=sms.service.js.map