import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DriversService } from '../drivers/drivers.service';
import { PaymentsService } from '../payments/payments.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TrackingGateway } from '../tracking/tracking.gateway';
import { AdminStatsDto, StatsTimeRange } from './dto/admin-stats.dto';
import { BookingsService } from '../bookings/booking.service';
import { VehiclesService } from '../vehicle/vehicle.service';
import { BookingStatus, DriverStatus } from 'src/shared/enums';
import { AssignmentStrategy, DriverAssignmentDto } from './dto/driver-assignment.dto';

@Injectable()
export class AdminService {
  constructor(
    private bookingsService: BookingsService,
    private driversService: DriversService,
    private vehiclesService: VehiclesService,
    private paymentsService: PaymentsService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private trackingGateway: TrackingGateway,
  ) {}

  async getDashboardStats(adminStatsDto: AdminStatsDto) {
    const { range, startDate, endDate } = adminStatsDto;
    
    const dateRange = this.getDateRange(range ?? StatsTimeRange.TODAY, startDate, endDate);

    // Get all stats in parallel
    const [
      bookingStats,
      paymentStats,
      driverStats,
      vehicleStats,
      userStats,
      recentBookings,
      activeBookings,
    ] = await Promise.all([
      this.bookingsService.getBookingStats(dateRange.start, dateRange.end),
      this.paymentsService.getPaymentStats(dateRange.start, dateRange.end),
      this.driversService.getOverallDriverStats(),
      this.vehiclesService.getVehicleStats(),
      this.usersService.getUserStats(),
      this.bookingsService.getRecentBookings(10),
      this.bookingsService.getActiveBookings(),
    ]);

    return {
      overview: {
        totalBookings: bookingStats.totalBookings,
        totalRevenue: paymentStats.totalRevenue,
        activeBookings: activeBookings.length,
        availableDrivers: driverStats.statusCounts.find(s => s.status === DriverStatus.AVAILABLE)?.count || 0,
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

  async assignDriver(assignmentDto: DriverAssignmentDto) {
    const { bookingId, strategy, driverId } = assignmentDto;
    
    const booking = await this.bookingsService.findById(bookingId);
    
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Can only assign drivers to confirmed bookings');
    }

    let selectedDriverId: string;

    switch (strategy) {
      case AssignmentStrategy.MANUAL:
        if (!driverId) {
          throw new BadRequestException('Driver ID is required for manual assignment');
        }
        selectedDriverId = driverId;
        break;
        
      // case AssignmentStrategy.NEAREST:
      //   selectedDriverId = await this.findNearestDriver(booking.pickupLatitude, booking.pickupLongitude);
      //   break;
        
      case AssignmentStrategy.ROUND_ROBIN:
        selectedDriverId = await this.findRoundRobinDriver();
        break;
        
      // case AssignmentStrategy.RATING_BASED:
      //   selectedDriverId = await this.findHighestRatedDriver(booking.pickupLatitude, booking.pickupLongitude);
      //   break;
        
      default:
        throw new BadRequestException('Invalid assignment strategy');
    }

    // Assign driver to booking
    const updatedBooking = await this.bookingsService.assignDriver(bookingId, selectedDriverId);
    
    // Update driver status
    await this.driversService.assignToBooking(selectedDriverId, bookingId);
    
    // Send notifications
    const driver = await this.driversService.findById(selectedDriverId);
    await this.notificationsService.sendDriverAssigned(
      booking.customer.phone,
      booking.reference,
      driver.name,
      driver.vehicle?.licensePlate || 'N/A',
      '10', // ETA placeholder
    );

    // Broadcast via WebSocket
    await this.trackingGateway.broadcastBookingStatusUpdate(
      bookingId,
      BookingStatus.ASSIGNED,
      { driverName: driver.name, vehiclePlate: driver.vehicle?.licensePlate }
    );

    return {
      booking: updatedBooking,
      driver,
      strategy,
    };
  }

  private async findNearestDriver(lat: number, lng: number): Promise<string> {
    const nearbyDrivers = await this.driversService.findNearbyDrivers(lat, lng, 15);
    
    if (nearbyDrivers.length === 0) {
      throw new NotFoundException('No available drivers found nearby');
    }
    
    return nearbyDrivers[0].id;
  }

  private async findRoundRobinDriver(): Promise<string> {
    const availableDrivers = await this.driversService.findAvailableDrivers();
    
    if (availableDrivers.length === 0) {
      throw new NotFoundException('No available drivers found');
    }
    
    // Simple round-robin: find driver with least recent assignment
    const driverWithLeastRecentBooking = availableDrivers.sort((a, b) => {
      const aLastBooking = a.bookings?.[0]?.assignedAt || new Date(0);
      const bLastBooking = b.bookings?.[0]?.assignedAt || new Date(0);
      return aLastBooking.getTime() - bLastBooking.getTime();
    })[0];
    
    return driverWithLeastRecentBooking.id;
  }

  private async findHighestRatedDriver(lat: number, lng: number): Promise<string> {
    const nearbyDrivers = await this.driversService.findNearbyDrivers(lat, lng, 15);
    
    if (nearbyDrivers.length === 0) {
      throw new NotFoundException('No available drivers found nearby');
    }
    
    // Sort by rating descending
    const sortedByRating = nearbyDrivers.sort((a, b) => b.rating - a.rating);
    return sortedByRating[0].id;
  }

  async getSystemHealth() {
    const [
      totalBookings,
      activeBookings,
      availableDrivers,
      onlineDrivers,
      pendingPayments,
    ] = await Promise.all([
      this.bookingsService.findAll().then(bookings => bookings.length),
      this.bookingsService.getActiveBookings().then(bookings => bookings.length),
      this.driversService.findAvailableDrivers().then(drivers => drivers.length),
      this.driversService.findAll().then(drivers => 
        drivers.filter(d => d.status !== DriverStatus.OFFLINE).length
      ),
      this.paymentsService.getAllPayments(1, 1000).then(result => 
        result.data.filter(p => p.status === 'pending').length
      ),
    ]);

    const healthScore = this.calculateHealthScore({
      activeBookings,
      availableDrivers,
      onlineDrivers,
      pendingPayments,
    });

    return {
      status: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical',
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

  private calculateHealthScore(metrics: any): number {
    let score = 100;
    
    // Reduce score if too many active bookings vs available drivers
    if (metrics.availableDrivers < metrics.activeBookings) {
      score -= 20;
    }
    
    // Reduce score if too few online drivers
    if (metrics.onlineDrivers < 5) {
      score -= 15;
    }
    
    // Reduce score for pending payments
    if (metrics.pendingPayments > 10) {
      score -= 10;
    }
    
    return Math.max(0, score);
  }

  private generateSystemAlerts(metrics: any): string[] {
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

  async getRevenueTrends(days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // This would typically involve a more complex query
    // For now, we'll return mock data structure
    const dailyRevenue = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // In a real implementation, you'd query payments for each day
      dailyRevenue.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.random() * 1000, // Mock data
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

  private getDateRange(range: StatsTimeRange, startDate?: string, endDate?: string) {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (range) {
      case StatsTimeRange.TODAY:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
        
      case StatsTimeRange.WEEK:
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
        
      case StatsTimeRange.MONTH:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
        
      case StatsTimeRange.YEAR:
        start = new Date(now.getFullYear(), 0, 1);
        break;
        
      case StatsTimeRange.CUSTOM:
        if (!startDate || !endDate) {
          throw new BadRequestException('Start and end dates required for custom range');
        }
        start = new Date(startDate);
        end = new Date(endDate);
        break;
        
      default:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return { start, end };
  }
}
