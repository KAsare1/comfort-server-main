import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

import { CreateLocationDto } from './dto/create-location.dto';
import { GeocodeDto } from './dto/geocode.dto';
import { DistanceCalculator } from 'src/common/utils/distance.calculator';
import { RouteInfo } from 'src/common/interfaces/tracking.interface';
import { getMapboxConfig } from 'src/config/mapbox.config';
import { Location } from 'src/database/entities/location.entity';

@Injectable()
export class LocationsService {
  private mapboxClient: AxiosInstance;
  private mapboxConfig;

  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
    private configService: ConfigService,
  ) {
    this.mapboxConfig = getMapboxConfig(this.configService);

    this.mapboxClient = axios.create({
      baseURL: this.mapboxConfig.baseUrl,
      params: {
        access_token: this.mapboxConfig.accessToken,
      },
    });
  }

  /**
   * Creates a new location entity in the database.
   * @param createLocationDto - DTO containing location details
   * @returns The created Location entity
   */
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationsRepository.create(createLocationDto);
    return this.locationsRepository.save(location);
  }

  /**
   * Retrieves all active locations, ordered by popularity and name.
   * @returns Array of Location entities
   */
  async findAll(): Promise<Location[]> {
    return this.locationsRepository.find({
      where: { isActive: true },
      order: { isPopular: 'DESC', name: 'ASC' },
    });
  }

  /**
   * Retrieves all active and popular locations, ordered by name.
   * @returns Array of popular Location entities
   */
  async findPopular(): Promise<Location[]> {
    return this.locationsRepository.find({
      where: { isActive: true, isPopular: true },
      order: { name: 'ASC' },
    });
  }

  /**
   * Finds a location by its ID if active.
   * @param id - Location ID
   * @returns The Location entity
   * @throws NotFoundException if not found
   */
  async findById(id: string): Promise<Location> {
    const location = await this.locationsRepository.findOne({
      where: { id, isActive: true },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  /**
   * Searches for locations by name, address, or city.
   * @param query - Search string
   * @param limit - Max results
   * @returns Array of matching Location entities
   */
  async searchLocations(
    query: string,
    limit: number = 10,
  ): Promise<Location[]> {
    return this.locationsRepository.find({
      where: [
        { name: Like(`%${query}%`), isActive: true },
        { address: Like(`%${query}%`), isActive: true },
        { city: Like(`%${query}%`), isActive: true },
      ],
      order: { isPopular: 'DESC', name: 'ASC' },
      take: limit,
    });
  }

  /**
   * Finds locations within a radius (km) of a given latitude/longitude.
   * @param latitude - Latitude
   * @param longitude - Longitude
   * @param radiusKm - Radius in kilometers
   * @returns Array of locations with distance
   */
  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
  ): Promise<Array<Location & { distance: number }>> {
    const locations = await this.locationsRepository.find({
      where: { isActive: true },
    });

    return locations
      .map((location) => ({
        ...location,
        distance: DistanceCalculator.haversineDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude,
        ),
      }))
      .filter((location) => location.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Performs forward geocoding using Mapbox.
   * @param geocodeDto - Geocode DTO
   * @returns Array of geocoded features
   */
  async geocodeForward(geocodeDto: GeocodeDto): Promise<any[]> {
    try {
      const { query, proximity_lat, proximity_lng, limit = 5 } = geocodeDto;

      const params: any = {
        access_token: this.mapboxConfig.accessToken,
        limit,
        country: 'gh', // Restrict to Ghana
        types: 'place,locality,neighborhood,address,poi',
      };

      if (proximity_lat && proximity_lng) {
        params.proximity = `${proximity_lng},${proximity_lat}`;
      }

      const response = await this.mapboxClient.get(
        `/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        { params },
      );

      return response.data.features.map(
        (feature: {
          id: any;
          text: any;
          place_name: any;
          center: any;
          bbox: any;
          properties: any;
          context: any;
        }) => ({
          id: feature.id,
          name: feature.text,
          placeName: feature.place_name,
          coordinates: feature.center, // [longitude, latitude]
          bbox: feature.bbox,
          properties: feature.properties,
          context: feature.context,
        }),
      );
    } catch (error) {
      throw new HttpException(
        `Geocoding failed: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Performs reverse geocoding using Mapbox.
   * @param latitude - Latitude
   * @param longitude - Longitude
   * @returns Geocoded feature or throws if not found
   */
  async geocodeReverse(latitude: number, longitude: number): Promise<any> {
    try {
      const response = await this.mapboxClient.get(
        `/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
        {
          params: {
            access_token: this.mapboxConfig.accessToken,
            types: 'place,locality,neighborhood,address,poi',
          },
        },
      );

      const feature = response.data.features[0];
      if (!feature) {
        throw new NotFoundException('No location found for these coordinates');
      }

      return {
        name: feature.text,
        placeName: feature.place_name,
        coordinates: feature.center,
        properties: feature.properties,
        context: feature.context,
      };
    } catch (error) {
      throw new HttpException(
        `Reverse geocoding failed: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Gets a route between two points using Mapbox Directions API.
   * @param start - Start coordinates [lng, lat]
   * @param end - End coordinates [lng, lat]
   * @param profile - Travel mode (default: driving)
   * @returns RouteInfo object
   */
  async getRoute(
    start: [number, number],
    end: [number, number],
    profile: string = 'driving',
  ): Promise<RouteInfo> {
    try {
      const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;

      const response = await this.mapboxClient.get(
        `/directions/v5/mapbox/${profile}/${coordinates}`,
        {
          params: {
            access_token: this.mapboxConfig.accessToken,
            geometries: 'geojson',
            steps: true,
            overview: 'full',
          },
        },
      );

      const route = response.data.routes[0];
      if (!route) {
        throw new NotFoundException('No route found');
      }

      return {
        distance: route.distance / 1000, // Convert to kilometers
        duration: route.duration / 60, // Convert to minutes
        geometry: route.geometry,
        steps: route.legs[0]?.steps || [],
      };
    } catch (error) {
      throw new HttpException(
        `Route calculation failed: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Gets an optimized route with waypoints using Mapbox Optimized Trips API.
   * @param start - Start coordinates
   * @param waypoints - Array of waypoint coordinates
   * @param end - End coordinates
   * @returns Optimized route object
   */
  async getOptimizedRoute(
    start: [number, number],
    waypoints: [number, number][],
    end: [number, number],
  ): Promise<any> {
    try {
      const coordinates = [start, ...waypoints, end]
        .map((coord) => `${coord[0]},${coord[1]}`)
        .join(';');

      const response = await this.mapboxClient.get(
        `/optimized-trips/v1/mapbox/driving/${coordinates}`,
        {
          params: {
            access_token: this.mapboxConfig.accessToken,
            geometries: 'geojson',
            steps: true,
            overview: 'full',
            source: 'first',
            destination: 'last',
          },
        },
      );

      const trip = response.data.trips[0];
      if (!trip) {
        throw new NotFoundException('No optimized route found');
      }

      return {
        distance: trip.distance / 1000,
        duration: trip.duration / 60,
        geometry: trip.geometry,
        waypoints: response.data.waypoints,
      };
    } catch (error) {
      throw new HttpException(
        `Route optimization failed: ${error.response?.data?.message || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Adds a new popular location.
   * @param name - Location name
   * @param address - Location address
   * @param coordinates - [lng, lat]
   * @returns The created Location entity
   */
  async addPopularLocation(
    name: string,
    address: string,
    coordinates: [number, number],
  ): Promise<Location> {
    const location = await this.create({
      name,
      address,
      latitude: coordinates[1],
      longitude: coordinates[0],
      isPopular: true,
      city: 'Accra', // Default for now
      region: 'Greater Accra',
    });

    return location;
  }

  /**
   * Updates a location by ID.
   * @param id - Location ID
   * @param updateData - Partial update DTO
   * @returns The updated Location entity
   */
  async updateLocation(
    id: string,
    updateData: Partial<CreateLocationDto>,
  ): Promise<Location> {
    await this.locationsRepository.update(id, updateData);
    return this.findById(id);
  }

  /**
   * Deactivates a location by ID.
   * @param id - Location ID
   */
  async deactivateLocation(id: string): Promise<void> {
    await this.locationsRepository.update(id, { isActive: false });
  }

  /**
   * Gets statistics about locations.
   * @returns Object with total, popular, and city breakdown
   */
  async getLocationStats(): Promise<{
    totalLocations: number;
    popularLocations: number;
    locationsByCity: any[];
  }> {
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
}
