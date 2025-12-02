import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, html: string): Promise<any>;
    sendBulkEmail(recipients: string[], subject: string, html: string): Promise<any[]>;
    getBookingConfirmationEmail(customerName: string, bookingDetails: any): string;
}
