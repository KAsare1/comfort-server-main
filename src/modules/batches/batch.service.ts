import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Batch, BatchStatus } from 'src/database/entities/batch.entity';
import { Booking } from 'src/database/entities/booking.entity';
import { Driver } from 'src/database/entities/driver.entity';
import { Vehicle } from 'src/database/entities/vehicle.entity';
import { DriverStatus, BookingStatus } from 'src/shared/enums';
import { DriversService } from '../drivers/drivers.service';
import { VehiclesService } from '../vehicle/vehicle.service';

/**
 * @fileoverview
 * Batch service for managing vehicle ride batches
 *
 * @remarks
 * Handles batch creation, passenger assignment, batch completion, and driver availability management
 * in a batch-based ride sharing system.
 */
@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    private driversService: DriversService,
    private vehiclesService: VehiclesService,
  ) {}

  /**
   * Create a new batch with the first booking
   * Called when assigning the first booking to an available driver/vehicle
   */
  async createBatch(
    driverId: string,
    vehicleId: string,
    pickupLocation: string,
    pickupStop: string | null,
    dropoffLocation: string,
    dropoffStop: string | null,
    departureDate: string,
    departureTime: string,
    seatsBooked: number,
    totalSeats: number,
  ): Promise<Batch> {
    // Verify driver and vehicle exist
    const driver = await this.driverRepository.findOne({
      where: { id: driverId, isActive: true },
    });
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const vehicle = await this.vehicleRepository.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Create new batch using scalar IDs (avoid passing relation objects)
    const batch = this.batchRepository.create(
      {
        driverId,
        vehicleId,
        pickupLocation,
        pickupStop: pickupStop ?? null,
        dropoffLocation,
        dropoffStop: dropoffStop ?? null,
        departureDate,
        departureTime,
        status: BatchStatus.ACTIVE,
        seatsBooked,
        totalSeats,
        seatsAvailable: Math.max(totalSeats - seatsBooked, 0),
        startedAt: new Date(),
      } as DeepPartial<Batch>,
    );

    const saved = await this.batchRepository.save(batch);
    const savedBatch: Batch = Array.isArray(saved) ? saved[0] : saved;

    // Update driver's current batch (store the batch id)
    await this.driverRepository.update(driverId, {
      currentBatchId: savedBatch.id as any,
    } as any);

    return savedBatch;
  }

  /**
   * Add a booking to an existing batch
   * Called when assigning additional bookings to the same batch
   */
  async addBookingToBatch(
    batchId: string,
    bookingId: string,
    seatsToAdd: number,
  ): Promise<Batch> {
    const batch = await this.findById(batchId);

    if (batch.status !== BatchStatus.ACTIVE) {
      throw new BadRequestException('Batch is not active');
    }

    if (batch.seatsAvailable < seatsToAdd) {
      throw new BadRequestException('Not enough seats available in batch');
    }

    // Update batch seat counts
    const updatedSeatsAvailable = batch.seatsAvailable - seatsToAdd;
    const updatedSeatsBooked = batch.seatsBooked + seatsToAdd;

    await this.batchRepository.update(batchId, {
      seatsAvailable: updatedSeatsAvailable,
      seatsBooked: updatedSeatsBooked,
    });

    // Update booking with batch info
    const batchNumber = (await this.bookingRepository.count({
      where: { batchId },
    })) + 1;

    await this.bookingRepository.update(bookingId, {
      batchId,
      batchNumber,
    });

    // If batch is now full, set driver to BUSY
    if (updatedSeatsAvailable === 0) {
      await this.driversService.updateStatus(batch.driverId, DriverStatus.BUSY);
    }

    return this.findById(batchId);
  }

  /**
   * Get batch by ID
   */
  async findById(id: string): Promise<Batch> {
    const batch = await this.batchRepository.findOne({
      where: { id },
      relations: ['driver', 'vehicle', 'bookings'],
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    return batch;
  }

  /**
   * Get all active batches for a driver
   */
  async getActiveBatchesForDriver(driverId: string): Promise<Batch[]> {
    return this.batchRepository.find({
      where: { driverId, status: BatchStatus.ACTIVE },
      relations: ['bookings', 'vehicle'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get current active batch for a driver
   */
  async getCurrentBatchForDriver(driverId: string): Promise<Batch | null> {
    return this.batchRepository.findOne({
      where: { driverId, status: BatchStatus.ACTIVE },
      relations: ['bookings', 'vehicle'],
    });
  }

  /**
   * Verify that all bookings in batch match the dropoff location
   */
  async verifyBatchDropoffLocation(batchId: string, currentLocation: string): Promise<boolean> {
    const batch = await this.findById(batchId);

    if (batch.dropoffLocation !== currentLocation) {
      throw new BadRequestException(
        `Cannot drop off batch at ${currentLocation}. Expected location: ${batch.dropoffLocation}`,
      );
    }

    // Verify all bookings in batch have matching dropoff location
    const bookings = await this.bookingRepository.find({
      where: { batchId },
    });

    const allMatch = bookings.every(
      (booking) => booking.dropoffLocation === currentLocation,
    );

    if (!allMatch) {
      throw new BadRequestException(
        'Not all bookings in batch have matching dropoff location',
      );
    }

    return true;
  }

  /**
   * Complete a batch (all passengers dropped off)
   * Sets driver to AVAILABLE and resets vehicle seats
   */
  async completeBatch(batchId: string, dropoffLocation?: string): Promise<Batch> {
    const batch = await this.findById(batchId);

    if (batch.status !== BatchStatus.ACTIVE) {
      throw new BadRequestException('Batch is not active');
    }

    // Verify location if provided
    if (dropoffLocation) {
      await this.verifyBatchDropoffLocation(batchId, dropoffLocation);
    }

    // Mark batch as completed
    await this.batchRepository.update(batchId, {
      status: BatchStatus.COMPLETED,
      completedAt: new Date(),
    });

    // Mark all bookings in batch as completed
    await this.bookingRepository.update(
      { batchId },
      { status: BookingStatus.COMPLETED, completedAt: new Date() },
    );

    // Reset vehicle seats
    if (batch.vehicleId) {
      const vehicle = await this.vehiclesService.findById(batch.vehicleId);
      await this.vehiclesService.update(batch.vehicleId, {
        seatsAvailable: vehicle.totalSeats,
      });
    }

    // Set driver to AVAILABLE
    if (batch.driverId) {
      await this.driverRepository.update(batch.driverId, {
        currentBatchId: null as any,
      } as any);
      await this.driversService.updateStatus(batch.driverId, DriverStatus.AVAILABLE);
    }

    return this.findById(batchId);
  }

  /**
   * Cancel a batch
   */
  async cancelBatch(batchId: string, reason?: string): Promise<Batch> {
    const batch = await this.findById(batchId);

    if (batch.status !== BatchStatus.ACTIVE) {
      throw new BadRequestException('Only active batches can be cancelled');
    }

    // Mark batch as cancelled
    await this.batchRepository.update(batchId, {
      status: BatchStatus.CANCELLED,
    });

    // Reset related bookings
    const bookings = await this.bookingRepository.find({
      where: { batchId },
    });

    for (const booking of bookings) {
      if (booking.status === BookingStatus.ASSIGNED) {
        await this.bookingRepository.update(booking.id, {
          status: BookingStatus.PENDING,
          driverId: null,
          batchId: null,
          batchNumber: null,
        } as any);
      }
    }

    // Reset vehicle seats
    if (batch.vehicleId) {
      const vehicle = await this.vehiclesService.findById(batch.vehicleId);
      await this.vehiclesService.update(batch.vehicleId, {
        seatsAvailable: vehicle.totalSeats,
      });
    }

    // Set driver to AVAILABLE
    if (batch.driverId) {
      await this.driverRepository.update(batch.driverId, {
        currentBatchId: null as any,
      } as any);
      await this.driversService.updateStatus(batch.driverId, DriverStatus.AVAILABLE);
    }

    return this.findById(batchId);
  }

  /**
   * Get batch by reference code (group of bookings)
   */
  async getBatchByBookingReference(reference: string): Promise<Batch | null> {
    const booking = await this.bookingRepository.findOne({
      where: { reference },
    });

    if (!booking || !booking.batchId) {
      return null;
    }

    return this.findById(booking.batchId);
  }

  /**
   * Get all batches for a driver with pagination
   */
  async getBatchesForDriver(
    driverId: string,
    page: number = 1,
    limit: number = 10,
    status?: BatchStatus,
  ) {
    const query = this.batchRepository
      .createQueryBuilder('batch')
      .where('batch.driverId = :driverId', { driverId })
      .leftJoinAndSelect('batch.bookings', 'bookings')
      .leftJoinAndSelect('batch.vehicle', 'vehicle');

    if (status) {
      query.andWhere('batch.status = :status', { status });
    }

    const total = await query.getCount();
    const batches = await query
      .orderBy('batch.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: batches,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Check if a driver can continue accepting bookings for current batch
   */
  async canAcceptMoreBookings(driverId: string): Promise<{
    canAccept: boolean;
    currentBatch?: Batch;
    reason?: string;
  }> {
    const currentBatch = await this.getCurrentBatchForDriver(driverId);

    if (!currentBatch) {
      return { canAccept: true };
    }

    if (currentBatch.status !== BatchStatus.ACTIVE) {
      return {
        canAccept: false,
        reason: 'Current batch is not active',
      };
    }

    if (currentBatch.seatsAvailable <= 0) {
      return {
        canAccept: false,
        currentBatch,
        reason: 'Current batch is full',
      };
    }

    return {
      canAccept: true,
      currentBatch,
    };
  }
}
