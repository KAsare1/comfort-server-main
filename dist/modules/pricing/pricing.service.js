"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const locations_service_1 = require("../locations/locations.service");
const distance_calculator_1 = require("../../common/utils/distance.calculator");
const pricing_constants_1 = require("../../common/constants/pricing.constants");
const enums_1 = require("../../shared/enums");
let PricingService = class PricingService {
    locationsService;
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    async calculateBookingPrice(calculateDto) {
        const { pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude, tripType, bookingDates, pickupTime, estimatedDuration, distance, } = calculateDto;
        let calculatedDistance = distance;
        if (!calculatedDistance) {
            calculatedDistance = distance_calculator_1.DistanceCalculator.haversineDistance(pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude);
        }
        let routeInfo;
        try {
            routeInfo = await this.locationsService.getRoute([pickupLongitude, pickupLatitude], [dropoffLongitude, dropoffLatitude]);
            calculatedDistance = routeInfo.distance;
        }
        catch (error) {
            console.warn('Route calculation failed, using straight-line distance:', error.message);
        }
        let basePrice = pricing_constants_1.PRICING_CONSTANTS.BASE_PRICE;
        if (tripType === enums_1.TripType.ROUND) {
            basePrice *= pricing_constants_1.PRICING_CONSTANTS.ROUND_TRIP_MULTIPLIER;
        }
        const distancePrice = calculatedDistance * pricing_constants_1.PRICING_CONSTANTS.DISTANCE_RATE_PER_KM;
        let timePrice = 0;
        if (estimatedDuration) {
            timePrice = estimatedDuration * pricing_constants_1.PRICING_CONSTANTS.TIME_RATE_PER_MINUTE;
        }
        const isPeakHour = this.isPeakHour(pickupTime);
        let peakMultiplier = 1;
        if (isPeakHour) {
            peakMultiplier = pricing_constants_1.PRICING_CONSTANTS.PEAK_HOUR_MULTIPLIER;
        }
        const dailyRate = Math.max((basePrice + distancePrice + timePrice) * peakMultiplier, pricing_constants_1.PRICING_CONSTANTS.MINIMUM_FARE);
        const cappedDailyRate = Math.min(dailyRate, pricing_constants_1.PRICING_CONSTANTS.MAXIMUM_FARE);
        const totalAmount = cappedDailyRate * bookingDates.length;
        return {
            totalAmount: Math.round(totalAmount * 100) / 100,
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
    isPeakHour(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        return pricing_constants_1.PRICING_CONSTANTS.PEAK_HOURS.some(peak => {
            const [startHours, startMinutes] = peak.start.split(':').map(Number);
            const [endHours, endMinutes] = peak.end.split(':').map(Number);
            const startTimeInMinutes = startHours * 60 + startMinutes;
            const endTimeInMinutes = endHours * 60 + endMinutes;
            return timeInMinutes >= startTimeInMinutes && timeInMinutes <= endTimeInMinutes;
        });
    }
    async getEstimatedFare(pickupLat, pickupLng, dropoffLat, dropoffLng, tripType = enums_1.TripType.SINGLE) {
        const distance = distance_calculator_1.DistanceCalculator.haversineDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
        let basePrice = pricing_constants_1.PRICING_CONSTANTS.BASE_PRICE;
        if (tripType === enums_1.TripType.ROUND) {
            basePrice *= pricing_constants_1.PRICING_CONSTANTS.ROUND_TRIP_MULTIPLIER;
        }
        const distancePrice = distance * pricing_constants_1.PRICING_CONSTANTS.DISTANCE_RATE_PER_KM;
        const estimatedFare = Math.max(basePrice + distancePrice, pricing_constants_1.PRICING_CONSTANTS.MINIMUM_FARE);
        return {
            estimatedFare: Math.round(estimatedFare * 100) / 100,
            distance,
            priceRange: {
                min: Math.round(estimatedFare * 100) / 100,
                max: Math.round((estimatedFare * pricing_constants_1.PRICING_CONSTANTS.PEAK_HOUR_MULTIPLIER) * 100) / 100,
            },
        };
    }
    getPricingConstants() {
        return pricing_constants_1.PRICING_CONSTANTS;
    }
    async updatePricingConstants(updates) {
        return {
            ...pricing_constants_1.PRICING_CONSTANTS,
            ...updates,
        };
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], PricingService);
//# sourceMappingURL=pricing.service.js.map