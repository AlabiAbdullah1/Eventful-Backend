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
exports.verifyPayment = exports.initializePayment = void 0;
const payStack_1 = __importDefault(require("../services/payStack"));
require("dotenv").config();
const initializePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, amount } = req.body;
    try {
        const response = yield payStack_1.default.post("/transaction/initialize", {
            email,
            amount: amount * 100, // Convert amount to kobo
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.initializePayment = initializePayment;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = req.params;
    try {
        const response = yield payStack_1.default.get(`/transaction/verify/${reference}`);
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.verifyPayment = verifyPayment;
