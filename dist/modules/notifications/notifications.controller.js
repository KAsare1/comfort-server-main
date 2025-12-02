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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const send_notification_dto_1 = require("./dto/send-notification.dto");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    sendNotification(sendNotificationDto) {
        return this.notificationsService.sendNotification(sendNotificationDto);
    }
    sendBulkNotification(body) {
        return this.notificationsService.sendBulkNotification(body.recipients, body.type, body.message, body.subject);
    }
    sendBookingConfirmation(body) {
        return this.notificationsService.sendBookingConfirmation(body.customerPhone, body.customerEmail, body.bookingDetails);
    }
    sendDriverAssigned(body) {
        return this.notificationsService.sendDriverAssigned(body.customerPhone, body.bookingRef, body.driverName, body.vehiclePlate, body.eta);
    }
    sendDriverArrived(body) {
        return this.notificationsService.sendDriverArrived(body.customerPhone, body.bookingRef, body.driverName);
    }
    sendTripCompleted(body) {
        return this.notificationsService.sendTripCompleted(body.customerPhone, body.bookingRef, body.amount);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_notification_dto_1.SendNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "sendBulkNotification", null);
__decorate([
    (0, common_1.Post)('booking-confirmation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "sendBookingConfirmation", null);
__decorate([
    (0, common_1.Post)('driver-assigned'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "sendDriverAssigned", null);
__decorate([
    (0, common_1.Post)('driver-arrived'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "sendDriverArrived", null);
__decorate([
    (0, common_1.Post)('trip-completed'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "sendTripCompleted", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map