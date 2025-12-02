import { NotificationsService } from './notifications.service';
import { SendNotificationDto, NotificationType } from './dto/send-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendNotification(sendNotificationDto: SendNotificationDto): Promise<any>;
    sendBulkNotification(body: {
        recipients: string[];
        type: NotificationType;
        message: string;
        subject?: string;
    }): Promise<any[]>;
    sendBookingConfirmation(body: {
        customerPhone: string;
        customerEmail: string;
        bookingDetails: any;
    }): Promise<PromiseSettledResult<any>[]>;
    sendDriverAssigned(body: {
        customerPhone: string;
        bookingRef: string;
        driverName: string;
        vehiclePlate: string;
        eta: string;
    }): Promise<any>;
    sendDriverArrived(body: {
        customerPhone: string;
        bookingRef: string;
        driverName: string;
    }): Promise<any>;
    sendTripCompleted(body: {
        customerPhone: string;
        bookingRef: string;
        amount: number;
    }): Promise<any>;
}
