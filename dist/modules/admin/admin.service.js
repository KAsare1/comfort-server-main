"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const drivers_service_1 = require("../drivers/drivers.service");
const payments_service_1 = require("../payments/payments.service");
const users_service_1 = require("../users/users.service");
const notifications_service_1 = require("../notifications/notifications.service");
const tracking_gateway_1 = require("../tracking/tracking.gateway");
const admin_stats_dto_1 = require("./dto/admin-stats.dto");
const booking_service_1 = require("../bookings/booking.service");
const vehicle_service_1 = require("../vehicle/vehicle.service");
const enums_1 = require("../../shared/enums");
const driver_assignment_dto_1 = require("./dto/driver-assignment.dto");
let AdminService = class AdminService {
    bookingsService;
    driversService;
    vehiclesService;
    paymentsService;
    usersService;
    notificationsService;
    trackingGateway;
    constructor(bookingsService, driversService, vehiclesService, paymentsService, usersService, notificationsService, trackingGateway) {
        this.bookingsService = bookingsService;
        this.driversService = driversService;
        this.vehiclesService = vehiclesService;
        this.paymentsService = paymentsService;
        this.usersService = usersService;
        this.notificationsService = notificationsService;
        this.trackingGateway = trackingGateway;
    }
    async getDashboardStats(adminStatsDto) {
        const { range, startDate, endDate } = adminStatsDto;
        const dateRange = this.getDateRange(range ?? admin_stats_dto_1.StatsTimeRange.TODAY, startDate, endDate);
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const [bookingStats, paymentStats, driverStats, vehicleStats, userStats, recentBookings, activeBookings, bookingsToday, paymentsToday, bookingsWeek, paymentsWeek, bookingsMonth, paymentsMonth, pendingBookings, completedToday,] = await Promise.all([
            this.bookingsService.getBookingStats(dateRange.start, dateRange.end),
            this.paymentsService.getPaymentStats(dateRange.start, dateRange.end),
            this.driversService.getOverallDriverStats(),
            this.vehiclesService.getVehicleStats(),
            this.usersService.getUserStats(),
            this.bookingsService.getRecentBookings(10),
            this.bookingsService.getActiveBookings(),
            this.bookingsService.getBookingStats(todayStart, now),
            this.paymentsService.getPaymentStats(todayStart, now),
            this.bookingsService.getBookingStats(weekStart, now),
            this.paymentsService.getPaymentStats(weekStart, now),
            this.bookingsService.getBookingStats(monthStart, now),
            this.paymentsService.getPaymentStats(monthStart, now),
            this.bookingsService.findWithPagination({
                status: enums_1.BookingStatus.PENDING,
                page: 1,
                limit: 100,
            }),
            this.bookingsService.findWithPagination({
                status: enums_1.BookingStatus.COMPLETED,
                startDate: todayStart.toISOString(),
                endDate: now.toISOString(),
                page: 1,
                limit: 100,
            }),
        ]);
        const activeVehicles = vehicleStats.statusCounts?.find((s) => s.status === 'active')?.count || 0;
        const activeRides = activeBookings.filter((b) => [
            enums_1.BookingStatus.IN_PROGRESS,
            enums_1.BookingStatus.EN_ROUTE,
            enums_1.BookingStatus.ARRIVED,
        ].includes(b.status)).length;
        return {
            overview: {
                totalBookingsToday: bookingsToday.totalBookings,
                availableDrivers: driverStats.statusCounts.find((s) => s.status === enums_1.DriverStatus.AVAILABLE)?.count || 0,
                activeVehicles,
                todaysRevenue: paymentsToday.totalRevenue,
                revenueOverview: {
                    today: paymentsToday.totalRevenue,
                    week: paymentsWeek.totalRevenue,
                    month: paymentsMonth.totalRevenue,
                },
                pendingBookings: pendingBookings.data.length,
                completedToday: completedToday.data.length,
                activeRides,
            },
            bookings: bookingStats,
            payments: paymentStats,
            drivers: driverStats,
            vehicles: vehicleStats,
            users: userStats,
            recent: {
                bookings: recentBookings,
                activeBookings,
            },
            dateRange,
        };
    }
    async assignDriver(assignmentDto) {
        const { bookingId, strategy, driverId } = assignmentDto;
        const booking = await this.bookingsService.findById(bookingId);
        if (booking.status !== enums_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Can only assign drivers to confirmed bookings');
        }
        let selectedDriverId;
        switch (strategy) {
            case driver_assignment_dto_1.AssignmentStrategy.MANUAL:
                if (!driverId) {
                    throw new common_1.BadRequestException('Driver ID is required for manual assignment');
                }
                selectedDriverId = driverId;
                break;
            case driver_assignment_dto_1.AssignmentStrategy.ROUND_ROBIN:
                selectedDriverId = await this.findRoundRobinDriver();
                break;
            default:
                throw new common_1.BadRequestException('Invalid assignment strategy');
        }
        const updatedBooking = await this.bookingsService.assignDriver(bookingId, selectedDriverId);
        await this.driversService.assignToBooking(selectedDriverId, bookingId);
        const driver = await this.driversService.findById(selectedDriverId);
        await this.notificationsService.sendDriverAssigned(booking.customer.phone, booking.reference, driver.name, driver.vehicle?.licensePlate || 'N/A', '10');
        await this.trackingGateway.notifyDriverWatchers(selectedDriverId, {
            type: 'booking_assigned',
            title: 'New Booking Assigned',
            message: `You have been assigned to booking ${booking.reference}`,
            data: {
                bookingId,
                bookingReference: booking.reference,
                pickupLocation: booking.pickupLocation,
                dropoffLocation: booking.dropoffLocation,
                status: enums_1.BookingStatus.ASSIGNED,
            },
        });
        return {
            booking: updatedBooking,
            driver,
            strategy,
        };
    }
    async findNearestDriver(lat, lng) {
        const nearbyDrivers = await this.driversService.findNearbyDrivers(lat, lng, 15);
        if (nearbyDrivers.length === 0) {
            throw new common_1.NotFoundException('No available drivers found nearby');
        }
        return nearbyDrivers[0].id;
    }
    async findRoundRobinDriver() {
        const availableDrivers = await this.driversService.findAvailableDrivers();
        if (availableDrivers.length === 0) {
            throw new common_1.NotFoundException('No available drivers found');
        }
        const driverWithLeastRecentBooking = availableDrivers.sort((a, b) => {
            const aLastBooking = a.bookings?.[0]?.assignedAt || new Date(0);
            const bLastBooking = b.bookings?.[0]?.assignedAt || new Date(0);
            return aLastBooking.getTime() - bLastBooking.getTime();
        })[0];
        return driverWithLeastRecentBooking.id;
    }
    async findHighestRatedDriver(lat, lng) {
        const nearbyDrivers = await this.driversService.findNearbyDrivers(lat, lng, 15);
        if (nearbyDrivers.length === 0) {
            throw new common_1.NotFoundException('No available drivers found nearby');
        }
        const sortedByRating = nearbyDrivers.sort((a, b) => b.rating - a.rating);
        return sortedByRating[0].id;
    }
    async getSystemHealth() {
        const [totalBookings, activeBookings, availableDrivers, onlineDrivers, pendingPayments,] = await Promise.all([
            this.bookingsService.findAll().then((bookings) => bookings.length),
            this.bookingsService
                .getActiveBookings()
                .then((bookings) => bookings.length),
            this.driversService
                .findAvailableDrivers()
                .then((drivers) => drivers.length),
            this.driversService
                .findAll()
                .then((drivers) => drivers.filter((d) => d.status !== enums_1.DriverStatus.OFFLINE).length),
            this.paymentsService
                .getAllPayments(1, 1000)
                .then((result) => result.data.filter((p) => p.status === 'pending').length),
        ]);
        const healthScore = this.calculateHealthScore({
            activeBookings,
            availableDrivers,
            onlineDrivers,
            pendingPayments,
        });
        return {
            status: healthScore >= 80
                ? 'healthy'
                : healthScore >= 60
                    ? 'warning'
                    : 'critical',
            score: healthScore,
            metrics: {
                totalBookings,
                activeBookings,
                availableDrivers,
                onlineDrivers,
                pendingPayments,
            },
            alerts: this.generateSystemAlerts({
                activeBookings,
                availableDrivers,
                onlineDrivers,
                pendingPayments,
            }),
        };
    }
    calculateHealthScore(metrics) {
        let score = 100;
        if (metrics.availableDrivers < metrics.activeBookings) {
            score -= 20;
        }
        if (metrics.onlineDrivers < 5) {
            score -= 15;
        }
        if (metrics.pendingPayments > 10) {
            score -= 10;
        }
        return Math.max(0, score);
    }
    generateSystemAlerts(metrics) {
        const alerts = [];
        if (metrics.availableDrivers < metrics.activeBookings) {
            alerts.push('More active bookings than available drivers');
        }
        if (metrics.onlineDrivers < 3) {
            alerts.push('Very few drivers online');
        }
        if (metrics.pendingPayments > 20) {
            alerts.push('High number of pending payments');
        }
        return alerts;
    }
    async getRevenueTrends(days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        const dailyRevenue = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dailyRevenue.push({
                date: date.toISOString().split('T')[0],
                revenue: Math.random() * 1000,
                bookings: Math.floor(Math.random() * 20),
            });
        }
        return {
            dailyRevenue,
            totalRevenue: dailyRevenue.reduce((sum, day) => sum + day.revenue, 0),
            totalBookings: dailyRevenue.reduce((sum, day) => sum + day.bookings, 0),
            averageDaily: dailyRevenue.reduce((sum, day) => sum + day.revenue, 0) / days,
        };
    }
    getDateRange(range, startDate, endDate) {
        const now = new Date();
        let start;
        let end = now;
        switch (range) {
            case admin_stats_dto_1.StatsTimeRange.TODAY:
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case admin_stats_dto_1.StatsTimeRange.WEEK:
                start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case admin_stats_dto_1.StatsTimeRange.MONTH:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case admin_stats_dto_1.StatsTimeRange.YEAR:
                start = new Date(now.getFullYear(), 0, 1);
                break;
            case admin_stats_dto_1.StatsTimeRange.CUSTOM:
                if (!startDate || !endDate) {
                    throw new common_1.BadRequestException('Start and end dates required for custom range');
                }
                start = new Date(startDate);
                end = new Date(endDate);
                break;
            default:
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        return { start, end };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [booking_service_1.BookingsService,
        drivers_service_1.DriversService,
        vehicle_service_1.VehiclesService,
        payments_service_1.PaymentsService,
        users_service_1.UsersService,
        notifications_service_1.NotificationsService,
        tracking_gateway_1.TrackingGateway])
], AdminService);
//# sourceMappingURL=admin.service.js.map