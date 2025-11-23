"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaystackConfig = void 0;
const getPaystackConfig = (configService) => {
    const secretKey = configService.get('PAYSTACK_SECRET_KEY');
    const publicKey = configService.get('PAYSTACK_PUBLIC_KEY');
    if (!secretKey) {
        throw new Error('Missing PAYSTACK_SECRET_KEY in environment configuration');
    }
    if (!publicKey) {
        throw new Error('Missing PAYSTACK_PUBLIC_KEY in environment configuration');
    }
    return {
        secretKey,
        publicKey,
        baseUrl: 'https://api.paystack.co',
    };
};
exports.getPaystackConfig = getPaystackConfig;
//# sourceMappingURL=paystack.config.js.map