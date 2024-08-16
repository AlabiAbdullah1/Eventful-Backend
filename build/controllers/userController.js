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
exports.setReminder = exports.getAllUsers = exports.eventsAttended = exports.login_post = exports.signup_post = void 0;
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const qrcode_1 = require("../utils/qrcode");
const Events_1 = __importDefault(require("../models/Events"));
const signup_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({
        message: "Signup successful",
        user: req.body._id,
    });
});
exports.signup_post = signup_post;
const login_post = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("login", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                // Use the message from `info` if available, otherwise default to "incorrect_credentials"
                const message = info ? info.message : "incorrect_credentials";
                return next(message);
            }
            req.login(user, { session: false }, (error) => __awaiter(void 0, void 0, void 0, function* () {
                if (error)
                    return next(error);
                const body = { _id: user._id, email: user.email };
                const token = jsonwebtoken_1.default.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.json({ token, Id: user._id });
                // res.status(200).render("login");
            }));
        }
        catch (error) {
            return next(error);
        }
    }))(req, res, next);
});
exports.login_post = login_post;
const eventsAttended = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("jwt", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login in",
                });
            }
            const users = yield user_1.default.findById(user._id);
            const eventId = users === null || users === void 0 ? void 0 : users.eventAttended.map((event) => {
                return event.id;
            });
            const qrCode = yield (0, qrcode_1.generateQRCode)(`https://frontend-eventful.vercel.app/events-detail/${eventId}`);
            res.status(200).json({
                message: users === null || users === void 0 ? void 0 : users.eventAttended,
                qrCode,
            });
        }
        catch (err) {
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }))(req, res, next);
});
exports.eventsAttended = eventsAttended;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // passport.authenticate("auth", async (err: Error, user: any, info: any) => {
    try {
        //     if (err || !user) {
        //       res.status(401).json({
        //         message: "Unauthorized, Please Login in",
        //       });
        //     }
        const users = yield user_1.default.find();
        return res.status(200).json({
            users,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
        });
        // }
        // })(req, res, next);
    }
});
exports.getAllUsers = getAllUsers;
const setReminder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("jwt", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login",
                });
            }
            const eventId = req.params;
            const { date } = req.body;
            if (!eventId || !date) {
                return res.status(400).json({
                    message: "Event ID and date are required",
                });
            }
            // Find the event and update the reminders array
            const event = yield Events_1.default.findById(eventId);
            const events = yield Events_1.default.find;
            if (!event) {
                return res.status(404).json({
                    message: "Event not found",
                });
            }
            // Add or update the reminder
            const reminderIndex = event.reminders.findIndex((reminder) => reminder.userId.equals(user._id));
            if (reminderIndex > -1) {
                // Update existing reminder
                event.reminders[reminderIndex] = {
                    userId: user._id,
                    email: user.email,
                    date: new Date(date),
                };
            }
            else {
                // Add new reminder
                event.reminders.push({
                    userId: user._id,
                    email: user.email,
                    date: new Date(date),
                });
            }
            // Save the event
            yield event.save();
            res.status(200).json({
                message: "Reminder set successfully",
                event,
            });
        }
        catch (err) {
            console.error(err); // Log the error for debugging
            res.status(500).json({
                message: err.message,
                stack: err.stack,
            });
        }
    }))(req, res, next);
});
exports.setReminder = setReminder;
