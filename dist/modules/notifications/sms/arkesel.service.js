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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArkeselService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const arkesel_config_1 = require("../../../config/arkesel.config");
let ArkeselService = class ArkeselService {
    configService;
    httpClient;
    config;
    constructor(configService) {
        this.configService = configService;
        this.config = (0, arkesel_config_1.getArkeselConfig)(this.configService);
        if (!this.config.apiKey) {
            console.warn('Arkesel API key not configured. SMS service will not work.');
        }
        this.httpClient = axios_1.default.create({
            baseURL: this.config.baseUrl,
            headers: {
                'api-key': this.config.apiKey,
                'Content-Type': 'application/json',
            },
        });
    }
    async sendSms(to, message, sender) {
        if (!this.config.apiKey) {
            throw new common_1.HttpException('SMS service not configured', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        try {
            const formattedNumber = this.formatPhoneNumber(to);
            const response = await this.httpClient.post('/sms/send', {
                sender: sender || this.config.senderId,
                message: message,
                recipients: [formattedNumber],
            });
            if (response.data.code === '1000' ||
                response.data.code === '1100' ||
                response.data.status === 'success') {
                let messageId = 'N/A';
                if (Array.isArray(response.data.data) &&
                    response.data.data.length > 0) {
                    messageId = response.data.data[0].id;
                }
                else if (response.data.data?.id) {
                    messageId = response.data.data.id;
                }
                return {
                    success: true,
                    messageId,
                    status: 'sent',
                    provider: 'arkesel',
                    recipient: formattedNumber,
                };
            }
            else {
                console.error('Arkesel API Error Response:', response.data);
                throw new Error(response.data.message || 'SMS sending failed');
            }
        }
        catch (error) {
            console.error('Arkesel SMS Error:', error);
            if (error.response) {
                console.error('Arkesel Error Response Data:', error.response.data);
            }
            throw new common_1.HttpException(`SMS sending failed: ${error.response?.data?.message || error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async sendBulkSms(recipients, message, sender) {
        const results = [];
        for (const recipient of recipients) {
            try {
                const result = await this.sendSms(recipient, message, sender);
                results.push({ recipient, ...result });
            }
            catch (error) {
                results.push({
                    recipient,
                    success: false,
                    error: error.message,
                    provider: 'arkesel',
                });
            }
        }
        return results;
    }
    async sendPersonalizedBulkSms(messages, sender) {
        const results = [];
        for (const msg of messages) {
            try {
                const result = await this.sendSms(msg.number, msg.message, sender);
                results.push(result);
            }
            catch (error) {
                results.push({
                    recipient: msg.number,
                    success: false,
                    error: error.message,
                    provider: 'arkesel',
                });
            }
        }
        return results;
    }
    async checkBalance() {
        try {
            const response = await this.httpClient.get('/clients/balance-details');
            return {
                balance: parseFloat(response.data.data?.balance || '0'),
                currency: 'GHS',
            };
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to check balance: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDeliveryReport(messageId) {
        try {
            const response = await this.httpClient.get(`/sms/${messageId}`);
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get delivery report: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    formatPhoneNumber(phoneNumber) {
        let cleaned = phoneNumber.replace(/[^\d+]/g, '');
        if (cleaned.startsWith('+')) {
            cleaned = cleaned.substring(1);
        }
        if (cleaned.startsWith('0')) {
            return '233' + cleaned.substring(1);
        }
        if (!cleaned.startsWith('233')) {
            return '233' + cleaned;
        }
        return cleaned;
    }
    isValidGhanaNumber(phoneNumber) {
        const formatted = this.formatPhoneNumber(phoneNumber);
        return /^233\d{9}$/.test(formatted);
    }
    getBookingConfirmationMessage(bookingRef, pickupTime, pickupLocation) {
        return `🚗 COMFORT Booking Confirmed!

Ref: ${bookingRef}
Pickup: ${pickupTime}
Location: ${pickupLocation}

Track your ride: comfort.com/track/${bookingRef}

Thank you for choosing COMFORT!`;
    }
    getDriverAssignedMessage(bookingRef, driverName, vehiclePlate, eta) {
        return `🚗 Driver Assigned!

Ref: ${bookingRef}
Driver: ${driverName}
Vehicle: ${vehiclePlate}
ETA: ${eta} mins

Track: comfort.com/track/${bookingRef}`;
    }
    getDriverArrivedMessage(bookingRef, driverName) {
        return `🚗 Your driver ${driverName} has arrived!

Ref: ${bookingRef}

Please proceed to your pickup location.`;
    }
    getTripStartedMessage(bookingRef, destination) {
        return `🚗 Trip Started!

Ref: ${bookingRef}
Destination: ${destination}

Track live: comfort.com/track/${bookingRef}

Have a safe journey!`;
    }
    getTripCompletedMessage(bookingRef, amount) {
        return `✅ Trip Completed!

Ref: ${bookingRef}
Amount: GHS ${amount.toFixed(2)}

Thank you for using COMFORT!
Rate your trip: comfort.com/rate/${bookingRef}`;
    }
    getPaymentConfirmationMessage(bookingRef, amount, paymentMethod) {
        return `💳 Payment Confirmed!

Ref: ${bookingRef}
Amount: GHS ${amount.toFixed(2)}
Method: ${paymentMethod}

Your booking is confirmed. Driver will be assigned shortly.`;
    }
    getCancellationMessage(bookingRef, reason) {
        return `❌ Booking Cancelled

Ref: ${bookingRef}
${reason ? `Reason: ${reason}` : ''}

If you have any questions, contact us at support@comfort.com`;
    }
    getOtpMessage(otp, expiryMinutes = 10) {
        return `Your COMFORT verification code is: ${otp}

This code expires in ${expiryMinutes} minutes.
Do not share this code with anyone.`;
    }
    getDriverBookingNotification(bookingRef, pickupLocation, pickupTime) {
        return `🚗 New Booking Assigned!

Ref: ${bookingRef}
Pickup: ${pickupLocation}
Time: ${pickupTime}

View details in your driver app.`;
    }
};
exports.ArkeselService = ArkeselService;
exports.ArkeselService = ArkeselService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ArkeselService);
//# sourceMappingURL=arkesel.service.js.map