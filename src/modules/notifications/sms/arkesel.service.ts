import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { getArkeselConfig } from 'src/config/arkesel.config';

interface ArkeselSmsResponse {
  code: string;
  message: string;
  data?: any;
}

interface BulkSmsRecipient {
  number: string;
  message: string;
}

@Injectable()
export class ArkeselService {
  private httpClient: AxiosInstance;
  private config;

  constructor(private configService: ConfigService) {
    this.config = getArkeselConfig(this.configService);
    
    if (!this.config.apiKey) {
      console.warn('Arkesel API key not configured. SMS service will not work.');
    }

    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'api-key': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Send a single SMS message
   * @param to - Phone number (Ghana format)
   * @param message - SMS message content
   * @param sender - Optional custom sender ID
   */
  async sendSms(to: string, message: string, sender?: string): Promise<any> {
    if (!this.config.apiKey) {
      throw new HttpException('SMS service not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }

    try {
      const formattedNumber = this.formatPhoneNumber(to);
      
      const response = await this.httpClient.post<ArkeselSmsResponse>('/sms/send', {
        sender: sender || this.config.senderId,
        message: message,
        recipients: [formattedNumber],
      });

      if (response.data.code === '1000' || response.data.code === '1100') {
        return {
          success: true,
          messageId: response.data.data?.id || 'N/A',
          status: 'sent',
          provider: 'arkesel',
          recipient: formattedNumber,
        };
      } else {
        throw new Error(response.data.message || 'SMS sending failed');
      }
    } catch (error) {
      console.error('Arkesel SMS Error:', error.response?.data || error.message);
      throw new HttpException(
        `SMS sending failed: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Send bulk SMS messages to multiple recipients
   * @param recipients - Array of phone numbers
   * @param message - SMS message content (same for all)
   * @param sender - Optional custom sender ID
   */
  async sendBulkSms(recipients: string[], message: string, sender?: string): Promise<any[]> {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendSms(recipient, message, sender);
        results.push({ recipient, ...result });
      } catch (error) {
        results.push({ 
          recipient, 
          success: false, 
          error: error.message,
          provider: 'arkesel',
        });
      }
    }

    return results;
  }

  /**
   * Send personalized bulk SMS (different message per recipient)
   * @param messages - Array of {number, message} objects
   * @param sender - Optional custom sender ID
   */
  async sendPersonalizedBulkSms(
    messages: BulkSmsRecipient[],
    sender?: string,
  ): Promise<any[]> {
    const results = [];
    
    for (const msg of messages) {
      try {
        const result = await this.sendSms(msg.number, msg.message, sender);
        results.push(result);
      } catch (error) {
        results.push({ 
          recipient: msg.number,
          success: false, 
          error: error.message,
          provider: 'arkesel',
        });
      }
    }

    return results;
  }

  /**
   * Check SMS balance
   */
  async checkBalance(): Promise<{ balance: number; currency: string }> {
    try {
      const response = await this.httpClient.get('/clients/balance-details');
      
      return {
        balance: parseFloat(response.data.data?.balance || '0'),
        currency: 'GHS',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to check balance: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get SMS delivery report
   * @param messageId - The message ID from send response
   */
  async getDeliveryReport(messageId: string): Promise<any> {
    try {
      const response = await this.httpClient.get(`/sms/${messageId}`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to get delivery report: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Format phone number to Ghana standard
   * Accepts: 0244123456, 244123456, +233244123456
   * Returns: 233244123456 (Arkesel format)
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Remove leading + if present
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    
    // If starts with 0, replace with 233
    if (cleaned.startsWith('0')) {
      return '233' + cleaned.substring(1);
    }
    
    // If doesn't start with 233, add it
    if (!cleaned.startsWith('233')) {
      return '233' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Validate Ghana phone number
   */
  private isValidGhanaNumber(phoneNumber: string): boolean {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Ghana numbers are 233 + 9 digits (e.g., 233244123456)
    return /^233\d{9}$/.test(formatted);
  }

  // ========================================
  // SMS TEMPLATES
  // ========================================

  /**
   * Booking confirmation message
   */
  getBookingConfirmationMessage(
    bookingRef: string,
    pickupTime: string,
    pickupLocation: string,
  ): string {
    return `🚗 COMFORT Booking Confirmed!

Ref: ${bookingRef}
Pickup: ${pickupTime}
Location: ${pickupLocation}

Track your ride: comfort.com/track/${bookingRef}

Thank you for choosing COMFORT!`;
  }

  /**
   * Driver assigned message
   */
  getDriverAssignedMessage(
    bookingRef: string,
    driverName: string,
    vehiclePlate: string,
    eta: string,
  ): string {
    return `🚗 Driver Assigned!

Ref: ${bookingRef}
Driver: ${driverName}
Vehicle: ${vehiclePlate}
ETA: ${eta} mins

Track: comfort.com/track/${bookingRef}`;
  }

  /**
   * Driver arrived message
   */
  getDriverArrivedMessage(bookingRef: string, driverName: string): string {
    return `🚗 Your driver ${driverName} has arrived!

Ref: ${bookingRef}

Please proceed to your pickup location.`;
  }

  /**
   * Trip started message
   */
  getTripStartedMessage(bookingRef: string, destination: string): string {
    return `🚗 Trip Started!

Ref: ${bookingRef}
Destination: ${destination}

Track live: comfort.com/track/${bookingRef}

Have a safe journey!`;
  }

  /**
   * Trip completed message
   */
  getTripCompletedMessage(bookingRef: string, amount: number): string {
    return `✅ Trip Completed!

Ref: ${bookingRef}
Amount: GHS ${amount.toFixed(2)}

Thank you for using COMFORT!
Rate your trip: comfort.com/rate/${bookingRef}`;
  }

  /**
   * Payment confirmation message
   */
  getPaymentConfirmationMessage(
    bookingRef: string,
    amount: number,
    paymentMethod: string,
  ): string {
    return `💳 Payment Confirmed!

Ref: ${bookingRef}
Amount: GHS ${amount.toFixed(2)}
Method: ${paymentMethod}

Your booking is confirmed. Driver will be assigned shortly.`;
  }

  /**
   * Booking cancellation message
   */
  getCancellationMessage(bookingRef: string, reason?: string): string {
    return `❌ Booking Cancelled

Ref: ${bookingRef}
${reason ? `Reason: ${reason}` : ''}

If you have any questions, contact us at support@comfort.com`;
  }

  /**
   * OTP message for verification
   */
  getOtpMessage(otp: string, expiryMinutes: number = 10): string {
    return `Your COMFORT verification code is: ${otp}

This code expires in ${expiryMinutes} minutes.
Do not share this code with anyone.`;
  }

  /**
   * Driver notification for new booking
   */
  getDriverBookingNotification(
    bookingRef: string,
    pickupLocation: string,
    pickupTime: string,
  ): string {
    return `🚗 New Booking Assigned!

Ref: ${bookingRef}
Pickup: ${pickupLocation}
Time: ${pickupTime}

View details in your driver app.`;
  }
}