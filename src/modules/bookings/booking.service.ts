import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Booking } from 'src/database/entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Generators } from 'src/common/utils/generator';
import { BookingStatus, TripType, PaymentMethod } from 'src/shared/enums';
import { PaymentsService } from '../payments/payments.service';
import { SmsService } from '../notifications/sms/sms.service';
import { VehiclesService } from '../vehicle/vehicle.service';
import { DriversService } from '../drivers/drivers.service';

@Injectable()
export class BookingsService {
  // Pricing matrix matching frontend
  private readonly pricingMatrix: Record<string, Record<string, number>> = {
    'Abuakwa': { 'Adum': 10, 'Kejetia': 9, 'Sofoline': 7, 'Kwadaso': 7, 'Asuoyeboah': 6, 'Tanoso': 6 },
    'Tanoso': { 'Adum': 8, 'Kejetia': 7, 'Sofoline': 6, 'Kwadaso': 5, 'Asuoyeboah': 5 },
    'Asuoyeboah': { 'Adum': 6, 'Kejetia': 5, 'Kwadaso': 5, 'Sofoline': 5 },
    'Kwadaso': { 'Adum': 6, 'Kejetia': 5, 'Sofoline': 5 }
  };

  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private usersService: UsersService,
    @Inject(forwardRef(() => PaymentsService))
    private paymentsService: PaymentsService,
    private smsService: SmsService,
  private vehiclesService: VehiclesService,
  private driversService: DriversService,
  ) {}

  /**
   * Calculate fare based on pickup and dropoff locations
   */
  private calculateFare(pickupLocation: string, dropoffLocation: string, tripType: TripType): number {
    if (!pickupLocation || !dropoffLocation || pickupLocation === dropoffLocation) {
      return 0;
    }

    // Check direct route
    let fare = this.pricingMatrix[pickupLocation]?.[dropoffLocation];

    // Check reverse route (same price both ways)
    if (!fare) {
      fare = this.pricingMatrix[dropoffLocation]?.[pickupLocation];
    }

    if (!fare) {
      throw new BadRequestException('Route not available between selected locations');
    }

    // Double fare for round trips
    return tripType === TripType.ROUND_TRIP ? fare * 2 : fare;
  }

  async create(createBookingDto: CreateBookingDto): Promise<{ booking: Booking; paymentInitResponse?: any }> {
    // Find or create user
    const user = await this.usersService.findOrCreate({
      name: createBookingDto.name,
      phone: createBookingDto.phone,
    });

    // Calculate fare
    const totalAmount = this.calculateFare(
      createBookingDto.pickupLocation,
      createBookingDto.dropoffLocation,
      createBookingDto.tripType
    );

    // Create booking
    const booking = this.bookingsRepository.create({
      reference: Generators.generateBookingReference(),
      customerId: user.id,
      pickupLocation: createBookingDto.pickupLocation,
      pickupStop: createBookingDto.pickupStop,
      dropoffLocation: createBookingDto.dropoffLocation,
      dropoffStop: createBookingDto.dropoffStop,
      departureTime: createBookingDto.departureTime,
      departureDate: createBookingDto.departureDate,
      tripType: createBookingDto.tripType,
      totalAmount,
      notes: createBookingDto.notes,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingsRepository.save(booking);

    let paymentInitResponse: any = undefined;
    // Initialize payment if paymentMethod is provided
    if (createBookingDto.paymentMethod === PaymentMethod.MOMO || createBookingDto.paymentMethod === PaymentMethod.VISA || createBookingDto.paymentMethod === PaymentMethod.MASTERCARD) {
      paymentInitResponse = await this.paymentsService.initializePayment({
        bookingId: savedBooking.id,
        amount: totalAmount,
        method: createBookingDto.paymentMethod,
        customerEmail: user.email || `${user.phone}@comfort.com`,
        callbackUrl: '', // Set callback URL as needed
      });

      // Send SMS after payment initialization
      const smsMessage = this.smsService.getBookingConfirmationMessage(
        savedBooking.reference,
        savedBooking.departureTime,
        savedBooking.pickupLocation
      );
      await this.smsService.sendSms(
        user.phone,
        smsMessage
      );
    } else {
      // Send SMS for bookings without payment (e.g., pay later)
      const smsMessage = this.smsService.getBookingConfirmationMessage(
        savedBooking.reference,
        savedBooking.departureTime,
        savedBooking.pickupLocation
      );
      await this.smsService.sendSms(
        user.phone,
        smsMessage
      );
    }

    return { booking: savedBooking, paymentInitResponse };
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['customer', 'driver', 'driver.vehicle', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['customer', 'driver', 'driver.vehicle', 'payment', 'trackingData'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async findByReference(reference: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { reference },
      relations: ['customer', 'driver', 'driver.vehicle', 'payment'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async findByCustomer(customerId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { customerId },
      relations: ['driver', 'driver.vehicle', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDriver(driverId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { driverId },
      relations: ['customer', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: BookingStatus, metadata?: Record<string, any>): Promise<Booking> {
    const booking = await this.findById(id);
    
    const updateData: Partial<Booking> = { status };
    
    // Update timestamps based on status
    switch (status) {
      case BookingStatus.ASSIGNED:
        updateData.assignedAt = new Date();
        if (metadata?.driverId) {
          updateData.driverId = metadata.driverId;
        }
        break;
      case BookingStatus.IN_PROGRESS:
        updateData.startedAt = new Date();
        break;
      case BookingStatus.COMPLETED:
        updateData.completedAt = new Date();
        break;
    }

    await this.bookingsRepository.update(id, updateData);
    return this.findById(id);
  }

  async assignDriver(bookingId: string, driverId: string): Promise<Booking> {
    // Find booking and driver
    const booking = await this.findById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (!booking.seatsBooked) booking.seatsBooked = 1;

    // Find driver's vehicle

  const driver = await this.driversService.findById(driverId);
  if (!driver || !driver.vehicle) throw new BadRequestException('Driver or vehicle not found');
  const vehicle = await this.vehiclesService.findById(driver.vehicle.id);
  if (!vehicle) throw new BadRequestException('Vehicle not found');

    // Check seat availability
    if (vehicle.seatsAvailable < booking.seatsBooked) {
      throw new BadRequestException('Not enough seats available in the vehicle');
    }

    // Decrement seatsAvailable
    await this.vehiclesService.update(vehicle.id, { seatsAvailable: vehicle.seatsAvailable - booking.seatsBooked });

    // Assign driver and update booking status
    return this.updateStatus(bookingId, BookingStatus.ASSIGNED, { driverId });
  }

  async cancel(id: string, reason?: string): Promise<Booking> {
    const booking = await this.findById(id);
    
    if ([BookingStatus.COMPLETED, BookingStatus.CANCELLED].includes(booking.status)) {
      throw new BadRequestException('Cannot cancel this booking');
    }

    return this.updateStatus(id, BookingStatus.CANCELLED);
  }

  async getActiveBookings(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: [
        { status: BookingStatus.CONFIRMED },
        { status: BookingStatus.ASSIGNED },
        { status: BookingStatus.EN_ROUTE },
        { status: BookingStatus.ARRIVED },
        { status: BookingStatus.IN_PROGRESS },
      ],
      relations: ['customer', 'driver', 'driver.vehicle'],
      order: { createdAt: 'ASC' },
    });
  }

  async getBookingStats(startDate?: Date, endDate?: Date) {
    const query = this.bookingsRepository.createQueryBuilder('booking');
    
    if (startDate) {
      query.andWhere('booking.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('booking.createdAt <= :endDate', { endDate });
    }

    const totalBookings = await query.getCount();
    
    const statusCounts = await query
      .select('booking.status, COUNT(booking.id) as count')
      .groupBy('booking.status')
      .getRawMany();
    
    const totalRevenue = await query
      .select('SUM(booking.totalAmount)', 'total')
      .where('booking.status = :status', { status: BookingStatus.COMPLETED })
      .getRawOne();

    return {
      totalBookings,
      statusCounts,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
    };
  }

  async findWithPagination(queryDto: import('./dto/booking-query.dto').BookingQueryDto) {
    const { page = 1, limit = 10, status, tripType, customerId, driverId, startDate, endDate, search } = queryDto;
    
    const query = this.bookingsRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.driver', 'driver')
      .leftJoinAndSelect('driver.vehicle', 'vehicle')
      .leftJoinAndSelect('booking.payment', 'payment');

    if (status) query.andWhere('booking.status = :status', { status });
    if (tripType) query.andWhere('booking.tripType = :tripType', { tripType });
    if (customerId) query.andWhere('booking.customerId = :customerId', { customerId });
    if (driverId) query.andWhere('booking.driverId = :driverId', { driverId });
    if (startDate) query.andWhere('booking.createdAt >= :startDate', { startDate: new Date(startDate) });
    if (endDate) query.andWhere('booking.createdAt <= :endDate', { endDate: new Date(endDate) });
    
    if (search) {
      query.andWhere(
        '(booking.reference ILIKE :search OR booking.pickupLocation ILIKE :search OR booking.pickupStop ILIKE :search OR booking.dropoffLocation ILIKE :search OR booking.dropoffStop ILIKE :search OR customer.name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const total = await query.getCount();
    const bookings = await query
      .orderBy('booking.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: bookings,
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

  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { createdAt: Between(startDate, endDate) },
      relations: ['customer', 'driver', 'driver.vehicle', 'payment'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUpcomingBookings(): Promise<Booking[]> {
    const today = new Date().toISOString().split('T')[0];
    
    return this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.departureDate >= :today', { today })
      .andWhere('booking.status IN (:...statuses)', { 
        statuses: [BookingStatus.CONFIRMED, BookingStatus.ASSIGNED, BookingStatus.PENDING] 
      })
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.driver', 'driver')
      .leftJoinAndSelect('driver.vehicle', 'vehicle')
      .orderBy('booking.departureDate', 'ASC')
      .addOrderBy('booking.departureTime', 'ASC')
      .getMany();
  }

  async getRecentBookings(limit: number = 10): Promise<Booking[]> {
    return this.bookingsRepository.find({
      relations: ['customer', 'driver', 'driver.vehicle'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async updateBookingLocation(id: string, locationData: {
    pickupLocation?: string;
    pickupStop?: string;
    dropoffLocation?: string;
    dropoffStop?: string;
  }): Promise<Booking> {
    const booking = await this.findById(id);
    
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Can only update location for pending bookings');
    }

    // Recalculate fare if locations changed
    if (locationData.pickupLocation || locationData.dropoffLocation) {
      const newPickup = locationData.pickupLocation || booking.pickupLocation;
      const newDropoff = locationData.dropoffLocation || booking.dropoffLocation;
      
      const totalAmount = this.calculateFare(newPickup, newDropoff, booking.tripType);
      await this.bookingsRepository.update(id, { ...locationData, totalAmount });
    } else {
      await this.bookingsRepository.update(id, locationData);
    }

    return this.findById(id);
  }

  /**
   * Get bookings for a specific departure date
   */
  async getBookingsByDepartureDate(departureDate: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { departureDate },
      relations: ['customer', 'driver', 'driver.vehicle'],
      order: { departureTime: 'ASC' },
    });
  }
}