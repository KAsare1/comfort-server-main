import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { DriversService } from '../drivers/drivers.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private driversService;
    private configService;
    constructor(driversService: DriversService, configService: ConfigService);
    validate(payload: any): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        licenseNumber: string;
        licenseExpiry: Date;
        status: import("../../shared/enums").DriverStatus;
        currentLatitude: number;
        currentLongitude: number;
        lastLocationUpdate: Date;
        rating: number;
        totalTrips: number;
        isActive: boolean;
        currentBatchId: string;
        documents: Record<string, string>;
        vehicle: import("../../database/entities/vehicle.entity").Vehicle;
        bookings: import("../../database/entities/booking.entity").Booking[];
        batches: import("../../database/entities").Batch[];
        trackingData: import("../../database/entities/tracking.entity").TrackingData[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
