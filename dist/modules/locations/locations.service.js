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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const distance_calculator_1 = require("../../common/utils/distance.calculator");
const mapbox_config_1 = require("../../config/mapbox.config");
const location_entity_1 = require("../../database/entities/location.entity");
let LocationsService = class LocationsService {
    locationsRepository;
    configService;
    mapboxClient;
    mapboxConfig;
    constructor(locationsRepository, configService) {
        this.locationsRepository = locationsRepository;
        this.configService = configService;
        this.mapboxConfig = (0, mapbox_config_1.getMapboxConfig)(this.configService);
        this.mapboxClient = axios_1.default.create({
            baseURL: this.mapboxConfig.baseUrl,
            params: {
                access_token: this.mapboxConfig.accessToken,
            },
        });
    }
    async create(createLocationDto) {
        const location = this.locationsRepository.create(createLocationDto);
        return this.locationsRepository.save(location);
    }
    async findAll() {
        return this.locationsRepository.find({
            where: { isActive: true },
            order: { isPopular: 'DESC', name: 'ASC' },
        });
    }
    async findPopular() {
        return this.locationsRepository.find({
            where: { isActive: true, isPopular: true },
            order: { name: 'ASC' },
        });
    }
    async findById(id) {
        const location = await this.locationsRepository.findOne({
            where: { id, isActive: true },
        });
        if (!location) {
            throw new common_1.NotFoundException('Location not found');
        }
        return location;
    }
    async searchLocations(query, limit = 10) {
        return this.locationsRepository.find({
            where: [
                { name: (0, typeorm_2.Like)(`%${query}%`), isActive: true },
                { address: (0, typeorm_2.Like)(`%${query}%`), isActive: true },
                { city: (0, typeorm_2.Like)(`%${query}%`), isActive: true },
            ],
            order: { isPopular: 'DESC', name: 'ASC' },
            take: limit,
        });
    }
    async findNearby(latitude, longitude, radiusKm = 5) {
        const locations = await this.locationsRepository.find({
            where: { isActive: true },
        });
        return locations
            .map((location) => ({
            ...location,
            distance: distance_calculator_1.DistanceCalculator.haversineDistance(latitude, longitude, location.latitude, location.longitude),
        }))
            .filter((location) => location.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);
    }
    async geocodeForward(geocodeDto) {
        try {
            const { query, proximity_lat, proximity_lng, limit = 5 } = geocodeDto;
            const params = {
                access_token: this.mapboxConfig.accessToken,
                limit,
                country: 'gh',
                types: 'place,locality,neighborhood,address,poi',
            };
            if (proximity_lat && proximity_lng) {
                params.proximity = `${proximity_lng},${proximity_lat}`;
            }
            const response = await this.mapboxClient.get(`/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`, { params });
            return response.data.features.map((feature) => ({
                id: feature.id,
                name: feature.text,
                placeName: feature.place_name,
                coordinates: feature.center,
                bbox: feature.bbox,
                properties: feature.properties,
                context: feature.context,
            }));
        }
        catch (error) {
            throw new common_1.HttpException(`Geocoding failed: ${error.response?.data?.message || error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async geocodeReverse(latitude, longitude) {
        try {
            const response = await this.mapboxClient.get(`/geocoding/v5/mapbox.places/${longitude},${latitude}.json`, {
                params: {
                    access_token: this.mapboxConfig.accessToken,
                    types: 'place,locality,neighborhood,address,poi',
                },
            });
            const feature = response.data.features[0];
            if (!feature) {
                throw new common_1.NotFoundException('No location found for these coordinates');
            }
            return {
                name: feature.text,
                placeName: feature.place_name,
                coordinates: feature.center,
                properties: feature.properties,
                context: feature.context,
            };
        }
        catch (error) {
            throw new common_1.HttpException(`Reverse geocoding failed: ${error.response?.data?.message || error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getRoute(start, end, profile = 'driving') {
        try {
            const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
            const response = await this.mapboxClient.get(`/directions/v5/mapbox/${profile}/${coordinates}`, {
                params: {
                    access_token: this.mapboxConfig.accessToken,
                    geometries: 'geojson',
                    steps: true,
                    overview: 'full',
                },
            });
            const route = response.data.routes[0];
            if (!route) {
                throw new common_1.NotFoundException('No route found');
            }
            return {
                distance: route.distance / 1000,
                duration: route.duration / 60,
                geometry: route.geometry,
                steps: route.legs[0]?.steps || [],
            };
        }
        catch (error) {
            throw new common_1.HttpException(`Route calculation failed: ${error.response?.data?.message || error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getOptimizedRoute(start, waypoints, end) {
        try {
            const coordinates = [start, ...waypoints, end]
                .map((coord) => `${coord[0]},${coord[1]}`)
                .join(';');
            const response = await this.mapboxClient.get(`/optimized-trips/v1/mapbox/driving/${coordinates}`, {
                params: {
                    access_token: this.mapboxConfig.accessToken,
                    geometries: 'geojson',
                    steps: true,
                    overview: 'full',
                    source: 'first',
                    destination: 'last',
                },
            });
            const trip = response.data.trips[0];
            if (!trip) {
                throw new common_1.NotFoundException('No optimized route found');
            }
            return {
                distance: trip.distance / 1000,
                duration: trip.duration / 60,
                geometry: trip.geometry,
                waypoints: response.data.waypoints,
            };
        }
        catch (error) {
            throw new common_1.HttpException(`Route optimization failed: ${error.response?.data?.message || error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addPopularLocation(name, address, coordinates) {
        const location = await this.create({
            name,
            address,
            latitude: coordinates[1],
            longitude: coordinates[0],
            isPopular: true,
            city: 'Accra',
            region: 'Greater Accra',
        });
        return location;
    }
    async updateLocation(id, updateData) {
        await this.locationsRepository.update(id, updateData);
        return this.findById(id);
    }
    async deactivateLocation(id) {
        await this.locationsRepository.update(id, { isActive: false });
    }
    async getLocationStats() {
        const totalLocations = await this.locationsRepository.count({
            where: { isActive: true },
        });
        const popularLocations = await this.locationsRepository.count({
            where: { isActive: true, isPopular: true },
        });
        const locationsByCity = await this.locationsRepository
            .createQueryBuilder('location')
            .select('location.city, COUNT(location.id) as count')
            .where('location.isActive = :isActive', { isActive: true })
            .groupBy('location.city')
            .getRawMany();
        return {
            totalLocations,
            popularLocations,
            locationsByCity,
        };
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map