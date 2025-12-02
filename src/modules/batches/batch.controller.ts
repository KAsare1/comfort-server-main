import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { BatchService } from './batch.service';
import { BatchStatus } from 'src/database/entities/batch.entity';

@ApiTags('batches')
@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  /**
   * Get batch by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get batch details by ID' })
  async getBatch(@Param('id') id: string) {
    return this.batchService.findById(id);
  }

  /**
   * Get current active batch for a driver
   */
  @Get('driver/:driverId/current')
  @ApiOperation({ summary: 'Get current active batch for driver' })
  async getCurrentBatch(@Param('driverId') driverId: string) {
    const batch = await this.batchService.getCurrentBatchForDriver(driverId);
    if (!batch) {
      return { message: 'No active batch found' };
    }
    return batch;
  }

  /**
   * Get all active batches for a driver
   */
  @Get('driver/:driverId/active')
  @ApiOperation({ summary: 'Get all active batches for driver' })
  async getActiveBatches(@Param('driverId') driverId: string) {
    return this.batchService.getActiveBatchesForDriver(driverId);
  }

  /**
   * Get all batches for a driver with pagination
   */
  @Get('driver/:driverId')
  @ApiOperation({ summary: 'Get all batches for driver with pagination' })
  async getBatchesForDriver(
    @Param('driverId') driverId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: BatchStatus,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    return this.batchService.getBatchesForDriver(
      driverId,
      pageNum,
      limitNum,
      status,
    );
  }

  /**
   * Check if driver can accept more bookings
   */
  @Get('driver/:driverId/check-availability')
  @ApiOperation({ summary: 'Check if driver can accept more bookings' })
  async checkAvailability(@Param('driverId') driverId: string) {
    return this.batchService.canAcceptMoreBookings(driverId);
  }

  /**
   * Complete a batch (confirm all drop-offs)
   */
  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete batch (confirm all drop-offs)' })
  @ApiBody({
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
  })
  async completeBatch(
    @Param('id') id: string,
    @Body() body?: { dropoffLocation?: string },
  ) {
    return this.batchService.completeBatch(id, body?.dropoffLocation);
  }

  /**
   * Cancel a batch
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a batch' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          example: 'Driver unavailable',
        },
      },
    },
  })
  async cancelBatch(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.batchService.cancelBatch(id, body?.reason);
  }
}
