import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsService } from './booking.service';
import { BookingStatus } from 'src/shared/enums';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('active')
  getActiveBookings() {
    return this.bookingsService.getActiveBookings();
  }

  @Get('stats')
  getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.bookingsService.getBookingStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('reference/:reference')
  findByReference(@Param('reference') reference: string) {
    return this.bookingsService.findByReference(reference);
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId') customerId: string) {
    return this.bookingsService.findByCustomer(customerId);
  }

  @Get('driver/:driverId')
  findByDriver(@Param('driverId') driverId: string) {
    return this.bookingsService.findByDriver(driverId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findById(id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: BookingStatus; metadata?: Record<string, any> },
  ) {
    return this.bookingsService.updateStatus(id, body.status, body.metadata);
  }

  @Put(':id/assign')
  assignDriver(@Param('id') id: string, @Body() body: { driverId: string }) {
    return this.bookingsService.assignDriver(id, body.driverId);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.bookingsService.cancel(id, body?.reason);
  }

  // Extra endpoints from bookings.controller.extra.ts
  @Get('search')
  findWithPagination(
    @Query() queryDto: import('./dto/booking-query.dto').BookingQueryDto,
  ) {
    return this.bookingsService.findWithPagination(queryDto);
  }

  @Get('upcoming')
  getUpcomingBookings() {
    return this.bookingsService.getUpcomingBookings();
  }

  @Get('recent')
  getRecentBookings(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.bookingsService.getRecentBookings(limitNum);
  }

  @Put(':id/location')
  updateLocation(
    @Param('id') id: string,
    @Body()
    locationData: {
      pickupLocation?: string;
      pickupLatitude?: number;
      pickupLongitude?: number;
      dropoffLocation?: string;
      dropoffLatitude?: number;
      dropoffLongitude?: number;
    },
  ) {
    return this.bookingsService.updateBookingLocation(id, locationData);
  }
}
