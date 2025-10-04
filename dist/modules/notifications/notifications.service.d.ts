import { SmsService } from './sms/sms.service';
import { EmailService } from './email/email.service';
import { SendNotificationDto, NotificationType } from './dto/send-notification.dto';
export declare class NotificationsService {
    private smsService;
    private emailService;
    constructor(smsService: SmsService, emailService: EmailService);
    sendNotification(notificationDto: SendNotificationDto): Promise<any>;
    sendBookingConfirmation(customerPhone: string, customerEmail: string, bookingDetails: any): Promise<PromiseSettledResult<any>[]>;
    sendDriverAssigned(customerPhone: string, bookingRef: string, driverName: string, vehiclePlate: string, eta: string): Promise<any>;
    sendDriverArrived(customerPhone: string, bookingRef: string, driverName: string): Promise<any>;
    sendTripCompleted(customerPhone: string, bookingRef: string, amount: number): Promise<any>;
    sendBulkNotification(recipients: string[], type: NotificationType, message: string, subject?: string): Promise<any[]>;
}
