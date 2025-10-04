import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TrackingService } from './tracking.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationUpdate } from 'src/common/interfaces/tracking.interface';
export declare class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private trackingService;
    server: Server;
    private connectedClients;
    constructor(trackingService: TrackingService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinBooking(data: {
        bookingId: string;
        role: 'customer' | 'driver';
    }, client: Socket): Promise<void>;
    handleLeaveBooking(data: {
        bookingId: string;
    }, client: Socket): void;
    handleLocationUpdate(locationData: UpdateLocationDto, client: Socket): Promise<void>;
    handleGetBookingLocation(data: {
        bookingId: string;
    }, client: Socket): Promise<void>;
    broadcastBookingStatusUpdate(bookingId: string, status: string, metadata?: any): Promise<void>;
    broadcastDriverArrival(bookingId: string, location: LocationUpdate): Promise<void>;
    sendNotification(bookingId: string, notification: {
        type: string;
        title: string;
        message: string;
        data?: any;
    }): Promise<void>;
}
