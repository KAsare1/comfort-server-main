export declare class DistanceCalculator {
    static haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
    private static deg2rad;
    static findNearestDrivers(targetLat: number, targetLon: number, drivers: Array<{
        id: string;
        currentLatitude: number;
        currentLongitude: number;
    }>, radiusKm?: number): {
        distance: number;
        id: string;
        currentLatitude: number;
        currentLongitude: number;
    }[];
}
