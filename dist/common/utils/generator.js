"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generators = void 0;
const uuid_1 = require("uuid");
class Generators {
    static generateBookingReference() {
        const prefix = 'CMF';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
    static generatePaymentReference() {
        const prefix = 'PAY';
        const uuid = (0, uuid_1.v4)().replace(/-/g, '').substr(0, 8).toUpperCase();
        return `${prefix}-${uuid}`;
    }
    static generateDriverCode() {
        const prefix = 'DRV';
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `${prefix}-${random}`;
    }
}
exports.Generators = Generators;
//# sourceMappingURL=generator.js.map