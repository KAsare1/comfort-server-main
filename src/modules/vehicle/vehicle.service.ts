
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from 'src/database/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleStatus } from 'src/shared/enums';
import { VehicleQueryDto } from './dto/vehicle-query.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Check if vehicle with license plate already exists
    const existingVehicle = await this.findByLicensePlate(
      createVehicleDto.licensePlate,
    );
    if (existingVehicle) {
      throw new ConflictException(
        'Vehicle with this license plate already exists',
      );
    }

    const vehicle = this.vehiclesRepository.create(createVehicleDto);
    return this.vehiclesRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      relations: ['driver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
      relations: ['driver'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    return this.vehiclesRepository.findOne({
      where: { licensePlate },
      relations: ['driver'],
    });
  }

  async findAvailableVehicles(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      where: { status: VehicleStatus.ACTIVE },
      relations: ['driver'],
    });
  }

  async findUnassignedVehicles(): Promise<Vehicle[]> {
    return this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.driver', 'driver')
      .where('vehicle.status = :status', { status: VehicleStatus.ACTIVE })
      .andWhere('driver.id IS NULL')
      .getMany();
  }

  async assignToDriver(vehicleId: string, driverId: string): Promise<Vehicle> {
    const vehicle = await this.findById(vehicleId);

    // Optionally log previous driver for audit
    const previousDriverId = vehicle.driver ? vehicle.driver.id : null;
    if (previousDriverId && previousDriverId !== driverId) {
      // You can add logging here if needed
      // e.g., console.log(`Vehicle ${vehicleId} reassigned from driver ${previousDriverId} to ${driverId}`);
    }

    await this.vehiclesRepository
      .createQueryBuilder()
      .relation(Vehicle, 'driver')
      .of(vehicleId)
      .set(driverId);

    return this.findById(vehicleId);
  }

  async unassignFromDriver(vehicleId: string): Promise<Vehicle> {
    await this.vehiclesRepository
      .createQueryBuilder()
      .relation(Vehicle, 'driver')
      .of(vehicleId)
      .set(null);

    return this.findById(vehicleId);
  }

  async updateStatus(id: string, status: VehicleStatus): Promise<Vehicle> {
    const vehicle = await this.findById(id);

    await this.vehiclesRepository.update(id, { status });
    return this.findById(id);
  }

  async update(
    id: string,
    updateData: Partial<CreateVehicleDto>,
  ): Promise<Vehicle> {
    const vehicle = await this.findById(id);

    // Check license plate uniqueness if being updated
    if (
      updateData.licensePlate &&
      updateData.licensePlate !== vehicle.licensePlate
    ) {
      const existingVehicle = await this.findByLicensePlate(
        updateData.licensePlate,
      );
      if (existingVehicle) {
        throw new ConflictException(
          'Vehicle with this license plate already exists',
        );
      }
    }

    await this.vehiclesRepository.update(id, updateData);
    return this.findById(id);
  }

  async getExpiringDocuments(daysAhead: number = 30): Promise<Vehicle[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.driver', 'driver')
      .where(
        'vehicle.insuranceExpiry <= :futureDate OR vehicle.roadworthinessExpiry <= :futureDate',
        { futureDate },
      )
      .orderBy('vehicle.insuranceExpiry', 'ASC')
      .getMany();
  }

  async getVehicleStats() {
    const totalVehicles = await this.vehiclesRepository.count();

    const statusCounts = await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.status, COUNT(vehicle.id) as count')
      .groupBy('vehicle.status')
      .getRawMany();

    const assignedCount = await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoin('vehicle.driver', 'driver')
      .where('driver.id IS NOT NULL')
      .getCount();

    const unassignedCount = totalVehicles - assignedCount;

    return {
      totalVehicles,
      assignedCount,
      unassignedCount,
      statusCounts,
    };
  }

  async delete(id: string): Promise<void> {
    const vehicle = await this.findById(id);
    await this.vehiclesRepository.remove(vehicle);
  }

  async findWithPagination(queryDto: VehicleQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      hasDriver,
      search,
      make,
      year,
    } = queryDto;

    const query = this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.driver', 'driver');

    if (status) {
      query.andWhere('vehicle.status = :status', { status });
    }

    if (hasDriver !== undefined) {
      if (hasDriver) {
        query.andWhere('driver.id IS NOT NULL');
      } else {
        query.andWhere('driver.id IS NULL');
      }
    }

    if (search) {
      query.andWhere(
        '(vehicle.licensePlate ILIKE :search OR vehicle.make ILIKE :search OR vehicle.model ILIKE :search OR vehicle.vin ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (make) {
      query.andWhere('vehicle.make ILIKE :make', { make: `%${make}%` });
    }

    if (year) {
      query.andWhere('vehicle.year = :year', { year });
    }

    const total = await query.getCount();
    const vehicles = await query
      .orderBy('vehicle.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: vehicles,
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

  async getVehiclesByMake(): Promise<Array<{ make: string; count: number }>> {
    return this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.make, COUNT(vehicle.id) as count')
      .groupBy('vehicle.make')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

    /**
   * Reset available seats of a vehicle
   *
   * @param id - Vehicle ID
   * @param seats - Number of seats to reset to (optional)
   * @returns Updated vehicle
   */
  async resetSeats(id: string, seats?: number): Promise<Vehicle> {
    const vehicle = await this.findById(id);
    let resetSeats: number;
    if (typeof seats === 'number' && seats > 0) {
      resetSeats = seats;
    } else if (vehicle.totalSeats && vehicle.totalSeats > 0) {
      resetSeats = vehicle.totalSeats;
    } else if (vehicle.capacity && vehicle.capacity > 0) {
      resetSeats = vehicle.capacity;
    } else {
      resetSeats = 4;
    }
    await this.vehiclesRepository.update(id, { seatsAvailable: resetSeats });
    return this.findById(id);
  }

  async getMaintenanceAlerts(): Promise<{
    expiringInsurance: Vehicle[];
    expiringRoadworthiness: Vehicle[];
    maintenanceRequired: Vehicle[];
  }> {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const expiringInsurance = await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.driver', 'driver')
      .where(
        'vehicle.insuranceExpiry <= :date AND vehicle.insuranceExpiry >= :now',
        { date: thirtyDaysFromNow, now },
      )
      .orderBy('vehicle.insuranceExpiry', 'ASC')
      .getMany();

    const expiringRoadworthiness = await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.driver', 'driver')
      .where(
        'vehicle.roadworthinessExpiry <= :date AND vehicle.roadworthinessExpiry >= :now',
        { date: thirtyDaysFromNow, now },
      )
      .orderBy('vehicle.roadworthinessExpiry', 'ASC')
      .getMany();

    const maintenanceRequired = await this.vehiclesRepository.find({
      where: { status: VehicleStatus.MAINTENANCE },
      relations: ['driver'],
    });

    return {
      expiringInsurance,
      expiringRoadworthiness,
      maintenanceRequired,
    };
  }
}
