import { v4 as uuidv4 } from 'uuid';

export class Generators {
  static generateBookingReference(): string {
    const prefix = 'CMF';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  static generatePaymentReference(): string {
    const prefix = 'PAY';
    const uuid = uuidv4().replace(/-/g, '').substr(0, 8).toUpperCase();
    return `${prefix}-${uuid}`;
  }

  static generateDriverCode(): string {
    const prefix = 'DRV';
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${random}`;
  }
}
