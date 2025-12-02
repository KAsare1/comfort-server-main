import { TrackingService } from './tracking.service';
import { TrackingGateway } from './tracking.gateway';
import { UpdateDriverLocationDto } from '../drivers/dto/update-driver-location.dto';
import { BookingsService } from '../bookings/booking.service';
export declare class TrackingController {
    private readonly trackingService;
    private readonly trackingGateway;
    private readonly bookingsService;
    constructor(trackingService: TrackingService, trackingGateway: TrackingGateway, bookingsService: BookingsService);
    getBookingDriverLocation(reference: string): Promise<{
        success: boolean;
        data: {
            driver: any;
            location: import("../../database/entities/driver-location.entity").DriverLocation | null;
        };
    }>;
    getBookingDriverHistory(reference: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: import("../../database/entities/driver-location.entity").DriverLocation[];
    }>;
    getBookingDriverSummary(reference: string, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: {
            driverId: string;
            totalDistance: number;
            duration: number;
            averageSpeed: number;
            maxSpeed: number;
            startTime: null;
            endTime: null;
            totalPoints: number;
        } | {
            driverId: string;
            totalDistance: number;
            duration: number;
            averageSpeed: number;
            maxSpeed: number;
            startTime: Date;
            endTime: Date;
            totalPoints: number;
        };
    }>;
    getBookingDriverStatus(reference: string): Promise<{
        success: boolean;
        data: {
            driverId: string;
            isMoving: boolean;
            status: string;
        };
    }>;
    updateDriverLocation(updateDto: UpdateDriverLocationDto): Promise<{
        success: boolean;
        message: string;
        data: import("../../database/entities/driver-location.entity").DriverLocation;
    }>;
    getDriverLocation(driverId: string): Promise<{
        success: boolean;
        data: {
            driver: any;
            location: import("../../database/entities/driver-location.entity").DriverLocation | null;
        };
    }>;
    getDriverHistory(driverId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: import("../../database/entities/driver-location.entity").DriverLocation[];
    }>;
    getDriverSummary(driverId: string, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: {
            driverId: string;
            totalDistance: number;
            duration: number;
            averageSpeed: number;
            maxSpeed: number;
            startTime: null;
            endTime: null;
            totalPoints: number;
        } | {
            driverId: string;
            totalDistance: number;
            duration: number;
            averageSpeed: number;
            maxSpeed: number;
            startTime: Date;
            endTime: Date;
            totalPoints: number;
        };
    }>;
    getActiveDrivers(): Promise<{
        success: boolean;
        data: {
            driver: any;
            location: import("../../database/entities/driver-location.entity").DriverLocation | null;
        }[];
    }>;
    getNearbyDrivers(lat: string, lng: string, radius?: string): Promise<{
        success: boolean;
        data: {
            driver: any;
            location: import("../../database/entities/driver-location.entity").DriverLocation;
            distance: number;
        }[];
    }>;
    getDriverStatus(driverId: string): Promise<{
        success: boolean;
        data: {
            driverId: string;
            isMoving: boolean;
            status: string;
        };
    }>;
    cleanupOldData(body: {
        days?: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            deleted: number;
        };
    }>;
}
