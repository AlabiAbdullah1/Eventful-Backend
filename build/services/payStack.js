"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTransaction = exports.initializeTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const PAYSTACK_SECRET_KEY = "your-paystack-secret-key"; // Use environment variable for security
const initializeTransaction = (email, amount, eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://api.paystack.co/transaction/initialize";
    const headers = {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    };
    const response = yield axios_1.default.post(url, {
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        metadata: { eventId },
    }, { headers });
    return response.data;
});
exports.initializeTransaction = initializeTransaction;
const verifyTransaction = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const headers = {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
    };
    const response = yield axios_1.default.get(url, { headers });
    return response.data;
});
exports.verifyTransaction = verifyTransaction;
