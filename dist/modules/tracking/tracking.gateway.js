"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const tracking_service_1 = require("./tracking.service");
const update_location_dto_1 = require("./dto/update-location.dto");
let TrackingGateway = class TrackingGateway {
    trackingService;
    server;
    connectedClients = new Map();
    constructor(trackingService) {
        this.trackingService = trackingService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedClients.delete(client.id);
    }
    async handleJoinBooking(data, client) {
        const { bookingId, role } = data;
        this.connectedClients.set(client.id, { socket: client, bookingId, role });
        client.join(`booking-${bookingId}`);
        try {
            const trackingInfo = await this.trackingService.getActiveBookingLocation(bookingId);
            client.emit('currentLocation', trackingInfo);
        }
        catch (error) {
            client.emit('error', { message: 'Failed to get current location' });
        }
        client.emit('joinedBooking', { bookingId, role });
    }
    handleLeaveBooking(data, client) {
        client.leave(`booking-${data.bookingId}`);
        this.connectedClients.delete(client.id);
        client.emit('leftBooking', { bookingId: data.bookingId });
    }
    async handleLocationUpdate(locationData, client) {
        try {
            const trackingData = await this.trackingService.updateDriverLocation(locationData);
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
        }
        catch (error) {
            client.emit('error', { message: error.message });
        }
    }
    async handleGetBookingLocation(data, client) {
        try {
            const trackingInfo = await this.trackingService.getActiveBookingLocation(data.bookingId);
            client.emit('bookingLocation', trackingInfo);
        }
        catch (error) {
            client.emit('error', { message: error.message });
        }
    }
    async broadcastBookingStatusUpdate(bookingId, status, metadata) {
        this.server.to(`booking-${bookingId}`).emit('statusUpdate', {
            bookingId,
            status,
            timestamp: new Date(),
            ...metadata,
        });
    }
    async broadcastDriverArrival(bookingId, location) {
        this.server.to(`booking-${bookingId}`).emit('driverArrived', {
            bookingId,
            location,
            timestamp: new Date(),
        });
    }
    async sendNotification(bookingId, notification) {
        this.server.to(`booking-${bookingId}`).emit('notification', {
            ...notification,
            timestamp: new Date(),
        });
    }
};
exports.TrackingGateway = TrackingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TrackingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinBooking'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleJoinBooking", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveBooking'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TrackingGateway.prototype, "handleLeaveBooking", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateLocation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_location_dto_1.UpdateLocationDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleLocationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getBookingLocation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleGetBookingLocation", null);
exports.TrackingGateway = TrackingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            credentials: true,
        },
        namespace: '/tracking',
    }),
    __metadata("design:paramtypes", [tracking_service_1.TrackingService])
], TrackingGateway);
//# sourceMappingURL=tracking.gateway.js.map