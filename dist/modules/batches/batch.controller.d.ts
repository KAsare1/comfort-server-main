import { BatchService } from './batch.service';
import { BatchStatus } from 'src/database/entities/batch.entity';
export declare class BatchController {
    private readonly batchService;
    constructor(batchService: BatchService);
    getBatch(id: string): Promise<import("src/database/entities/batch.entity").Batch>;
    getCurrentBatch(driverId: string): Promise<import("src/database/entities/batch.entity").Batch | {
        message: string;
    }>;
    getActiveBatches(driverId: string): Promise<import("src/database/entities/batch.entity").Batch[]>;
    getBatchesForDriver(driverId: string, page?: string, limit?: string, status?: BatchStatus): Promise<{
        data: import("src/database/entities/batch.entity").Batch[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    checkAvailability(driverId: string): Promise<{
        canAccept: boolean;
        currentBatch?: import("src/database/entities/batch.entity").Batch;
        reason?: string;
    }>;
    completeBatch(id: string, body?: {
        dropoffLocation?: string;
    }): Promise<import("src/database/entities/batch.entity").Batch>;
    cancelBatch(id: string, body?: {
        reason?: string;
    }): Promise<import("src/database/entities/batch.entity").Batch>;
}
