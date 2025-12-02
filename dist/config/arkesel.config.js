"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArkeselConfig = void 0;
const getArkeselConfig = (configService) => {
    const apiKey = configService.get('ARKESEL_API_KEY');
    if (!apiKey) {
        throw new Error('Missing required environment variable: ARKESEL_API_KEY');
    }
    return {
        apiKey,
        senderId: configService.get('ARKESEL_SENDER_ID', 'COMFORT'),
        baseUrl: 'https://sms.arkesel.com/api/v2',
    };
};
exports.getArkeselConfig = getArkeselConfig;
//# sourceMappingURL=arkesel.config.js.map