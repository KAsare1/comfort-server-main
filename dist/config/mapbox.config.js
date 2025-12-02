"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMapboxConfig = void 0;
const getMapboxConfig = (configService) => {
    const accessToken = configService.get('MAPBOX_ACCESS_TOKEN');
    if (!accessToken) {
        throw new Error('Missing required environment variable: MAPBOX_ACCESS_TOKEN');
    }
    return {
        accessToken,
        baseUrl: 'https://api.mapbox.com',
        directionsUrl: 'https://api.mapbox.com/directions/v5/mapbox/driving',
        geocodingUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    };
};
exports.getMapboxConfig = getMapboxConfig;
//# sourceMappingURL=mapbox.config.js.map