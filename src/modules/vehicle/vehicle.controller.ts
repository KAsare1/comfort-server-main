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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicle.service';
import { VehicleStatus } from 'src/shared/enums';
import { VehicleQueryDto } from './dto/vehicle-query.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}


  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({ status: 201, description: 'Vehicle created successfully.' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }


  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({ status: 200, description: 'List of all vehicles.' })
  findAll() {
    return this.vehiclesService.findAll();
  }


  @Get('available')
  @ApiOperation({ summary: 'Get all available vehicles' })
  @ApiResponse({ status: 200, description: 'List of available vehicles.' })
  findAvailable() {
    return this.vehiclesService.findAvailableVehicles();
  }


  @Get('unassigned')
  @ApiOperation({ summary: 'Get all unassigned vehicles' })
  @ApiResponse({ status: 200, description: 'List of unassigned vehicles.' })
  findUnassigned() {
    return this.vehiclesService.findUnassignedVehicles();
  }


  @Get('expiring-documents')
  @ApiOperation({ summary: 'Get vehicles with expiring documents' })
  @ApiQuery({ name: 'days', required: false, description: 'Days ahead to check for expiring documents' })
  @ApiResponse({ status: 200, description: 'List of vehicles with expiring documents.' })
  getExpiringDocuments(@Query('days') days?: string) {
    const daysAhead = days ? parseInt(days) : 30;
    return this.vehiclesService.getExpiringDocuments(daysAhead);
  }


  @Get('stats')
  @ApiOperation({ summary: 'Get vehicle statistics' })
  @ApiResponse({ status: 200, description: 'Vehicle statistics.' })
  getStats() {
    return this.vehiclesService.getVehicleStats();
  }


  @Get('search')
  @ApiOperation({ summary: 'Search vehicles with pagination' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Paginated list of vehicles.' })
  findWithPagination(@Query() queryDto: VehicleQueryDto) {
    return this.vehiclesService.findWithPagination(queryDto);
  }


  @Get('by-make')
  @ApiOperation({ summary: 'Get vehicles grouped by make' })
  @ApiResponse({ status: 200, description: 'Vehicles grouped by make.' })
  getVehiclesByMake() {
    return this.vehiclesService.getVehiclesByMake();
  }


  @Get('maintenance-alerts')
  @ApiOperation({ summary: 'Get maintenance alerts for vehicles' })
  @ApiResponse({ status: 200, description: 'Maintenance alerts for vehicles.' })
  getMaintenanceAlerts() {
    return this.vehiclesService.getMaintenanceAlerts();
  }


  @Get('license/:licensePlate')
  @ApiOperation({ summary: 'Get vehicle by license plate' })
  @ApiParam({ name: 'licensePlate', description: 'License plate of the vehicle' })
  @ApiResponse({ status: 200, description: 'Vehicle with the given license plate.' })
  findByLicensePlate(@Param('licensePlate') licensePlate: string) {
    return this.vehiclesService.findByLicensePlate(licensePlate);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, description: 'Vehicle with the given ID.' })
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }


  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle details' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiBody({ type: CreateVehicleDto })
  @ApiResponse({ status: 200, description: 'Vehicle updated successfully.' })
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: Partial<CreateVehicleDto>,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }


  @Put(':id/status')
  @ApiOperation({ summary: 'Update vehicle status' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiBody({ schema: { properties: { status: { type: 'string', enum: Object.values(VehicleStatus) } } } })
  @ApiResponse({ status: 200, description: 'Vehicle status updated.' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: VehicleStatus },
  ) {
    return this.vehiclesService.updateStatus(id, body.status);
  }


  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign vehicle to driver' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiBody({ schema: { properties: { driverId: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Vehicle assigned to driver.' })
  assignToDriver(@Param('id') id: string, @Body() body: { driverId: string }) {
    return this.vehiclesService.assignToDriver(id, body.driverId);
  }


  @Put(':id/unassign')
  @ApiOperation({ summary: 'Unassign vehicle from driver' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, description: 'Vehicle unassigned from driver.' })
  unassignFromDriver(@Param('id') id: string) {
    return this.vehiclesService.unassignFromDriver(id);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete vehicle' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  @ApiResponse({ status: 200, description: 'Vehicle deleted.' })
  remove(@Param('id') id: string) {
    return this.vehiclesService.delete(id);
  }
}
