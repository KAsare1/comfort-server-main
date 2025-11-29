// Updated DriversController - Add these endpoints to your existing controller
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { DriverLoginDto } from './dto/driver-login.dto';
import { DriverStatus } from 'src/shared/enums';
import { DriverQueryDto } from './dto/driver-query.dto';
import { CurrentDriver } from './decorators/current-driver.decorator';
import { Public } from './decorators/public.decorator';
import { Driver } from 'src/database/entities/driver.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('drivers')
@Controller('drivers')
@UseGuards(JwtAuthGuard) // Protect all routes by default
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  // ==================== NEW AUTH ENDPOINTS ====================
  
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login driver with phone and password' })
  async login(@Body() loginDto: DriverLoginDto) {
    return this.driversService.login(loginDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated driver profile' })
  async getProfile(@CurrentDriver() driver: Driver) {
    return this.driversService.getProfile(driver.id);
  }

  @Put('password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current driver password (requires current password)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        currentPassword: { type: 'string', example: 'oldPassword123' },
        newPassword: { type: 'string', example: 'newPassword456', minLength: 6 },
      },
      required: ['currentPassword', 'newPassword'],
    },
  })
  async updatePassword(
    @CurrentDriver() driver: Driver,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    await this.driversService.updatePassword(
      driver.id,
      body.currentPassword,
      body.newPassword,
    );
    return { message: 'Password updated successfully' };
  }

  @Public()
  @Put(':id/password/reset')
  @ApiOperation({ summary: 'Reset driver password (admin only - no verification required)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newPassword: { type: 'string', example: 'newPassword456', minLength: 6 },
      },
      required: ['newPassword'],
    },
  })
  async resetPassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
  ) {
    await this.driversService.changePassword(id, body.newPassword);
    return { message: 'Password reset successfully' };
  }

  // ==================== EXISTING ENDPOINTS ====================

  @Public()
  @Post()
  @ApiOperation({ 
    summary: 'Create a new driver with auto-generated password',
    description: 'Creates a driver and returns the generated password. Save this password to share with the driver.',
  })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  findAll() {
    return this.driversService.findAll();
  }

  @Public()
  @Get('available')
  @ApiOperation({ summary: 'Get available drivers' })
  findAvailable() {
    return this.driversService.findAvailableDrivers();
  }

  @Public()
  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby drivers' })
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

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search drivers with pagination' })
  findWithPagination(@Query() queryDto: DriverQueryDto) {
    return this.driversService.findWithPagination(queryDto);
  }

  @Public()
  @Get('stats/overview')
  @ApiOperation({ summary: 'Get overall driver statistics' })
  getOverallStats() {
    return this.driversService.getOverallDriverStats();
  }

  @Public()
  @Get('expiring-licenses')
  @ApiOperation({ summary: 'Get drivers with expiring licenses' })
  getExpiringLicenses(@Query('days') days?: string) {
    const daysAhead = days ? parseInt(days) : 30;
    return this.driversService.getExpiringLicenses(daysAhead);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get driver by ID' })
  findOne(@Param('id') id: string) {
    return this.driversService.findById(id);
  }

  @Public()
  @Get(':id/stats')
  @ApiOperation({ summary: 'Get driver statistics' })
  getStats(@Param('id') id: string) {
    return this.driversService.getDriverStats(id);
  }

  @ApiBearerAuth()
  @Put('location')
  @ApiOperation({ summary: 'Update current driver location' })
  updateOwnLocation(
    @CurrentDriver() driver: Driver,
    @Body() locationDto: UpdateDriverLocationDto,
  ) {
    return this.driversService.updateLocation(driver.id, locationDto);
  }

  @Public()
  @Put(':id/location')
  @ApiOperation({ summary: 'Update driver location by ID' })
  updateLocation(
    @Param('id') id: string,
    @Body() locationDto: UpdateDriverLocationDto,
  ) {
    return this.driversService.updateLocation(id, locationDto);
  }

  @ApiBearerAuth()
  @Put('status')
  @ApiOperation({ summary: 'Update current driver status' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(DriverStatus),
          description: 'New status for the driver',
        },
      },
      required: ['status'],
    },
  })
  updateOwnStatus(
    @CurrentDriver() driver: Driver,
    @Body() body: { status?: DriverStatus },
  ) {
    if (!body || typeof body.status === 'undefined') {
      throw new (require('@nestjs/common').BadRequestException)(
        'Missing required field: status',
      );
    }
    return this.driversService.updateStatus(driver.id, body.status);
  }

  @Public()
  @Put(':id/status')
  @ApiOperation({ summary: 'Update driver status by ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(DriverStatus),
        },
      },
      required: ['status'],
    },
  })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status?: DriverStatus },
  ) {
    if (!body || typeof body.status === 'undefined') {
      throw new (require('@nestjs/common').BadRequestException)(
        'Missing required field: status',
      );
    }
    return this.driversService.updateStatus(id, body.status);
  }

  @Public()
  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign driver to booking' })
  assignToBooking(
    @Param('id') id: string,
    @Body() body: { bookingId: string },
  ) {
    return this.driversService.assignToBooking(id, body.bookingId);
  }

  @ApiBearerAuth()
  @Put('complete-trip')
  @ApiOperation({ summary: 'Complete current driver trip' })
  completeOwnTrip(@CurrentDriver() driver: Driver) {
    return this.driversService.completeTrip(driver.id);
  }

  @Public()
  @Put(':id/complete-trip')
  @ApiOperation({ summary: 'Complete driver trip by ID' })
  completeTrip(@Param('id') id: string) {
    return this.driversService.completeTrip(id);
  }

  @Public()
  @Put(':id/rating')
  @ApiOperation({ summary: 'Update driver rating' })
  updateRating(@Param('id') id: string, @Body() body: { rating: number }) {
    return this.driversService.updateRating(id, body.rating);
  }

  @ApiBearerAuth()
  @Put('documents')
  @ApiOperation({ summary: 'Update current driver documents' })
  updateOwnDocuments(
    @CurrentDriver() driver: Driver,
    @Body() body: { documents: Record<string, string> },
  ) {
    return this.driversService.updateDocuments(driver.id, body.documents);
  }

  @Public()
  @Put(':id/documents')
  @ApiOperation({ summary: 'Update driver documents by ID' })
  updateDocuments(
    @Param('id') id: string,
    @Body() body: { documents: Record<string, string> },
  ) {
    return this.driversService.updateDocuments(id, body.documents);
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate driver by ID' })
  remove(@Param('id') id: string) {
    return this.driversService.deactivate(id);
  }

  @Public()
  @Delete('all')
  @ApiOperation({ summary: 'Deactivate all drivers' })
  async removeAll() {
    await this.driversService.deactivateAll();
    return { success: true, message: 'All drivers deactivated' };
  }
}