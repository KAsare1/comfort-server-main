import { ConfigService } from '@nestjs/config';
interface BulkSmsRecipient {
    number: string;
    message: string;
}
export declare class ArkeselService {
    private configService;
    private httpClient;
    private config;
    constructor(configService: ConfigService);
    sendSms(to: string, message: string, sender?: string): Promise<any>;
    sendBulkSms(recipients: string[], message: string, sender?: string): Promise<any[]>;
    sendPersonalizedBulkSms(messages: BulkSmsRecipient[], sender?: string): Promise<any[]>;
    checkBalance(): Promise<{
        balance: number;
        currency: string;
    }>;
    getDeliveryReport(messageId: string): Promise<any>;
    private formatPhoneNumber;
    private isValidGhanaNumber;
    getBookingConfirmationMessage(bookingRef: string, pickupTime: string, pickupLocation: string): string;
    getDriverAssignedMessage(bookingRef: string, driverName: string, vehiclePlate: string, eta: string): string;
    getDriverArrivedMessage(bookingRef: string, driverName: string): string;
    getTripStartedMessage(bookingRef: string, destination: string): string;
    getTripCompletedMessage(bookingRef: string, amount: number): string;
    getPaymentConfirmationMessage(bookingRef: string, amount: number, paymentMethod: string): string;
    getCancellationMessage(bookingRef: string, reason?: string): string;
    getOtpMessage(otp: string, expiryMinutes?: number): string;
    getDriverBookingNotification(bookingRef: string, pickupLocation: string, pickupTime: string): string;
}
export {};
