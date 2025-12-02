import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { DriverLoginDto } from './dto/driver-login.dto';
import { DriverStatus } from 'src/shared/enums';
import { DriverQueryDto } from './dto/driver-query.dto';
import { Driver } from 'src/database/entities/driver.entity';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    login(loginDto: DriverLoginDto): Promise<{
        driver: Partial<Driver>;
        accessToken: string;
    }>;
    getProfile(driver: Driver): Promise<Partial<Driver>>;
    updatePassword(driver: Driver, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(id: string, body: {
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    create(createDriverDto: CreateDriverDto): Promise<{
        driver: Partial<Driver>;
        password: string;
    }>;
    findAll(): Promise<Driver[]>;
    findAvailable(): Promise<Driver[]>;
    findNearby(lat: string, lng: string, radius?: string): Promise<(Driver & {
        distance: number;
    })[]>;
    findWithPagination(queryDto: DriverQueryDto): Promise<{
        data: Driver[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getOverallStats(): Promise<{
        totalDrivers: number;
        statusCounts: any[];
        averageRating: number;
        topDrivers: Driver[];
    }>;
    getExpiringLicenses(days?: string): Promise<Driver[]>;
    findOne(id: string): Promise<Driver>;
    getStats(id: string): Promise<{
        driver: {
            id: string;
            name: string;
            rating: number;
            totalTrips: number;
            status: DriverStatus;
            vehicle: import("../../database/entities/vehicle.entity").Vehicle;
        };
        stats: {
            totalBookings: number;
            completedBookings: number;
            cancelledBookings: number;
            averageEarnings: number;
            totalEarnings: number;
            completionRate: number;
        };
    }>;
    updateOwnLocation(driver: Driver, locationDto: UpdateDriverLocationDto): Promise<Driver>;
    updateLocation(id: string, locationDto: UpdateDriverLocationDto): Promise<Driver>;
    updateOwnStatus(driver: Driver, body: {
        status?: DriverStatus;
    }): Promise<Driver>;
    updateStatus(id: string, body: {
        status?: DriverStatus;
    }): Promise<Driver>;
    assignToBooking(id: string, body: {
        bookingId: string;
    }): Promise<Driver>;
    completeOwnTrip(driver: Driver): Promise<Driver>;
    completeTrip(id: string): Promise<Driver>;
    updateRating(id: string, body: {
        rating: number;
    }): Promise<Driver>;
    updateOwnDocuments(driver: Driver, body: {
        documents: Record<string, string>;
    }): Promise<Driver>;
    updateDocuments(id: string, body: {
        documents: Record<string, string>;
    }): Promise<Driver>;
    remove(id: string): Promise<void>;
    removeAll(): Promise<{
        success: boolean;
        message: string;
    }>;
}
