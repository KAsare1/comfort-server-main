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
exports.BatchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const batch_service_1 = require("./batch.service");
const batch_entity_1 = require("../../database/entities/batch.entity");
let BatchController = class BatchController {
    batchService;
    constructor(batchService) {
        this.batchService = batchService;
    }
    async getBatch(id) {
        return this.batchService.findById(id);
    }
    async getCurrentBatch(driverId) {
        const batch = await this.batchService.getCurrentBatchForDriver(driverId);
        if (!batch) {
            return { message: 'No active batch found' };
        }
        return batch;
    }
    async getActiveBatches(driverId) {
        return this.batchService.getActiveBatchesForDriver(driverId);
    }
    async getBatchesForDriver(driverId, page, limit, status) {
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        return this.batchService.getBatchesForDriver(driverId, pageNum, limitNum, status);
    }
    async checkAvailability(driverId) {
        return this.batchService.canAcceptMoreBookings(driverId);
    }
    async completeBatch(id, body) {
        return this.batchService.completeBatch(id, body?.dropoffLocation);
    }
    async cancelBatch(id, body) {
        return this.batchService.cancelBatch(id, body?.reason);
    }
};
exports.BatchController = BatchController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get batch details by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "getBatch", null);
__decorate([
    (0, common_1.Get)('driver/:driverId/current'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current active batch for driver' }),
    __param(0, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "getCurrentBatch", null);
__decorate([
    (0, common_1.Get)('driver/:driverId/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active batches for driver' }),
    __param(0, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "getActiveBatches", null);
__decorate([
    (0, common_1.Get)('driver/:driverId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all batches for driver with pagination' }),
    __param(0, (0, common_1.Param)('driverId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "getBatchesForDriver", null);
__decorate([
    (0, common_1.Get)('driver/:driverId/check-availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if driver can accept more bookings' }),
    __param(0, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete batch (confirm all drop-offs)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                dropoffLocation: {
                    type: 'string',
                    example: 'Adum',
                    description: 'Current location for verification',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "completeBatch", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a batch' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                reason: {
                    type: 'string',
                    example: 'Driver unavailable',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "cancelBatch", null);
exports.BatchController = BatchController = __decorate([
    (0, swagger_1.ApiTags)('batches'),
    (0, common_1.Controller)('batches'),
    __metadata("design:paramtypes", [batch_service_1.BatchService])
], BatchController);
//# sourceMappingURL=batch.controller.js.map