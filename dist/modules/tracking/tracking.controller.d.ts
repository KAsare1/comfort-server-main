import { TrackingService } from './tracking.service';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    updateLocation(updateLocationDto: UpdateLocationDto): Promise<import("../../database/entities/tracking.entity").TrackingData>;
    getBookingTracking(bookingId: string, query: any): Promise<import("../../database/entities/tracking.entity").TrackingData[]>;
    getCurrentLocation(bookingId: string): Promise<{
        booking: any;
        latestLocation: import("../../database/entities/tracking.entity").TrackingData | null;
        route: any;
    }>;
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
    getLatestDriverLocation(driverId: string, bookingId?: string): Promise<import("../../database/entities/tracking.entity").TrackingData | null>;
    getDriverHistory(driverId: string, startDate: string, endDate: string): Promise<import("../../database/entities/tracking.entity").TrackingData[]>;
    cleanupOldTracking(body: {
        days?: number;
    }): Promise<number>;
}
