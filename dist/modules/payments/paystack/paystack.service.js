"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const paystack_config_1 = require("../../../config/paystack.config");
let PaystackService = class PaystackService {
    configService;
    httpClient;
    config;
    constructor(configService) {
        this.configService = configService;
        this.config = (0, paystack_config_1.getPaystackConfig)(this.configService);
        this.httpClient = axios_1.default.create({
            baseURL: this.config.baseUrl,
            headers: {
                Authorization: `Bearer ${this.config.secretKey}`,
                'Content-Type': 'application/json',
            },
        });
    }
    async initializePayment(email, amount, reference, callbackUrl, metadata) {
        try {
            const response = await this.httpClient.post('/transaction/initialize', {
                email,
                amount: amount * 100,
                reference,
                callback_url: callbackUrl,
                metadata,
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(`Paystack initialization failed: ${error.response?.data?.message || error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async verifyPayment(reference) {
        try {
            const response = await this.httpClient.get(`/transaction/verify/${reference}`);
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(`Paystack verification failed: ${error.response?.data?.message || error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllTransactions(page = 1, perPage = 50, status, from, to) {
        try {
            const params = {
                page,
                perPage,
                ...(status && { status }),
                ...(from && { from }),
                ...(to && { to }),
            };
            const response = await this.httpClient.get('/transaction', { params });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to fetch transactions: ${error.response?.data?.message || error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async refundTransaction(transactionId, amount) {
        try {
            const response = await this.httpClient.post('/refund', {
                transaction: transactionId,
                ...(amount && { amount: amount * 100 }),
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException(`Refund failed: ${error.response?.data?.message || error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PaystackService = PaystackService;
exports.PaystackService = PaystackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaystackService);
//# sourceMappingURL=paystack.service.js.map