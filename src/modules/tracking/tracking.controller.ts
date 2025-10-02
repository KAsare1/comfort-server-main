import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GetTrackingDto } from './dto/get-tracking.dto';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('location')
  updateLocation(@Body() updateLocationDto: UpdateLocationDto) {
    return this.trackingService.updateDriverLocation(updateLocationDto);
  }

  @Get('booking/:bookingId')
  getBookingTracking(@Param('bookingId') bookingId: string, @Query() query: any) {
    return this.trackingService.getBookingTracking({
      bookingId,
      startTime: query.startTime,
      endTime: query.endTime,
    });
  }

  @Get('booking/:bookingId/current')
  getCurrentLocation(@Param('bookingId') bookingId: string) {
    return this.trackingService.getActiveBookingLocation(bookingId);
  }

  @Get('booking/:bookingId/summary')
  getTripSummary(@Param('bookingId') bookingId: string) {
    return this.trackingService.getTripSummary(bookingId);
  }

  @Get('driver/:driverId/latest')
  getLatestDriverLocation(
    @Param('driverId') driverId: string,
    @Query('bookingId') bookingId?: string,
  ) {
    return this.trackingService.getLatestDriverLocation(driverId, bookingId);
  }

  @Get('driver/:driverId/history')
  getDriverHistory(
    @Param('driverId') driverId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.trackingService.getDriverTrackingHistory(
      driverId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post('cleanup')
  cleanupOldTracking(@Body() body: { days?: number }) {
    return this.trackingService.cleanupOldTracking(body.days);
  }
}