import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';
import { TrackingData } from './tracking.entity';
import { DriverStatus } from 'src/shared/enums';
export declare class Driver {
    id: string;
    name: string;
    phone: string;
    email: string;
    licenseNumber: string;
    licenseExpiry: Date;
    status: DriverStatus;
    currentLatitude: number;
    currentLongitude: number;
    lastLocationUpdate: Date;
    rating: number;
    totalTrips: number;
    isActive: boolean;
    documents: Record<string, string>;
    vehicle: Vehicle;
    bookings: Booking[];
    trackingData: TrackingData[];
    createdAt: Date;
    updatedAt: Date;
}
