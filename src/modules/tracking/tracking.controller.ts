import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingGateway } from './tracking.gateway';
import { UpdateDriverLocationDto } from '../drivers/dto/update-driver-location.dto';
import { BookingsService } from '../bookings/booking.service';

@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly trackingService: TrackingService,
    private readonly trackingGateway: TrackingGateway,
    private readonly bookingsService: BookingsService,
  ) {}
  /**
   * Get booking's driver current location
   * GET /tracking/booking/:reference/location
   */
  @Get('booking/:reference/location')
  async getBookingDriverLocation(@Param('reference') reference: string) {
    try {
      const booking = await this.bookingsService.findByReference(reference);
      if (!booking.driverId) {
        throw new HttpException('No driver assigned to this booking', HttpStatus.NOT_FOUND);
      }
      return await this.getDriverLocation(booking.driverId);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get booking driver location',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get booking's driver location history
   * GET /tracking/booking/:reference/history?startDate=xxx&endDate=xxx
   */
  @Get('booking/:reference/history')
  async getBookingDriverHistory(
    @Param('reference') reference: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const booking = await this.bookingsService.findByReference(reference);
      if (!booking.driverId) {
        throw new HttpException('No driver assigned to this booking', HttpStatus.NOT_FOUND);
      }
      return await this.getDriverHistory(booking.driverId, startDate, endDate);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get booking driver history',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get booking's driver trip summary
   * GET /tracking/booking/:reference/summary?startDate=xxx&endDate=xxx
   */
  @Get('booking/:reference/summary')
  async getBookingDriverSummary(
    @Param('reference') reference: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const booking = await this.bookingsService.findByReference(reference);
      if (!booking.driverId) {
        throw new HttpException('No driver assigned to this booking', HttpStatus.NOT_FOUND);
      }
      return await this.getDriverSummary(booking.driverId, startDate, endDate);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get booking driver summary',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get booking's driver status
   * GET /tracking/booking/:reference/status
   */
  @Get('booking/:reference/status')
  async getBookingDriverStatus(@Param('reference') reference: string) {
    try {
      const booking = await this.bookingsService.findByReference(reference);
      if (!booking.driverId) {
        throw new HttpException('No driver assigned to this booking', HttpStatus.NOT_FOUND);
      }
      return await this.getDriverStatus(booking.driverId);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get booking driver status',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Driver sends location update
   * POST /tracking/driver/location
   */
  @Post('driver/location')
  async updateDriverLocation(@Body() updateDto: UpdateDriverLocationDto) {
    try {
      // Save to database
      const locationData =
        await this.trackingService.updateDriverLocation(updateDto);

      // Broadcast to all clients tracking this driver via WebSocket
      this.trackingGateway.server
        .to(`driver-${updateDto.driverId}`)
        .emit('locationUpdate', {
          driverId: updateDto.driverId,
          latitude: updateDto.latitude,
          longitude: updateDto.longitude,
          speed: updateDto.speed,
          heading: updateDto.heading,
          accuracy: updateDto.accuracy,
          timestamp: locationData.timestamp,
        });

      return {
        success: true,
        message: 'Location updated successfully',
        data: locationData,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to update location',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get driver's current location
   * GET /tracking/driver/:driverId
   */
  @Get('driver/:driverId')
  async getDriverLocation(@Param('driverId') driverId: string) {
    try {
      const trackingInfo =
        await this.trackingService.getDriverTrackingInfo(driverId);

      return {
        success: true,
        data: trackingInfo,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get driver location',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get driver's location history
   * GET /tracking/driver/:driverId/history?startDate=xxx&endDate=xxx
   */
  @Get('driver/:driverId/history')
  async getDriverHistory(
    @Param('driverId') driverId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      const history = await this.trackingService.getDriverLocationHistory(
        driverId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
      );

      return {
        success: true,
        data: history,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get driver history',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get driver's trip summary for a time period
   * GET /tracking/driver/:driverId/summary?startDate=xxx&endDate=xxx
   */
  @Get('driver/:driverId/summary')
  async getDriverSummary(
    @Param('driverId') driverId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      const summary = await this.trackingService.getDriverTripSummary(
        driverId,
        new Date(startDate),
        new Date(endDate),
      );

      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get driver summary',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all active drivers with their locations
   * GET /tracking/drivers/active
   */
  @Get('drivers/active')
  async getActiveDrivers() {
    try {
      const drivers = await this.trackingService.getAllActiveDriversLocations();

      return {
        success: true,
        data: drivers,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get active drivers',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find nearby drivers
   * GET /tracking/drivers/nearby?lat=xxx&lng=xxx&radius=5
   */
  @Get('drivers/nearby')
  async getNearbyDrivers(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    try {
      const nearbyDrivers = await this.trackingService.getNearbyDrivers(
        parseFloat(lat),
        parseFloat(lng),
        radius ? parseFloat(radius) : 5,
      );

      return {
        success: true,
        data: nearbyDrivers,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to find nearby drivers',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Check if driver is moving
   * GET /tracking/driver/:driverId/status
   */
  @Get('driver/:driverId/status')
  async getDriverStatus(@Param('driverId') driverId: string) {
    try {
      const isMoving = await this.trackingService.isDriverMoving(driverId);

      return {
        success: true,
        data: {
          driverId,
          isMoving,
          status: isMoving ? 'moving' : 'stationary',
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get driver status',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Cleanup old location data
   * POST /tracking/cleanup
   */
  @Post('cleanup')
  async cleanupOldData(@Body() body: { days?: number }) {
    try {
      const deleted = await this.trackingService.cleanupOldLocations(
        body.days || 30,
      );

      return {
        success: true,
        message: `Deleted ${deleted} old location records`,
        data: { deleted },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to cleanup data',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}