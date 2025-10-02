import { Injectable } from '@nestjs/common';
import { SmsService } from './sms/sms.service';
import { EmailService } from './email/email.service';
import { SendNotificationDto, NotificationType } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private smsService: SmsService,
    private emailService: EmailService,
  ) {}

  async sendNotification(notificationDto: SendNotificationDto) {
    const { type, recipient, message, subject, data } = notificationDto;

    switch (type) {
      case NotificationType.SMS:
        return this.smsService.sendSms(recipient, message);
      
      case NotificationType.EMAIL:
        return this.emailService.sendEmail(recipient, subject || 'COMFORT Notification', message);
      
      case NotificationType.WHATSAPP:
        // TODO: Implement WhatsApp Business API
        throw new Error('WhatsApp notifications not implemented yet');
      
      case NotificationType.PUSH:
        // TODO: Implement push notifications
        throw new Error('Push notifications not implemented yet');
      
      default:
        throw new Error('Unsupported notification type');
    }
  }

  // Booking-specific notification methods
  async sendBookingConfirmation(customerPhone: string, customerEmail: string, bookingDetails: any) {
    const promises = [];

    // Send SMS
    if (customerPhone) {
      const smsMessage = this.smsService.getBookingConfirmationMessage(
        bookingDetails.reference,
        bookingDetails.pickupTime,
        bookingDetails.pickupLocation,
      );
      promises.push(this.smsService.sendSms(customerPhone, smsMessage));
    }

    // Send Email
    if (customerEmail) {
      const emailHtml = this.emailService.getBookingConfirmationEmail(
        bookingDetails.customerName,
        bookingDetails,
      );
      promises.push(this.emailService.sendEmail(
        customerEmail,
        'Booking Confirmed - COMFORT',
        emailHtml,
      ));
    }

    return Promise.allSettled(promises);
  }

  async sendDriverAssigned(customerPhone: string, bookingRef: string, driverName: string, vehiclePlate: string, eta: string) {
    const message = this.smsService.getDriverAssignedMessage(bookingRef, driverName, vehiclePlate, eta);
    return this.smsService.sendSms(customerPhone, message);
  }

  async sendDriverArrived(customerPhone: string, bookingRef: string, driverName: string) {
    const message = this.smsService.getDriverArrivedMessage(bookingRef, driverName);
    return this.smsService.sendSms(customerPhone, message);
  }

  async sendTripCompleted(customerPhone: string, bookingRef: string, amount: number) {
    const message = this.smsService.getTripCompletedMessage(bookingRef, amount);
    return this.smsService.sendSms(customerPhone, message);
  }

  async sendBulkNotification(recipients: string[], type: NotificationType, message: string, subject?: string) {
    switch (type) {
      case NotificationType.SMS:
        return this.smsService.sendBulkSms(recipients, message);
      
      case NotificationType.EMAIL:
        return this.emailService.sendBulkEmail(recipients, subject || 'COMFORT Notification', message);
      
      default:
        throw new Error('Bulk notifications only supported for SMS and Email');
    }
  }
}