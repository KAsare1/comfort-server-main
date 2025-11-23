export declare enum AssignmentStrategy {
    NEAREST = "nearest",
    MANUAL = "manual",
    ROUND_ROBIN = "round_robin",
    RATING_BASED = "rating_based"
}
export declare class DriverAssignmentDto {
    bookingId: string;
    strategy: AssignmentStrategy;
    driverId?: string;
}
