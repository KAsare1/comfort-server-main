import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto, NotificationType } from './dto/send-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationsService.sendNotification(sendNotificationDto);
  }

  @Post('bulk')
  sendBulkNotification(@Body() body: {
    recipients: string[];
    type: NotificationType;
    message: string;
    subject?: string;
  }) {
    return this.notificationsService.sendBulkNotification(
      body.recipients,
      body.type,
      body.message,
      body.subject,
    );
  }

  @Post('booking-confirmation')
  sendBookingConfirmation(@Body() body: {
    customerPhone: string;
    customerEmail: string;
    bookingDetails: any;
  }) {
    return this.notificationsService.sendBookingConfirmation(
      body.customerPhone,
      body.customerEmail,
      body.bookingDetails,
    );
  }

  @Post('driver-assigned')
  sendDriverAssigned(@Body() body: {
    customerPhone: string;
    bookingRef: string;
    driverName: string;
    vehiclePlate: string;
    eta: string;
  }) {
    return this.notificationsService.sendDriverAssigned(
      body.customerPhone,
      body.bookingRef,
      body.driverName,
      body.vehiclePlate,
      body.eta,
    );
  }

  @Post('driver-arrived')
  sendDriverArrived(@Body() body: {
    customerPhone: string;
    bookingRef: string;
    driverName: string;
  }) {
    return this.notificationsService.sendDriverArrived(
      body.customerPhone,
      body.bookingRef,
      body.driverName,
    );
  }

  @Post('trip-completed')
  sendTripCompleted(@Body() body: {
    customerPhone: string;
    bookingRef: string;
    amount: number;
  }) {
    return this.notificationsService.sendTripCompleted(
      body.customerPhone,
      body.bookingRef,
      body.amount,
    );
  }
}