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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { GeocodeDto } from './dto/geocode.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('popular')
  findPopular() {
    return this.locationsService.findPopular();
  }

  @Get('search')
  searchLocations(@Query('q') query: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.locationsService.searchLocations(query, limitNum);
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = radius ? parseFloat(radius) : 5;

    return this.locationsService.findNearby(latitude, longitude, radiusKm);
  }

  @Post('geocode/forward')
  geocodeForward(@Body() geocodeDto: GeocodeDto) {
    return this.locationsService.geocodeForward(geocodeDto);
  }

  @Get('geocode/reverse')
  geocodeReverse(@Query('lat') lat: string, @Query('lng') lng: string) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    return this.locationsService.geocodeReverse(latitude, longitude);
  }

  @Post('route')
  getRoute(
    @Body()
    routeData: {
      start: [number, number];
      end: [number, number];
      profile?: string;
    },
  ) {
    return this.locationsService.getRoute(
      routeData.start,
      routeData.end,
      routeData.profile,
    );
  }

  @Post('route/optimized')
  getOptimizedRoute(
    @Body()
    routeData: {
      start: [number, number];
      waypoints: [number, number][];
      end: [number, number];
    },
  ) {
    return this.locationsService.getOptimizedRoute(
      routeData.start,
      routeData.waypoints,
      routeData.end,
    );
  }

  @Get('stats')
  getStats() {
    return this.locationsService.getLocationStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: Partial<CreateLocationDto>,
  ) {
    return this.locationsService.updateLocation(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.deactivateLocation(id);
  }
}
