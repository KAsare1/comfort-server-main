export interface LocationUpdate {
    bookingId: string;
    driverId: string;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    accuracy?: number;
    timestamp: Date;
}
export interface RouteInfo {
    distance: number;
    duration: number;
    geometry: any;
    steps?: any[];
}
