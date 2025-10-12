export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ASSIGNED = 'assigned',
  EN_ROUTE = 'en_route',
  ARRIVED = 'arrived',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TripType {
  ONE_WAY = 'one-way',
  ROUND_TRIP = 'round-trip'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  MOMO = 'momo',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
}

export enum DriverStatus {
  OFFLINE = 'offline',
  AVAILABLE = 'available',
  BUSY = 'busy',
  ON_BREAK = 'on_break',
}

export enum VehicleStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive',
}

export enum UserRole {
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}
