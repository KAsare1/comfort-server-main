import { BookingStatus } from 'src/shared/enums';
export declare class UpdateBookingDto {
    status?: BookingStatus;
    driverId?: string;
    notes?: string;
    scheduledAt?: string;
}
