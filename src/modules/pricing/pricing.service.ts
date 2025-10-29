// src/modules/pricing/pricing.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { TripType } from 'src/shared/enums';

@Injectable()
export class PricingService {
  // Pricing matrix matching frontend - Single source of truth
  private readonly pricingMatrix: Record<string, Record<string, number>> = {
    Abuakwa: {
      Adum: 10,
      Kejetia: 9,
      Sofoline: 7,
      Kwadaso: 7,
      Asuoyeboah: 6,
      Tanoso: 6,
    },
    Tanoso: {
      Adum: 8,
      Kejetia: 7,
      Sofoline: 6,
      Kwadaso: 5,
      Asuoyeboah: 5,
    },
    Asuoyeboah: {
      Adum: 6,
      Kejetia: 5,
      Kwadaso: 5,
      Sofoline: 5,
    },
    Kwadaso: {
      Adum: 6,
      Kejetia: 5,
      Sofoline: 5,
    },
  };

  // All available locations
  private readonly locations = [
    'Sofoline',
    'Kwadaso',
    'Asuoyeboah',
    'Tanoso',
    'Abuakwa',
    'Adum',
    'Kejetia',
  ];

  /**
   * Get base fare between two locations (one-way)
   */
  getBaseFare(pickupLocation: string, dropoffLocation: string): number {
    if (!pickupLocation || !dropoffLocation) {
      throw new BadRequestException(
        'Pickup and dropoff locations are required',
      );
    }

    if (pickupLocation === dropoffLocation) {
      throw new BadRequestException(
        'Pickup and dropoff locations cannot be the same',
      );
    }

    // Check direct route
    let fare = this.pricingMatrix[pickupLocation]?.[dropoffLocation];

    // Check reverse route (same price both ways)
    if (!fare) {
      fare = this.pricingMatrix[dropoffLocation]?.[pickupLocation];
    }

    if (!fare) {
      throw new BadRequestException(
        `Route not available between ${pickupLocation} and ${dropoffLocation}`,
      );
    }

    return fare;
  }

  /**
   * Calculate total fare including trip type multiplier
   */
  calculateFare(
    pickupLocation: string,
    dropoffLocation: string,
    tripType: TripType,
  ): number {
    const baseFare = this.getBaseFare(pickupLocation, dropoffLocation);
    const multiplier = tripType === TripType.ROUND_TRIP ? 2 : 1;
    return baseFare * multiplier;
  }

  /**
   * Get fare estimate with breakdown
   */
  getFareEstimate(
    pickupLocation: string,
    dropoffLocation: string,
    tripType: TripType,
  ) {
    const baseFare = this.getBaseFare(pickupLocation, dropoffLocation);
    const multiplier = tripType === TripType.ROUND_TRIP ? 2 : 1;
    const totalFare = baseFare * multiplier;

    return {
      fare: totalFare,
      baseFare,
      tripType,
      multiplier,
      breakdown: {
        oneWayFare: baseFare,
        roundTripMultiplier: tripType === TripType.ROUND_TRIP ? 2 : 1,
        totalFare,
      },
    };
  }

  /**
   * Get all available locations
   */
  getAvailableLocations(): string[] {
    return this.locations;
  }

  /**
   * Get all available routes and their prices
   */
  getAllRoutes() {
    const routes: Array<{
      from: string;
      to: string;
      fare: number;
    }> = [];

    for (const [from, destinations] of Object.entries(this.pricingMatrix)) {
      for (const [to, fare] of Object.entries(destinations)) {
        routes.push({ from, to, fare });
      }
    }

    return routes;
  }

  /**
   * Check if a route exists between two locations
   */
  isRouteAvailable(pickupLocation: string, dropoffLocation: string): boolean {
    if (pickupLocation === dropoffLocation) return false;

    const hasDirect = !!this.pricingMatrix[pickupLocation]?.[dropoffLocation];
    const hasReverse = !!this.pricingMatrix[dropoffLocation]?.[pickupLocation];

    return hasDirect || hasReverse;
  }

  /**
   * Get pricing matrix (for admin purposes)
   */
  getPricingMatrix() {
    return {
      matrix: this.pricingMatrix,
      locations: this.locations,
    };
  }
}
