import { Controller, Post, Body, Get, Query, Put } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { TripType } from 'src/shared/enums';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('calculate')
  calculatePrice(@Body() calculateDto: CalculatePriceDto) {
    return this.pricingService.calculateBookingPrice(calculateDto);
  }

  @Get('estimate')
  getEstimatedFare(
    @Query('pickupLat') pickupLat: string,
    @Query('pickupLng') pickupLng: string,
    @Query('dropoffLat') dropoffLat: string,
    @Query('dropoffLng') dropoffLng: string,
    @Query('tripType') tripType?: TripType,
  ) {
    return this.pricingService.getEstimatedFare(
      parseFloat(pickupLat),
      parseFloat(pickupLng),
      parseFloat(dropoffLat),
      parseFloat(dropoffLng),
      tripType || TripType.SINGLE,
    );
  }

  @Get('constants')
  getPricingConstants() {
    return this.pricingService.getPricingConstants();
  }

  @Put('constants')
  updatePricingConstants(@Body() updates: any) {
    return this.pricingService.updatePricingConstants(updates);
  }
}