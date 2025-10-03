import { Repository } from 'typeorm';
import { DriversService } from '../drivers/drivers.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GetTrackingDto } from './dto/get-tracking.dto';
import { TrackingData } from 'src/database/entities/tracking.entity';
import { BookingsService } from '../bookings/booking.service';
export declare class TrackingService {
    private trackingRepository;
    private bookingsService;
    private driversService;
    constructor(trackingRepository: Repository<TrackingData>, bookingsService: BookingsService, driversService: DriversService);
    updateDriverLocation(updateDto: UpdateLocationDto): Promise<TrackingData>;
    getBookingTracking(getTrackingDto: GetTrackingDto): Promise<TrackingData[]>;
    getLatestDriverLocation(driverId: string, bookingId?: string): Promise<TrackingData | null>;
    getActiveBookingLocation(bookingReference: string): Promise<{
        booking: any;
        latestLocation: TrackingData | null;
        route: any;
    }>;
    getDriverTrackingHistory(driverId: string, startDate: Date, endDate: Date): Promise<TrackingData[]>;
    calculateDistance(trackingData: TrackingData[]): Promise<number>;
    private haversineDistance;
    private deg2rad;
    getTripSummary(bookingId: string): Promise<{
        bookingId: string;
        totalDistance: number;
        duration: number;
        averageSpeed: number;
        maxSpeed: number;
        startTime: null;
        endTime: null;
        totalPoints?: undefined;
    } | {
        bookingId: string;
        totalDistance: number;
        duration: number;
        averageSpeed: number;
        maxSpeed: number;
        startTime: Date;
        endTime: Date;
        totalPoints: number;
    }>;
    cleanupOldTracking(daysToKeep?: number): Promise<number>;
}
