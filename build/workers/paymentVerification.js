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
exports.paymentQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const payStack_1 = require("../services/payStack"); // Adjust the import path as needed
const Events_1 = __importDefault(require("../models/Events"));
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const paymentQueue = new bull_1.default("payment-verification", REDIS_URL);
exports.paymentQueue = paymentQueue;
paymentQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = job.data;
    const transaction = yield (0, payStack_1.verifyTransaction)(reference);
    if (transaction.data.status === "success") {
        const { metadata, customer } = transaction.data;
        const eventId = metadata.eventId;
        const email = customer.email;
        // Update your database here
        const event = yield Events_1.default.findById(eventId);
        if (event) {
            event.attendees.push(email); // Assuming you store attendees by email
            yield event.save();
            //   const attendee = new Attendee({ eventId, email });
            //   await attendee.save();
        }
        else {
            throw new Error("Event not found");
        }
    }
    else {
        throw new Error("Payment verification failed");
    }
}));
