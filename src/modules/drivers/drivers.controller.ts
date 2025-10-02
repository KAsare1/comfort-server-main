import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { DriverStatus } from 'src/shared/enums';
import { DriverQueryDto } from './dto/driver-query.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  findAll() {
    return this.driversService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.driversService.findAvailableDrivers();
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = radius ? parseFloat(radius) : 10;
    
    return this.driversService.findNearbyDrivers(latitude, longitude, radiusKm);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driversService.findById(id);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.driversService.getDriverStats(id);
  }

  @Put(':id/location')
  updateLocation(
    @Param('id') id: string,
    @Body() locationDto: UpdateDriverLocationDto,
  ) {
    return this.driversService.updateLocation(id, locationDto);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: DriverStatus },
  ) {
    return this.driversService.updateStatus(id, body.status);
  }

  @Put(':id/assign')
  assignToBooking(
    @Param('id') id: string,
    @Body() body: { bookingId: string },
  ) {
    return this.driversService.assignToBooking(id, body.bookingId);
  }

  @Put(':id/complete-trip')
  completeTrip(@Param('id') id: string) {
    return this.driversService.completeTrip(id);
  }

  @Put(':id/rating')
  updateRating(
    @Param('id') id: string,
    @Body() body: { rating: number },
  ) {
    return this.driversService.updateRating(id, body.rating);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driversService.deactivate(id);
  }

  @Get('search')
  findWithPagination(@Query() queryDto: DriverQueryDto) {
    return this.driversService.findWithPagination(queryDto);
  }

  @Get('stats/overview')
  getOverallStats() {
    return this.driversService.getOverallDriverStats();
  }

  @Get('expiring-licenses')
  getExpiringLicenses(@Query('days') days?: string) {
    const daysAhead = days ? parseInt(days) : 30;
    return this.driversService.getExpiringLicenses(daysAhead);
  }

  @Put(':id/documents')
  updateDocuments(
    @Param('id') id: string,
    @Body() body: { documents: Record<string, string> },
  ) {
    return this.driversService.updateDocuments(id, body.documents);
  }
}