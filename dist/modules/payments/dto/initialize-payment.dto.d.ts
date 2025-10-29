import { PaymentMethod } from 'src/shared/enums';
export declare class InitializePaymentDto {
    bookingId: string;
    amount: number;
    method: PaymentMethod;
    customerEmail?: string;
    callbackUrl?: string;
}
