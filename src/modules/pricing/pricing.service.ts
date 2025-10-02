import { Injectable } from '@nestjs/common';
import { CalculatePriceDto } from './dto/calculate-price.dto';

import { LocationsService } from '../locations/locations.service';
import { DistanceCalculator } from 'src/common/utils/distance.calculator';
import { PRICING_CONSTANTS } from 'src/common/constants/pricing.constants';
import { TripType } from 'src/shared/enums';

@Injectable()
export class PricingService {
  constructor(private locationsService: LocationsService) {}

  async calculateBookingPrice(calculateDto: CalculatePriceDto) {
    const {
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude,
      tripType,
      bookingDates,
      pickupTime,
      estimatedDuration,
      distance,
    } = calculateDto;

    // Calculate distance if not provided
    let calculatedDistance = distance;
    if (!calculatedDistance) {
      calculatedDistance = DistanceCalculator.haversineDistance(
        pickupLatitude,
        pickupLongitude,
        dropoffLatitude,
        dropoffLongitude,
      );
    }

    // Get more accurate route information
    let routeInfo;
    try {
      routeInfo = await this.locationsService.getRoute(
        [pickupLongitude, pickupLatitude],
        [dropoffLongitude, dropoffLatitude],
      );
      calculatedDistance = routeInfo.distance;
    } catch (error) {
      // Fallback to straight-line distance if route calculation fails
      console.warn('Route calculation failed, using straight-line distance:', error.message);
    }

    // Base pricing calculation
    let basePrice = PRICING_CONSTANTS.BASE_PRICE;

    // Apply trip type multiplier
    if (tripType === TripType.ROUND) {
      basePrice *= PRICING_CONSTANTS.ROUND_TRIP_MULTIPLIER;
    }

    // Distance-based pricing
    const distancePrice = calculatedDistance * PRICING_CONSTANTS.DISTANCE_RATE_PER_KM;

    // Time-based pricing (if estimated duration provided)
    let timePrice = 0;
    if (estimatedDuration) {
      timePrice = estimatedDuration * PRICING_CONSTANTS.TIME_RATE_PER_MINUTE;
    }

    // Peak hour multiplier
    const isPeakHour = this.isPeakHour(pickupTime);
    let peakMultiplier = 1;
    if (isPeakHour) {
      peakMultiplier = PRICING_CONSTANTS.PEAK_HOUR_MULTIPLIER;
    }

    // Calculate daily rate
    const dailyRate = Math.max(
      (basePrice + distancePrice + timePrice) * peakMultiplier,
      PRICING_CONSTANTS.MINIMUM_FARE,
    );

    // Apply daily cap
    const cappedDailyRate = Math.min(dailyRate, PRICING_CONSTANTS.MAXIMUM_FARE);

    // Total for all booking dates
    const totalAmount = cappedDailyRate * bookingDates.length;

    return {
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      dailyRate: Math.round(cappedDailyRate * 100) / 100,
      breakdown: {
        basePrice,
        distancePrice: Math.round(distancePrice * 100) / 100,
        timePrice: Math.round(timePrice * 100) / 100,
        peakMultiplier,
        isPeakHour,
        distance: calculatedDistance,
        estimatedDuration: routeInfo?.duration || estimatedDuration,
        numberOfDays: bookingDates.length,
      },
    };
  }

  private isPeakHour(timeString: string): boolean {
    const [hours, minutes] = timeString.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;

    return PRICING_CONSTANTS.PEAK_HOURS.some(peak => {
      const [startHours, startMinutes] = peak.start.split(':').map(Number);
      const [endHours, endMinutes] = peak.end.split(':').map(Number);
      
      const startTimeInMinutes = startHours * 60 + startMinutes;
      const endTimeInMinutes = endHours * 60 + endMinutes;

      return timeInMinutes >= startTimeInMinutes && timeInMinutes <= endTimeInMinutes;
    });
  }

  async getEstimatedFare(
    pickupLat: number,
    pickupLng: number,
    dropoffLat: number,
    dropoffLng: number,
    tripType: TripType = TripType.SINGLE,
  ) {
    // Quick estimate without full calculation
    const distance = DistanceCalculator.haversineDistance(
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
    );

    let basePrice = PRICING_CONSTANTS.BASE_PRICE;
    if (tripType === TripType.ROUND) {
      basePrice *= PRICING_CONSTANTS.ROUND_TRIP_MULTIPLIER;
    }

    const distancePrice = distance * PRICING_CONSTANTS.DISTANCE_RATE_PER_KM;
    const estimatedFare = Math.max(
      basePrice + distancePrice,
      PRICING_CONSTANTS.MINIMUM_FARE,
    );

    return {
      estimatedFare: Math.round(estimatedFare * 100) / 100,
      distance,
      priceRange: {
        min: Math.round(estimatedFare * 100) / 100,
        max: Math.round((estimatedFare * PRICING_CONSTANTS.PEAK_HOUR_MULTIPLIER) * 100) / 100,
      },
    };
  }

  getPricingConstants() {
    return PRICING_CONSTANTS;
  }

  async updatePricingConstants(updates: Partial<typeof PRICING_CONSTANTS>) {
    // In a real implementation, you'd store these in the database
    // For now, return the updated constants
    return {
      ...PRICING_CONSTANTS,
      ...updates,
    };
  }
}