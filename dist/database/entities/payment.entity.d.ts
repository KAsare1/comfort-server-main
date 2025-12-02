import { Booking } from './booking.entity';
import { PaymentMethod, PaymentStatus } from 'src/shared/enums';
export declare class Payment {
    id: string;
    booking: Booking;
    bookingId: string;
    reference: string;
    method: PaymentMethod;
    amount: number;
    status: PaymentStatus;
    paystackReference: string;
    paystackResponse: Record<string, any>;
    paidAt: Date;
    failureReason: string;
    createdAt: Date;
    updatedAt: Date;
}
