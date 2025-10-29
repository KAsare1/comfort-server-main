export class DistanceCalculator {
  /**
   * Calculate distance between two points using Haversine formula
   * @param lat1 Latitude of first point
   * @param lon1 Longitude of first point
   * @param lat2 Latitude of second point
   * @param lon2 Longitude of second point
   * @returns Distance in kilometers
   */
  static haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Find nearest drivers within radius
   * @param targetLat Target latitude
   * @param targetLon Target longitude
   * @param drivers Array of drivers with lat/lon
   * @param radiusKm Search radius in kilometers
   * @returns Drivers within radius, sorted by distance
   */
  static findNearestDrivers(
    targetLat: number,
    targetLon: number,
    drivers: Array<{
      id: string;
      currentLatitude: number;
      currentLongitude: number;
    }>,
    radiusKm: number = 10,
  ) {
    return drivers
      .map((driver) => ({
        ...driver,
        distance: this.haversineDistance(
          targetLat,
          targetLon,
          driver.currentLatitude,
          driver.currentLongitude,
        ),
      }))
      .filter((driver) => driver.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }
}
