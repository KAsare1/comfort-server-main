import { AdminService } from './admin.service';
import { AdminStatsDto } from './dto/admin-stats.dto';
import { DriverAssignmentDto } from './dto/driver-assignment.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
        strategy: import("./dto/driver-assignment.dto").AssignmentStrategy.MANUAL | import("./dto/driver-assignment.dto").AssignmentStrategy.ROUND_ROBIN;
    }>;
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
    getRevenueTrends(days?: string): Promise<{
        dailyRevenue: {
            date: string;
            revenue: number;
            bookings: number;
        }[];
        totalRevenue: number;
        totalBookings: number;
        averageDaily: number;
    }>;
}
