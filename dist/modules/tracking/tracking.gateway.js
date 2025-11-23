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
const update_driver_location_dto_1 = require("../drivers/dto/update-driver-location.dto");
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
    async handleTrackDriver(data, client) {
        const { driverId, role } = data;
        try {
            this.connectedClients.set(client.id, {
                socket: client,
                driverId,
                role,
            });
            client.join(`driver-${driverId}`);
            console.log(`Client ${client.id} tracking driver ${driverId} as ${role}`);
            try {
                const trackingInfo = await this.trackingService.getDriverTrackingInfo(driverId);
                client.emit('currentLocation', {
                    driver: trackingInfo.driver,
                    location: trackingInfo.location,
                });
            }
            catch (error) {
                client.emit('error', { message: 'Failed to get current location' });
            }
            client.emit('trackingStarted', {
                driverId,
                role,
            });
        }
        catch (error) {
            console.error('Error tracking driver:', error);
            client.emit('error', { message: error.message || 'Failed to track driver' });
        }
    }
    handleStopTracking(data, client) {
        const { driverId } = data;
        client.leave(`driver-${driverId}`);
        this.connectedClients.delete(client.id);
        client.emit('trackingStopped', { driverId });
        console.log(`Client ${client.id} stopped tracking driver ${driverId}`);
    }
    async handleLocationUpdate(locationData, client) {
        try {
            const savedLocation = await this.trackingService.updateDriverLocation(locationData);
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
            console.log(`Location update broadcasted for driver ${locationData.driverId}`);
        }
        catch (error) {
            console.error('Error updating location:', error);
            client.emit('error', { message: error.message });
        }
    }
    async handleGetDriverLocation(data, client) {
        try {
            const trackingInfo = await this.trackingService.getDriverTrackingInfo(data.driverId);
            client.emit('driverLocation', trackingInfo);
        }
        catch (error) {
            client.emit('error', { message: error.message });
        }
    }
    async handleGetAllDrivers(client) {
        try {
            const drivers = await this.trackingService.getAllActiveDriversLocations();
            client.emit('allDrivers', { drivers });
        }
        catch (error) {
            client.emit('error', { message: error.message });
        }
    }
    async handleFindNearbyDrivers(data, client) {
        try {
            const nearbyDrivers = await this.trackingService.getNearbyDrivers(data.latitude, data.longitude, data.radius || 5);
            client.emit('nearbyDrivers', { drivers: nearbyDrivers });
        }
        catch (error) {
            client.emit('error', { message: error.message });
        }
    }
    async notifyDriverWatchers(driverId, notification) {
        this.server.to(`driver-${driverId}`).emit('notification', {
            driverId,
            ...notification,
            timestamp: new Date(),
        });
    }
    async broadcastToAll(event, data) {
        this.server.emit(event, data);
    }
    getDriverWatcherCount(driverId) {
        const room = this.server.sockets.adapter.rooms.get(`driver-${driverId}`);
        return room ? room.size : 0;
    }
    getConnectedClients() {
        return Array.from(this.connectedClients.values()).map((client) => ({
            socketId: client.socket.id,
            driverId: client.driverId,
            role: client.role,
        }));
    }
    getTrackingStats() {
        const stats = {
            totalConnections: this.connectedClients.size,
            customerConnections: 0,
            driverConnections: 0,
            adminConnections: 0,
            activeDriverRooms: new Set(),
        };
        this.connectedClients.forEach((client) => {
            if (client.role === 'customer')
                stats.customerConnections++;
            if (client.role === 'driver')
                stats.driverConnections++;
            if (client.role === 'admin')
                stats.adminConnections++;
            if (client.driverId)
                stats.activeDriverRooms.add(client.driverId);
        });
        return {
            ...stats,
            activeDriverRooms: stats.activeDriverRooms.size,
        };
    }
};
exports.TrackingGateway = TrackingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TrackingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('trackDriver'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleTrackDriver", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stopTracking'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TrackingGateway.prototype, "handleStopTracking", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateLocation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_driver_location_dto_1.UpdateDriverLocationDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleLocationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getDriverLocation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleGetDriverLocation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getAllDrivers'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleGetAllDrivers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findNearbyDrivers'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TrackingGateway.prototype, "handleFindNearbyDrivers", null);
exports.TrackingGateway = TrackingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [
                'http://localhost:3000',
                'http://localhost:3001',
                'https://your-frontend-domain.com',
                '*',
            ],
            credentials: true,
        },
        namespace: '/tracking',
    }),
    __metadata("design:paramtypes", [tracking_service_1.TrackingService])
], TrackingGateway);
//# sourceMappingURL=tracking.gateway.js.map