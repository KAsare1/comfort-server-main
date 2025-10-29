import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DriversService } from '../drivers/drivers.service';
import { DriverLocation } from 'src/database/entities/driver-location.entity';
import { UpdateDriverLocationDto } from '../drivers/dto/update-driver-location.dto';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(DriverLocation)
    private driverLocationRepository: Repository<DriverLocation>,
    private driversService: DriversService,
  ) {}

  /**
   * Update driver's current location
   * No booking required - just track the driver
   */
  async updateDriverLocation(
    updateDto: UpdateDriverLocationDto,
  ): Promise<DriverLocation> {
    const {
      driverId,
      latitude,
      longitude,
      speed,
      heading,
      accuracy,
    } = updateDto;

    // Verify driver exists
    const driver = await this.driversService.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    // Create location record
    const locationData = this.driverLocationRepository.create({
      driverId,
      latitude,
      longitude,
      speed,
      heading,
      accuracy,
      timestamp: new Date(),
    });

    return this.driverLocationRepository.save(locationData);
  }

  /**
   * Get driver's latest location
   */
  async getDriverLatestLocation(driverId: string): Promise<DriverLocation | null> {
    // Don't verify driver exists here - just check if location exists
    // This avoids unnecessary DB calls

    const location = await this.driverLocationRepository
      .createQueryBuilder('location')
      .where('location.driverId = :driverId', { driverId })
      .orderBy('location.timestamp', 'DESC')
      .limit(1)
      .getOne();

    return location;
  }

  /**
   * Get driver's current location with driver details
   */
  async getDriverTrackingInfo(driverId: string): Promise<{
    driver: any;
    location: DriverLocation | null;
  }> {
    const driver = await this.driversService.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const location = await this.getDriverLatestLocation(driverId);

    return {
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        vehicle: driver.vehicle,
        status: driver.status,
      },
      location,
    };
  }

  /**
   * Get driver's location history
   */
  async getDriverLocationHistory(
    driverId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<DriverLocation[]> {
    const query = this.driverLocationRepository
      .createQueryBuilder('location')
      .where('location.driverId = :driverId', { driverId })
      .orderBy('location.timestamp', 'ASC');

    if (startDate) {
      query.andWhere('location.timestamp >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('location.timestamp <= :endDate', { endDate });
    }

    return query.getMany();
  }

  /**
   * Get all drivers with recent locations (last 5 minutes)
   * Alternative to findActiveDrivers that works with your existing driver service
   */
  async getAllActiveDriversLocations(): Promise<Array<{
    driver: any;
    location: DriverLocation | null;
  }>> {
    // Get all locations from the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const recentLocations = await this.driverLocationRepository
      .createQueryBuilder('location')
      .where('location.timestamp >= :cutoff', { cutoff: fiveMinutesAgo })
      .distinctOn(['location.driverId'])
      .orderBy('location.driverId')
      .addOrderBy('location.timestamp', 'DESC')
      .getMany();

    // Get driver details for each
    const driversWithLocations = await Promise.all(
      recentLocations.map(async (location) => {
        try {
          const driver = await this.driversService.findById(location.driverId);
          return {
            driver: {
              id: driver.id,
              name: driver.name,
              phone: driver.phone,
              vehicle: driver.vehicle,
              status: driver.status,
            },
            location,
          };
        } catch (error) {
          // Skip if driver not found
          return null;
        }
      })
    );

    // Filter out null values (drivers that weren't found)
    return driversWithLocations.filter(item => item !== null);
  }

  /**
   * Calculate distance traveled by driver in a time period
   */
  async calculateDriverDistance(
    driverId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const locations = await this.getDriverLocationHistory(
      driverId,
      startDate,
      endDate,
    );

    if (locations.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const current = locations[i];

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

  /**
   * Get driver's trip summary for a time period
   */
  async getDriverTripSummary(
    driverId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const locations = await this.getDriverLocationHistory(
      driverId,
      startDate,
      endDate,
    );

    if (locations.length === 0) {
      return {
        driverId,
        totalDistance: 0,
        duration: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        startTime: null,
        endTime: null,
        totalPoints: 0,
      };
    }

    const totalDistance = await this.calculateDriverDistance(
      driverId,
      startDate,
      endDate,
    );
    const startTime = locations[0].timestamp;
    const endTime = locations[locations.length - 1].timestamp;
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    const speeds = locations
      .map((l) => l.speed)
      .filter((speed): speed is number => typeof speed === 'number' && speed > 0);
    const averageSpeed =
      speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;

    return {
      driverId,
      totalDistance: Math.round(totalDistance * 100) / 100,
      duration: Math.round(duration * 100) / 100,
      averageSpeed: Math.round(averageSpeed * 100) / 100,
      maxSpeed: Math.round(maxSpeed * 100) / 100,
      startTime,
      endTime,
      totalPoints: locations.length,
    };
  }

  /**
   * Check if driver is currently moving
   */
  async isDriverMoving(driverId: string): Promise<boolean> {
    const location = await this.getDriverLatestLocation(driverId);
    
    if (!location) return false;
    
    // Check if location is recent (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (location.timestamp < fiveMinutesAgo) return false;
    
    // Consider moving if speed > 5 km/h
    return location.speed !== null && location.speed > 5;
  }

  /**
   * Get drivers near a location
   * This queries all recent locations and filters by distance
   */
  async getNearbyDrivers(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
  ): Promise<Array<{
    driver: any;
    location: DriverLocation;
    distance: number;
  }>> {
    // Get all recent locations (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const recentLocations = await this.driverLocationRepository
      .createQueryBuilder('location')
      .where('location.timestamp >= :cutoff', { cutoff: fiveMinutesAgo })
      .distinctOn(['location.driverId'])
      .orderBy('location.driverId')
      .addOrderBy('location.timestamp', 'DESC')
      .getMany();

    const nearbyDrivers = [];

    for (const location of recentLocations) {
      const distance = this.haversineDistance(
        latitude,
        longitude,
        location.latitude,
        location.longitude,
      );

      if (distance <= radiusKm) {
        try {
          const driver = await this.driversService.findById(location.driverId);
          nearbyDrivers.push({
            driver: {
              id: driver.id,
              name: driver.name,
              phone: driver.phone,
              vehicle: driver.vehicle,
              status: driver.status,
            },
            location,
            distance: Math.round(distance * 100) / 100,
          });
        } catch (error) {
          // Skip if driver not found
          continue;
        }
      }
    }

    // Sort by distance
    return nearbyDrivers.sort((a, b) => a.distance - b.distance);
  }

  /**
   * Cleanup old location data
   */
  async cleanupOldLocations(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.driverLocationRepository
      .createQueryBuilder()
      .delete()
      .where('timestamp < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }

  // Helper: Calculate distance between two coordinates
  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}