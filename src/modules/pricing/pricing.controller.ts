// src/modules/pricing/pricing.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { TripType } from 'src/shared/enums';
import { CalculatePriceDto } from './dto/calculate-price.dto';

@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('calculate')
  @ApiOperation({ 
    summary: 'Calculate fare for a route',
    description: 'Calculate the total fare based on pickup location, dropoff location, and trip type'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Fare calculated successfully',
    schema: {
      example: {
        fare: 10,
        baseFare: 5,
        tripType: 'round-trip',
        multiplier: 2,
        breakdown: {
          oneWayFare: 5,
          roundTripMultiplier: 2,
          totalFare: 10
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input or route not available' })
  calculateFare(@Body() calculateFareDto: CalculatePriceDto) {
    return this.pricingService.getFareEstimate(
      calculateFareDto.pickupLocation,
      calculateFareDto.dropoffLocation,
      calculateFareDto.tripType,
    );
  }

  @Get('estimate')
  @ApiOperation({ 
    summary: 'Get fare estimate using query parameters',
    description: 'Alternative endpoint to calculate fare using URL query parameters instead of POST body'
  })
  @ApiResponse({ status: 200, description: 'Fare estimate retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid parameters or route not available' })
  getEstimate(
    @Query('pickupLocation') pickupLocation: string,
    @Query('dropoffLocation') dropoffLocation: string,
    @Query('tripType') tripType: string = 'one-way',
  ) {
    return this.pricingService.getFareEstimate(
      pickupLocation,
      dropoffLocation,
      tripType as TripType,
    );
  }

  @Get('locations')
  @ApiOperation({ 
    summary: 'Get all available locations',
    description: 'Returns a list of all locations where bus service is available'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of available locations',
    schema: {
      example: {
        locations: ['Sofoline', 'Kwadaso', 'Asuoyeboah', 'Tanoso', 'Abuakwa', 'Adum', 'Kejetia']
      }
    }
  })
  getLocations() {
    return {
      locations: this.pricingService.getAvailableLocations(),
    };
  }

  @Get('routes')
  @ApiOperation({ 
    summary: 'Get all available routes and their prices',
    description: 'Returns all available routes with their one-way fare prices'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all routes',
    schema: {
      example: {
        routes: [
          { from: 'Abuakwa', to: 'Adum', fare: 10 },
          { from: 'Abuakwa', to: 'Kejetia', fare: 9 },
          { from: 'Tanoso', to: 'Adum', fare: 8 }
        ]
      }
    }
  })
  getAllRoutes() {
    return {
      routes: this.pricingService.getAllRoutes(),
    };
  }

  @Get('matrix')
  @ApiOperation({ 
    summary: 'Get the full pricing matrix',
    description: 'Returns the complete pricing matrix and list of locations (admin use)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Full pricing matrix',
    schema: {
      example: {
        matrix: {
          'Abuakwa': { 'Adum': 10, 'Kejetia': 9 },
          'Tanoso': { 'Adum': 8, 'Kejetia': 7 }
        },
        locations: ['Sofoline', 'Kwadaso', 'Asuoyeboah', 'Tanoso', 'Abuakwa', 'Adum', 'Kejetia']
      }
    }
  })
  getPricingMatrix() {
    return this.pricingService.getPricingMatrix();
  }

  @Get('check-route')
  @ApiOperation({ 
    summary: 'Check if a route is available',
    description: 'Verify if a route exists between two locations without calculating the fare'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Route availability status',
    schema: {
      example: {
        available: true,
        pickupLocation: 'Sofoline',
        dropoffLocation: 'Adum'
      }
    }
  })
  checkRoute(
    @Query('pickupLocation') pickupLocation: string,
    @Query('dropoffLocation') dropoffLocation: string,
  ) {
    return {
      available: this.pricingService.isRouteAvailable(
        pickupLocation,
        dropoffLocation,
      ),
      pickupLocation,
      dropoffLocation,
    };
  }
}