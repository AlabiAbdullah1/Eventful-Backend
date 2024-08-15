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
const node_cron_1 = __importDefault(require("node-cron"));
const email_1 = __importDefault(require("../services/email"));
const Events_1 = __importDefault(require("../models/Events"));
const cronScheduler = () => {
    node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Running daily reminder check...");
        try {
            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split("T")[0];
            // Find events with reminders set for today
            const events = yield Events_1.default.find({
                "reminders.date": { $eq: today },
            }).exec();
            // Process each event
            for (const event of events) {
                for (const reminder of event.reminders) {
                    if (reminder.date.toISOString().split("T")[0] === today) {
                        // Send email for each reminder
                        yield (0, email_1.default)(reminder.email, event);
                    }
                }
            }
        }
        catch (error) {
            console.error("Error in cron job:", error);
        }
    }));
};
exports.default = cronScheduler;
