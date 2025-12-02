import { Driver } from './driver.entity';
import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';
export declare enum BatchStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Batch {
    id: string;
    driver: Driver;
    driverId: string;
    vehicle: Vehicle;
    vehicleId: string;
    pickupLocation: string;
    pickupStop: string;
    dropoffLocation: string;
    dropoffStop: string;
    status: BatchStatus;
    seatsBooked: number;
    totalSeats: number;
    seatsAvailable: number;
    departureDate: string;
    departureTime: string;
    startedAt: Date;
    completedAt: Date;
    bookings: Booking[];
    createdAt: Date;
    updatedAt: Date;
}
