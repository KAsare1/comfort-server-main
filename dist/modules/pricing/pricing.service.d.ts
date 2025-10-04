import { CalculatePriceDto } from './dto/calculate-price.dto';
import { LocationsService } from '../locations/locations.service';
import { PRICING_CONSTANTS } from 'src/common/constants/pricing.constants';
import { TripType } from 'src/shared/enums';
export declare class PricingService {
    private locationsService;
    constructor(locationsService: LocationsService);
    calculateBookingPrice(calculateDto: CalculatePriceDto): Promise<{
        totalAmount: number;
        dailyRate: number;
        breakdown: {
            basePrice: number;
            distancePrice: number;
            timePrice: number;
            peakMultiplier: number;
            isPeakHour: boolean;
            distance: number;
            estimatedDuration: number | undefined;
            numberOfDays: number;
        };
    }>;
    private isPeakHour;
    getEstimatedFare(pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number, tripType?: TripType): Promise<{
        estimatedFare: number;
        distance: number;
        priceRange: {
            min: number;
            max: number;
        };
    }>;
    getPricingConstants(): {
        BASE_PRICE: number;
        ROUND_TRIP_MULTIPLIER: number;
        PEAK_HOUR_MULTIPLIER: number;
        DISTANCE_RATE_PER_KM: number;
        TIME_RATE_PER_MINUTE: number;
        MINIMUM_FARE: number;
        MAXIMUM_FARE: number;
        CANCELLATION_FEE: number;
        PEAK_HOURS: {
            start: string;
            end: string;
        }[];
        SERVICE_AREAS: string[];
    };
    updatePricingConstants(updates: Partial<typeof PRICING_CONSTANTS>): Promise<{
        BASE_PRICE: number;
        ROUND_TRIP_MULTIPLIER: number;
        PEAK_HOUR_MULTIPLIER: number;
        DISTANCE_RATE_PER_KM: number;
        TIME_RATE_PER_MINUTE: number;
        MINIMUM_FARE: number;
        MAXIMUM_FARE: number;
        CANCELLATION_FEE: number;
        PEAK_HOURS: {
            start: string;
            end: string;
        }[];
        SERVICE_AREAS: string[];
    }>;
}
