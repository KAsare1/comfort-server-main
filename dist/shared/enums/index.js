"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.VehicleStatus = exports.DriverStatus = exports.PaymentMethod = exports.PaymentStatus = exports.TripType = exports.BookingStatus = void 0;
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["ASSIGNED"] = "assigned";
    BookingStatus["EN_ROUTE"] = "en_route";
    BookingStatus["ARRIVED"] = "arrived";
    BookingStatus["IN_PROGRESS"] = "in_progress";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["CANCELLED"] = "cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var TripType;
(function (TripType) {
    TripType["ONE_WAY"] = "one-way";
    TripType["ROUND_TRIP"] = "round-trip";
})(TripType || (exports.TripType = TripType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PROCESSING"] = "processing";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["MOMO"] = "momo";
    PaymentMethod["VISA"] = "visa";
    PaymentMethod["MASTERCARD"] = "mastercard";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["OFFLINE"] = "offline";
    DriverStatus["AVAILABLE"] = "available";
    DriverStatus["BUSY"] = "busy";
    DriverStatus["ON_BREAK"] = "on_break";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["ACTIVE"] = "active";
    VehicleStatus["MAINTENANCE"] = "maintenance";
    VehicleStatus["INACTIVE"] = "inactive";
})(VehicleStatus || (exports.VehicleStatus = VehicleStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "customer";
    UserRole["DRIVER"] = "driver";
    UserRole["ADMIN"] = "admin";
    UserRole["SUPER_ADMIN"] = "super_admin";
})(UserRole || (exports.UserRole = UserRole = {}));
//# sourceMappingURL=index.js.map