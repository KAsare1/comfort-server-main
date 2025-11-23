import { ArkeselService } from './arkesel.service';
export declare class SmsService {
    private arkeselService;
    constructor(arkeselService: ArkeselService);
    sendSms(to: string, message: string, sender?: string): Promise<any>;
    sendBulkSms(recipients: string[], message: string, sender?: string): Promise<any[]>;
    checkBalance(): Promise<{
        balance: number;
        currency: string;
    }>;
    getBookingConfirmationMessage(bookingRef: string, pickupTime: string, pickupLocation: string): string;
    getDriverAssignedMessage(bookingRef: string, driverName: string, vehiclePlate: string, eta: string): string;
    getDriverArrivedMessage(bookingRef: string, driverName: string): string;
    getTripCompletedMessage(bookingRef: string, amount: number): string;
    getPaymentConfirmationMessage(bookingRef: string, amount: number, paymentMethod: string): string;
}
