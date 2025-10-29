import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<any> {
    try {
      const result = await this.transporter.sendMail({
        from: `"COMFORT Transport" <${this.configService.get('SMTP_USER')}>`,
        to,
        subject,
        html,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      throw new HttpException(
        `Email sending failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendBulkEmail(
    recipients: string[],
    subject: string,
    html: string,
  ): Promise<any[]> {
    const results = [];

    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail(recipient, subject, html);
        results.push({ recipient, ...result });
      } catch (error) {
        results.push({
          recipient,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  // Email Templates
  getBookingConfirmationEmail(
    customerName: string,
    bookingDetails: any,
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Booking Confirmed!</h2>
        <p>Dear ${customerName},</p>
        <p>Your COMFORT ride has been confirmed. Here are the details:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Trip Details</h3>
          <p><strong>Reference:</strong> ${bookingDetails.reference}</p>
          <p><strong>From:</strong> ${bookingDetails.pickupLocation}</p>
          <p><strong>To:</strong> ${bookingDetails.dropoffLocation}</p>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Time:</strong> ${bookingDetails.time}</p>
          <p><strong>Amount:</strong> GHS ${bookingDetails.amount}</p>
        </div>
        
        <p>You can track your ride using this link: <a href="https://comfort.com/track/${bookingDetails.reference}">Track Your Ride</a></p>
        
        <p>Thank you for choosing COMFORT!</p>
      </div>
    `;
  }
}
