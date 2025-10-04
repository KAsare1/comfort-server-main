import { TripType } from 'src/shared/enums';
export declare class CreateBookingDto {
    name: string;
    phone: string;
    pickupLocation: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffLocation: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    pickupTime: string;
    dropoffTime?: string;
    tripType: TripType;
    bookingDates: string[];
    notes?: string;
}
