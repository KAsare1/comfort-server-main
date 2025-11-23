export declare enum NotificationType {
    SMS = "sms",
    EMAIL = "email",
    WHATSAPP = "whatsapp",
    PUSH = "push"
}
export declare class SendNotificationDto {
    recipient: string;
    type: NotificationType;
    message: string;
    subject?: string;
    data?: Record<string, any>;
}
