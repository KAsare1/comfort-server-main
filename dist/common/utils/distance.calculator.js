"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanceCalculator = void 0;
class DistanceCalculator {
    static haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return Math.round(distance * 100) / 100;
    }
    static deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    static findNearestDrivers(targetLat, targetLon, drivers, radiusKm = 10) {
        return drivers
            .map((driver) => ({
            ...driver,
            distance: this.haversineDistance(targetLat, targetLon, driver.currentLatitude, driver.currentLongitude),
        }))
            .filter((driver) => driver.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);
    }
}
exports.DistanceCalculator = DistanceCalculator;
//# sourceMappingURL=distance.calculator.js.map