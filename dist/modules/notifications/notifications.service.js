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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const sms_service_1 = require("./sms/sms.service");
const email_service_1 = require("./email/email.service");
const send_notification_dto_1 = require("./dto/send-notification.dto");
let NotificationsService = class NotificationsService {
    smsService;
    emailService;
    constructor(smsService, emailService) {
        this.smsService = smsService;
        this.emailService = emailService;
    }
    async sendNotification(notificationDto) {
        const { type, recipient, message, subject, data } = notificationDto;
        switch (type) {
            case send_notification_dto_1.NotificationType.SMS:
                return this.smsService.sendSms(recipient, message);
            case send_notification_dto_1.NotificationType.EMAIL:
                return this.emailService.sendEmail(recipient, subject || 'COMFORT Notification', message);
            case send_notification_dto_1.NotificationType.WHATSAPP:
                throw new Error('WhatsApp notifications not implemented yet');
            case send_notification_dto_1.NotificationType.PUSH:
                throw new Error('Push notifications not implemented yet');
            default:
                throw new Error('Unsupported notification type');
        }
    }
    async sendBookingConfirmation(customerPhone, customerEmail, bookingDetails) {
        const promises = [];
        if (customerPhone) {
            const smsMessage = this.smsService.getBookingConfirmationMessage(bookingDetails.reference, bookingDetails.pickupTime, bookingDetails.pickupLocation);
            promises.push(this.smsService.sendSms(customerPhone, smsMessage));
        }
        if (customerEmail) {
            const emailHtml = this.emailService.getBookingConfirmationEmail(bookingDetails.customerName, bookingDetails);
            promises.push(this.emailService.sendEmail(customerEmail, 'Booking Confirmed - COMFORT', emailHtml));
        }
        return Promise.allSettled(promises);
    }
    async sendDriverAssigned(customerPhone, bookingRef, driverName, vehiclePlate, eta) {
        const message = this.smsService.getDriverAssignedMessage(bookingRef, driverName, vehiclePlate, eta);
        return this.smsService.sendSms(customerPhone, message);
    }
    async sendDriverArrived(customerPhone, bookingRef, driverName) {
        const message = this.smsService.getDriverArrivedMessage(bookingRef, driverName);
        return this.smsService.sendSms(customerPhone, message);
    }
    async sendTripCompleted(customerPhone, bookingRef, amount) {
        const message = this.smsService.getTripCompletedMessage(bookingRef, amount);
        return this.smsService.sendSms(customerPhone, message);
    }
    async sendBulkNotification(recipients, type, message, subject) {
        switch (type) {
            case send_notification_dto_1.NotificationType.SMS:
                return this.smsService.sendBulkSms(recipients, message);
            case send_notification_dto_1.NotificationType.EMAIL:
                return this.emailService.sendBulkEmail(recipients, subject || 'COMFORT Notification', message);
            default:
                throw new Error('Bulk notifications only supported for SMS and Email');
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sms_service_1.SmsService,
        email_service_1.EmailService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map