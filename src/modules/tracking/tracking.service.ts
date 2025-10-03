import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DriversService } from '../drivers/drivers.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GetTrackingDto } from './dto/get-tracking.dto';
import { TrackingData } from 'src/database/entities/tracking.entity';
import { BookingsService } from '../bookings/booking.service';
import { BookingStatus } from 'src/shared/enums';


@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(TrackingData)
    private trackingRepository: Repository<TrackingData>,
    private bookingsService: BookingsService,
    private driversService: DriversService,
  ) {}

  async updateDriverLocation(updateDto: UpdateLocationDto): Promise<TrackingData> {
    const { bookingId, driverId, latitude, longitude, speed, heading, accuracy } = updateDto;

    // Verify booking exists and is active
    const booking = await this.bookingsService.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify driver is assigned to this booking
    if (booking.driverId !== driverId) {
      throw new BadRequestException('Driver not assigned to this booking');
    }

    // Verify booking is in a trackable state
    const trackableStatuses = [
      BookingStatus.ASSIGNED,
      BookingStatus.EN_ROUTE,
      BookingStatus.ARRIVED,
      BookingStatus.IN_PROGRESS,
    ];

    if (!trackableStatuses.includes(booking.status)) {
      throw new BadRequestException('Booking is not in a trackable state');
    }

    // Update driver's current location
    await this.driversService.updateLocation(driverId, {
      latitude,
      longitude,
      speed,
      heading,
      accuracy,
    });

    // Create tracking record
    const trackingData = this.trackingRepository.create({
      bookingId,
      driverId,
      latitude,
      longitude,
      speed,
      heading,
      accuracy,
      timestamp: new Date(),
    });

    return this.trackingRepository.save(trackingData);
  }

  async getBookingTracking(getTrackingDto: GetTrackingDto): Promise<TrackingData[]> {
    const { bookingId, startTime, endTime } = getTrackingDto;

    const query = this.trackingRepository.createQueryBuilder('tracking')
      .where('tracking.bookingId = :bookingId', { bookingId })
      .orderBy('tracking.timestamp', 'ASC');

    if (startTime) {
      query.andWhere('tracking.timestamp >= :startTime', { startTime: new Date(startTime) });
    }

    if (endTime) {
      query.andWhere('tracking.timestamp <= :endTime', { endTime: new Date(endTime) });
    }

    return query.getMany();
  }

  async getLatestDriverLocation(driverId: string, bookingId?: string): Promise<TrackingData | null> {
    const query = this.trackingRepository.createQueryBuilder('tracking')
      .where('tracking.driverId = :driverId', { driverId })
      .orderBy('tracking.timestamp', 'DESC')
      .limit(1);

    if (bookingId) {
      query.andWhere('tracking.bookingId = :bookingId', { bookingId });
    }

    return query.getOne();
  }

async getActiveBookingLocation(bookingReference: string): Promise<{
  booking: any;
  latestLocation: TrackingData | null;
  route: any;
}> {
  // Use findByReference instead of findById
  const booking = await this.bookingsService.findByReference(bookingReference);
  
  if (!booking.driver) {
    throw new BadRequestException('No driver assigned to booking');
  }

  const latestLocation = await this.getLatestDriverLocation(booking.driverId, booking.id);

  return {
    booking: {
      id: booking.id,
      reference: booking.reference,
      status: booking.status,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      pickupLatitude: booking.pickupLatitude,
      pickupLongitude: booking.pickupLongitude,
      dropoffLatitude: booking.dropoffLatitude,
      dropoffLongitude: booking.dropoffLongitude,
      driver: {
        id: booking.driver.id,
        name: booking.driver.name,
        phone: booking.driver.phone,
        vehicle: booking.driver.vehicle,
      },
    },
    latestLocation,
    route: booking.route,
  };
}

  async getDriverTrackingHistory(
    driverId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<TrackingData[]> {
    return this.trackingRepository.find({
      where: {
        driverId,
        timestamp: Between(startDate, endDate),
      },
      order: { timestamp: 'ASC' },
      relations: ['booking'],
    });
  }

  async calculateDistance(trackingData: TrackingData[]): Promise<number> {
    if (trackingData.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < trackingData.length; i++) {
      const prev = trackingData[i - 1];
      const current = trackingData[i];
      
      // Calculate distance between consecutive points
      const distance = this.haversineDistance(
        prev.latitude,
        prev.longitude,
        current.latitude,
        current.longitude,
      );
      
      totalDistance += distance;
    }

    return totalDistance;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async getTripSummary(bookingId: string) {
    const tracking = await this.getBookingTracking({ bookingId });
    
    if (tracking.length === 0) {
      return {
        bookingId,
        totalDistance: 0,
        duration: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        startTime: null,
        endTime: null,
      };
    }

    const totalDistance = await this.calculateDistance(tracking);
    const startTime = tracking[0].timestamp;
    const endTime = tracking[tracking.length - 1].timestamp;
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes

    const speeds = tracking.filter(t => t.speed && t.speed > 0).map(t => t.speed);
    const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;

    return {
      bookingId,
      totalDistance: Math.round(totalDistance * 100) / 100,
      duration: Math.round(duration * 100) / 100,
      averageSpeed: Math.round(averageSpeed * 100) / 100,
      maxSpeed: Math.round(maxSpeed * 100) / 100,
      startTime,
      endTime,
      totalPoints: tracking.length,
    };
  }

  async cleanupOldTracking(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.trackingRepository
      .createQueryBuilder()
      .delete()
      .where('timestamp < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }
}
