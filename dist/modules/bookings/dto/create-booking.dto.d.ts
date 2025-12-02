import { TripType } from 'src/shared/enums';
import { PaymentMethod } from 'src/shared/enums';
export declare class CreateBookingDto {
    seatsBooked?: number;
    name: string;
    phone: string;
    pickupLocation: string;
    pickupStop: string;
    dropoffLocation: string;
    dropoffStop: string;
    departureTime: string;
    departureDate: string;
    tripType: TripType;
    notes?: string;
    paymentMethod?: PaymentMethod;
}
