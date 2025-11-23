import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TrackingService } from './tracking.service';
import { UpdateDriverLocationDto } from '../drivers/dto/update-driver-location.dto';
export declare class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private trackingService;
    server: Server;
    private connectedClients;
    constructor(trackingService: TrackingService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleTrackDriver(data: {
        driverId: string;
        role: 'customer' | 'driver' | 'admin';
    }, client: Socket): Promise<void>;
    handleStopTracking(data: {
        driverId: string;
    }, client: Socket): void;
    handleLocationUpdate(locationData: UpdateDriverLocationDto, client: Socket): Promise<void>;
    handleGetDriverLocation(data: {
        driverId: string;
    }, client: Socket): Promise<void>;
    handleGetAllDrivers(client: Socket): Promise<void>;
    handleFindNearbyDrivers(data: {
        latitude: number;
        longitude: number;
        radius?: number;
    }, client: Socket): Promise<void>;
    notifyDriverWatchers(driverId: string, notification: {
        type: string;
        title: string;
        message: string;
        data?: any;
    }): Promise<void>;
    broadcastToAll(event: string, data: any): Promise<void>;
    getDriverWatcherCount(driverId: string): number;
    getConnectedClients(): {
        socketId: string;
        driverId: string | undefined;
        role: "driver" | "customer" | "admin";
    }[];
    getTrackingStats(): {
        activeDriverRooms: number;
        totalConnections: number;
        customerConnections: number;
        driverConnections: number;
        adminConnections: number;
    };
}
