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
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationUpdate } from 'src/common/interfaces/tracking.interface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  namespace: '/tracking',
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, { socket: Socket; bookingId?: string; role: 'customer' | 'driver' }>();

  constructor(private trackingService: TrackingService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('joinBooking')
  async handleJoinBooking(
    @MessageBody() data: { bookingId: string; role: 'customer' | 'driver' },
    @ConnectedSocket() client: Socket,
  ) {
    const { bookingId, role } = data;
    
    // Store client info
    this.connectedClients.set(client.id, { socket: client, bookingId, role });
    
    // Join the booking room
    client.join(`booking-${bookingId}`);
    
    // Send current location if available
    try {
      const trackingInfo = await this.trackingService.getActiveBookingLocation(bookingId);
      client.emit('currentLocation', trackingInfo);
    } catch (error) {
      client.emit('error', { message: 'Failed to get current location' });
    }

    client.emit('joinedBooking', { bookingId, role });
  }

  @SubscribeMessage('leaveBooking')
  handleLeaveBooking(
    @MessageBody() data: { bookingId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`booking-${data.bookingId}`);
    this.connectedClients.delete(client.id);
    client.emit('leftBooking', { bookingId: data.bookingId });
  }

  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @MessageBody() locationData: UpdateLocationDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Save tracking data
      const trackingData = await this.trackingService.updateDriverLocation(locationData);
      
      // Broadcast to all clients tracking this booking
      this.server.to(`booking-${locationData.bookingId}`).emit('locationUpdate', {
        bookingId: locationData.bookingId,
        driverId: locationData.driverId,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        speed: locationData.speed,
        heading: locationData.heading,
        accuracy: locationData.accuracy,
        timestamp: trackingData.timestamp,
      });

    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('getBookingLocation')
  async handleGetBookingLocation(
    @MessageBody() data: { bookingId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const trackingInfo = await this.trackingService.getActiveBookingLocation(data.bookingId);
      client.emit('bookingLocation', trackingInfo);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  // Method to broadcast booking status updates
  async broadcastBookingStatusUpdate(bookingId: string, status: string, metadata?: any) {
    this.server.to(`booking-${bookingId}`).emit('statusUpdate', {
      bookingId,
      status,
      timestamp: new Date(),
      ...metadata,
    });
  }

  // Method to broadcast driver arrival
  async broadcastDriverArrival(bookingId: string, location: LocationUpdate) {
    this.server.to(`booking-${bookingId}`).emit('driverArrived', {
      bookingId,
      location,
      timestamp: new Date(),
    });
  }

  // Method to send notifications
  async sendNotification(bookingId: string, notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    this.server.to(`booking-${bookingId}`).emit('notification', {
      ...notification,
      timestamp: new Date(),
    });
  }
}