import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicle.service';
import { VehicleStatus } from 'src/shared/enums';
import { VehicleQueryDto } from './dto/vehicle-query.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.vehiclesService.findAvailableVehicles();
  }

  @Get('unassigned')
  findUnassigned() {
    return this.vehiclesService.findUnassignedVehicles();
  }

  @Get('expiring-documents')
  getExpiringDocuments(@Query('days') days?: string) {
    const daysAhead = days ? parseInt(days) : 30;
    return this.vehiclesService.getExpiringDocuments(daysAhead);
  }

  @Get('stats')
  getStats() {
    return this.vehiclesService.getVehicleStats();
  }

  @Get('license/:licensePlate')
  findByLicensePlate(@Param('licensePlate') licensePlate: string) {
    return this.vehiclesService.findByLicensePlate(licensePlate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: Partial<CreateVehicleDto>) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: VehicleStatus },
  ) {
    return this.vehiclesService.updateStatus(id, body.status);
  }

  @Put(':id/assign')
  assignToDriver(
    @Param('id') id: string,
    @Body() body: { driverId: string },
  ) {
    return this.vehiclesService.assignToDriver(id, body.driverId);
  }

  @Put(':id/unassign')
  unassignFromDriver(@Param('id') id: string) {
    return this.vehiclesService.unassignFromDriver(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.delete(id);
  }

  @Get('search')
findWithPagination(@Query() queryDto: VehicleQueryDto) {
  return this.vehiclesService.findWithPagination(queryDto);
}

@Get('by-make')
getVehiclesByMake() {
  return this.vehiclesService.getVehiclesByMake();
}

@Get('maintenance-alerts')
getMaintenanceAlerts() {
  return this.vehiclesService.getMaintenanceAlerts();
}
}