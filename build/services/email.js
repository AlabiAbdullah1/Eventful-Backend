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
// emailService.js
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
// Configure your email transport
const transporter = nodemailer_1.default.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
/**
 * Send a reminder email to a user
 * @param {any} email - Recipient email address
 * @param {object} event - Event details
 */
const sendReminderEmail = (email, event) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Reminder for Event: ${event.name}`,
        text: `Hi there,

This is a reminder for the event "${event.name}" happening on ${new Date(event.date).toLocaleDateString()}.

Event Description: ${event.description}

Best regards,
Your Event Team`,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${email}`);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.default = sendReminderEmail;
