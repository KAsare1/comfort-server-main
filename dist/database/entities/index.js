"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const driver_entity_1 = require("./driver.entity");
const vehicle_entity_1 = require("./vehicle.entity");
const booking_entity_1 = require("./booking.entity");
const payment_entity_1 = require("./payment.entity");
const location_entity_1 = require("./location.entity");
const tracking_entity_1 = require("./tracking.entity");
const user_entity_1 = require("./user.entity");
exports.entities = [
    user_entity_1.User,
    driver_entity_1.Driver,
    vehicle_entity_1.Vehicle,
    booking_entity_1.Booking,
    payment_entity_1.Payment,
    location_entity_1.Location,
    tracking_entity_1.TrackingData,
];
//# sourceMappingURL=index.js.map