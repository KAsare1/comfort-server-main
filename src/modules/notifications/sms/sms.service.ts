// src/modules/notifications/sms/sms.service.ts (Updated to use Arkesel)
import { Injectable } from '@nestjs/common';
import { ArkeselService } from './arkesel.service';

@Injectable()
export class SmsService {
  constructor(private arkeselService: ArkeselService) {}

  async sendSms(to: string, message: string, sender?: string): Promise<any> {
    return this.arkeselService.sendSms(to, message, sender);
  }

  async sendBulkSms(recipients: string[], message: string, sender?: string): Promise<any[]> {
    return this.arkeselService.sendBulkSms(recipients, message, sender);
  }

  async checkBalance() {
    return this.arkeselService.checkBalance();
  }

  // Template methods - delegate to ArkeselService
  getBookingConfirmationMessage(bookingRef: string, pickupTime: string, pickupLocation: string): string {
    return this.arkeselService.getBookingConfirmationMessage(bookingRef, pickupTime, pickupLocation);
  }

  getDriverAssignedMessage(bookingRef: string, driverName: string, vehiclePlate: string, eta: string): string {
    return this.arkeselService.getDriverAssignedMessage(bookingRef, driverName, vehiclePlate, eta);
  }

  getDriverArrivedMessage(bookingRef: string, driverName: string): string {
    return this.arkeselService.getDriverArrivedMessage(bookingRef, driverName);
  }

  getTripCompletedMessage(bookingRef: string, amount: number): string {
    return this.arkeselService.getTripCompletedMessage(bookingRef, amount);
  }

  getPaymentConfirmationMessage(bookingRef: string, amount: number, paymentMethod: string): string {
    return this.arkeselService.getPaymentConfirmationMessage(bookingRef, amount, paymentMethod);
  }
}

// Example usage in your application
/*
// In any service or controller
constructor(private smsService: SmsService) {}

// Send single SMS
await this.smsService.sendSms(
  '0244123456',
  'Hello from COMFORT!'
);

// Send booking confirmation
const message = this.smsService.getBookingConfirmationMessage(
  'CMF-ABC123',
  '10:00 AM',
  'Accra Mall'
);
await this.smsService.sendSms('0244123456', message);

// Send bulk SMS
await this.smsService.sendBulkSms(
  ['0244123456', '0554987654'],
  'Special offer: 20% off your next ride!'
);
*/