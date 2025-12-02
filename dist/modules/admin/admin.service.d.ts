import { DriversService } from '../drivers/drivers.service';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TrackingGateway } from '../tracking/tracking.gateway';
import { AdminStatsDto } from './dto/admin-stats.dto';
import { BookingsService } from '../bookings/booking.service';
import { VehiclesService } from '../vehicle/vehicle.service';
import { AssignmentStrategy, DriverAssignmentDto } from './dto/driver-assignment.dto';
export declare class AdminService {
    private bookingsService;
    private driversService;
    private vehiclesService;
    private paymentsService;
    private usersService;
    private notificationsService;
    private trackingGateway;
    constructor(bookingsService: BookingsService, driversService: DriversService, vehiclesService: VehiclesService, paymentsService: PaymentsService, usersService: UsersService, notificationsService: NotificationsService, trackingGateway: TrackingGateway);
    getDashboardStats(adminStatsDto: AdminStatsDto): Promise<{
        overview: {
            totalBookingsToday: number;
            availableDrivers: any;
            activeVehicles: any;
            todaysRevenue: number;
            revenueOverview: {
                today: number;
                week: number;
                month: number;
            };
            pendingBookings: number;
            completedToday: number;
            activeRides: number;
        };
        bookings: {
            totalBookings: number;
            statusCounts: any[];
            totalRevenue: number;
        };
        payments: {
            totalPayments: number;
            statusCounts: any[];
            methodCounts: any[];
            totalRevenue: number;
        };
        drivers: {
            totalDrivers: number;
            statusCounts: any[];
            averageRating: number;
            topDrivers: import("../../database/entities/driver.entity").Driver[];
        };
        vehicles: {
            totalVehicles: number;
            assignedCount: number;
            unassignedCount: number;
            statusCounts: any[];
        };
        users: {
            totalUsers: number;
            roleCounts: any[];
            recentUsers: import("../../database/entities/user.entity").User[];
        };
        recent: {
            bookings: import("../../database/entities/booking.entity").Booking[];
            activeBookings: import("../../database/entities/booking.entity").Booking[];
        };
        dateRange: {
            start: Date;
            end: Date;
        };
    }>;
    assignDriver(assignmentDto: DriverAssignmentDto): Promise<{
        booking: import("../../database/entities/booking.entity").Booking;
        driver: import("../../database/entities/driver.entity").Driver;
        strategy: AssignmentStrategy.MANUAL | AssignmentStrategy.ROUND_ROBIN;
    }>;
    private findNearestDriver;
    private findRoundRobinDriver;
    private findHighestRatedDriver;
    getSystemHealth(): Promise<{
        status: string;
        score: number;
        metrics: {
            totalBookings: number;
            activeBookings: number;
            availableDrivers: number;
            onlineDrivers: number;
            pendingPayments: number;
        };
        alerts: string[];
    }>;
    private calculateHealthScore;
    private generateSystemAlerts;
    getRevenueTrends(days?: number): Promise<{
        dailyRevenue: {
            date: string;
            revenue: number;
            bookings: number;
        }[];
        totalRevenue: number;
        totalBookings: number;
        averageDaily: number;
    }>;
    private getDateRange;
}
