import { BookingStatus, TripType } from 'src/shared/enums';
export declare class BookingQueryDto {
    page?: number;
    limit?: number;
    status?: BookingStatus;
    tripType?: TripType;
    customerId?: string;
    driverId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}
