import { Booking } from './booking.entity';
import { Driver } from './driver.entity';
export declare class TrackingData {
    id: string;
    booking: Booking;
    bookingId: string;
    driver: Driver;
    driverId: string;
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    accuracy: number;
    timestamp: Date;
    createdAt: Date;
}
