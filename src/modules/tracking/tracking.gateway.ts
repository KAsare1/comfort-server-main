import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TrackingService } from './tracking.service';
import { UpdateDriverLocationDto } from '../drivers/dto/update-driver-location.dto';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://your-frontend-domain.com',
      '*', // Allow all for development - restrict in production
    ],
    credentials: true,
  },
  namespace: '/tracking',
})
export class TrackingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<
    string,
    {
      socket: Socket;
      driverId?: string;
      role: 'customer' | 'driver' | 'admin';
    }
  >();

  constructor(private trackingService: TrackingService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  /**
   * Join a driver's tracking room
   * Customers join to watch a specific driver
   * Drivers join their own room
   */
  @SubscribeMessage('trackDriver')
  async handleTrackDriver(
    @MessageBody() data: { driverId: string; role: 'customer' | 'driver' | 'admin' },
    @ConnectedSocket() client: Socket,
  ) {
    const { driverId, role } = data;

    try {
      // Store client info
      this.connectedClients.set(client.id, {
        socket: client,
        driverId,
        role,
      });

      // Join the driver's room
      client.join(`driver-${driverId}`);

      console.log(
        `Client ${client.id} tracking driver ${driverId} as ${role}`,
      );

      // Send current location
      try {
        const trackingInfo =
          await this.trackingService.getDriverTrackingInfo(driverId);

        client.emit('currentLocation', {
          driver: trackingInfo.driver,
          location: trackingInfo.location,
        });
      } catch (error) {
        client.emit('error', { message: 'Failed to get current location' });
      }

      // Confirm successful join
      client.emit('trackingStarted', {
        driverId,
        role,
      });
    } catch (error) {
      console.error('Error tracking driver:', error);
      client.emit('error', { message: error.message || 'Failed to track driver' });
    }
  }

  /**
   * Stop tracking a driver
   */
  @SubscribeMessage('stopTracking')
  handleStopTracking(
    @MessageBody() data: { driverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { driverId } = data;

    client.leave(`driver-${driverId}`);
    this.connectedClients.delete(client.id);

    client.emit('trackingStopped', { driverId });
    console.log(`Client ${client.id} stopped tracking driver ${driverId}`);
  }

  /**
   * Driver sends location update via WebSocket
   */
  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @MessageBody() locationData: UpdateDriverLocationDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Save to database
      const savedLocation =
        await this.trackingService.updateDriverLocation(locationData);

      // Broadcast to all clients tracking this driver
      this.server
        .to(`driver-${locationData.driverId}`)
        .emit('locationUpdate', {
          driverId: locationData.driverId,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          speed: locationData.speed,
          heading: locationData.heading,
          accuracy: locationData.accuracy,
          timestamp: savedLocation.timestamp,
        });

      console.log(
        `Location update broadcasted for driver ${locationData.driverId}`,
      );
    } catch (error) {
      console.error('Error updating location:', error);
      client.emit('error', { message: error.message });
    }
  }

  /**
   * Get driver's current location (one-time request)
   */
  @SubscribeMessage('getDriverLocation')
  async handleGetDriverLocation(
    @MessageBody() data: { driverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const trackingInfo = await this.trackingService.getDriverTrackingInfo(
        data.driverId,
      );
      client.emit('driverLocation', trackingInfo);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  /**
   * Get all active drivers (for admin dashboard)
   */
  @SubscribeMessage('getAllDrivers')
  async handleGetAllDrivers(@ConnectedSocket() client: Socket) {
    try {
      const drivers = await this.trackingService.getAllActiveDriversLocations();
      client.emit('allDrivers', { drivers });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  /**
   * Find nearby drivers
   */
  @SubscribeMessage('findNearbyDrivers')
  async handleFindNearbyDrivers(
    @MessageBody() data: { latitude: number; longitude: number; radius?: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const nearbyDrivers = await this.trackingService.getNearbyDrivers(
        data.latitude,
        data.longitude,
        data.radius || 5,
      );
      client.emit('nearbyDrivers', { drivers: nearbyDrivers });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  /**
   * Broadcast notification to all clients tracking a driver
   */
  async notifyDriverWatchers(
    driverId: string,
    notification: {
      type: string;
      title: string;
      message: string;
      data?: any;
    },
  ) {
    this.server.to(`driver-${driverId}`).emit('notification', {
      driverId,
      ...notification,
      timestamp: new Date(),
    });
  }

  /**
   * Broadcast to all connected clients
   */
  async broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  /**
   * Get count of clients tracking a specific driver
   */
  getDriverWatcherCount(driverId: string): number {
    const room = this.server.sockets.adapter.rooms.get(`driver-${driverId}`);
    return room ? room.size : 0;
  }

  /**
   * Get all connected clients info (for monitoring)
   */
  getConnectedClients() {
    return Array.from(this.connectedClients.values()).map((client) => ({
      socketId: client.socket.id,
      driverId: client.driverId,
      role: client.role,
    }));
  }

  /**
   * Get statistics about tracking
   */
  getTrackingStats() {
    const stats = {
      totalConnections: this.connectedClients.size,
      customerConnections: 0,
      driverConnections: 0,
      adminConnections: 0,
      activeDriverRooms: new Set<string>(),
    };

    this.connectedClients.forEach((client) => {
      if (client.role === 'customer') stats.customerConnections++;
      if (client.role === 'driver') stats.driverConnections++;
      if (client.role === 'admin') stats.adminConnections++;
      if (client.driverId) stats.activeDriverRooms.add(client.driverId);
    });

    return {
      ...stats,
      activeDriverRooms: stats.activeDriverRooms.size,
    };
  }
}