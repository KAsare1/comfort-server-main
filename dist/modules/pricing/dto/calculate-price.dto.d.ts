import { TripType } from 'src/shared/enums';
export declare class CalculatePriceDto {
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffLatitude: number;
    dropoffLongitude: number;
    tripType: TripType;
    bookingDates: string[];
    pickupTime: string;
    estimatedDuration?: number;
    distance?: number;
}
