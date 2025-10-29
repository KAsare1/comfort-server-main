export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    ASSIGNED = "assigned",
    EN_ROUTE = "en_route",
    ARRIVED = "arrived",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum TripType {
    ONE_WAY = "one-way",
    ROUND_TRIP = "round-trip"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    MOMO = "momo",
    VISA = "visa",
    MASTERCARD = "mastercard"
}
export declare enum DriverStatus {
    OFFLINE = "offline",
    AVAILABLE = "available",
    BUSY = "busy",
    ON_BREAK = "on_break"
}
export declare enum VehicleStatus {
    ACTIVE = "active",
    MAINTENANCE = "maintenance",
    INACTIVE = "inactive"
}
export declare enum UserRole {
    CUSTOMER = "customer",
    DRIVER = "driver",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
