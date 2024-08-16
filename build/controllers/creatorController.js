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
exports.deleteEvent = exports.updateEvent = exports.test = exports.Analytics = exports.login_creator = exports.signup_creator = void 0;
const passport_1 = __importDefault(require("passport"));
const Events_1 = __importDefault(require("../models/Events"));
const qrcode_1 = require("../utils/qrcode");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup_creator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.status(400).json({
            message: "Signup failed, no user found",
        });
    }
    return res.status(201).json({
        message: "You have signed up successfully!",
        user,
        // id: user._id, // Access the user ID
    });
});
exports.signup_creator = signup_creator;
const login_creator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("creator-login", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                const error = new Error("Username or password is incorrect");
                return next(error);
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
exports.login_creator = login_creator;
const Analytics = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || !user) {
            return res.status(401).json({ message: "Unauthorized, Please Login" });
        }
        try {
            const events = yield Events_1.default.find({ creatorId: user._id });
            const analyticsData = yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
                const qrCode = yield (0, qrcode_1.generateQRCode)(`https://eventful-zeta.vercel.app/event/${event.id}`);
                const attender = event.attendees.length;
                return {
                    eventAttender: `There are ${attender} attendees for the event ${event.name}`,
                    qrCode,
                    numberOfTicketsBought: `${attender} tickets are bought for the ${event.name} event`,
                };
            })));
            return res.status(200).json(analyticsData);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }))(req, res, next);
};
exports.Analytics = Analytics;
const test = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("auth", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || !user) {
            return res.status(401).json({
                message: "Unauthorized, Please Log in",
            });
        }
        try {
            const events = yield Events_1.default.find({ creatorId: user.id });
            if (events.length === 0) {
                return res.status(404).json({
                    message: "No events found for this user",
                });
            }
            const eventDetails = yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
                const qrCode = yield (0, qrcode_1.generateQRCode)(`https://eventful-zeta.vercel.app/events-detail/${event.id}`);
                const attenderCount = event.attendees.length;
                return {
                    eventName: event.name,
                    eventAttender: `There are ${attenderCount} attendees for the event ${event.name}`,
                    numberOfTicketsBought: `${attenderCount} tickets are bought for the ${event.name} event`,
                    qrCode,
                };
            })));
            res.status(200).json(eventDetails);
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }))(req, res, next);
});
exports.test = test;
const updateEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("jwt", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login",
                });
            }
            const { id } = req.params;
            const { name, description, date, status, price } = req.body;
            // Find the event by ID
            let event = yield Events_1.default.findById(id);
            if (!event) {
                return res.status(404).json({
                    message: "Event not found.",
                });
            }
            // Check if the user is the creator of the event
            if (event.creatorId.toString() !== user._id.toString()) {
                return res.status(403).json({
                    message: "You are not authorized to update this event.",
                });
            }
            // Check if the new event date is in the future
            if (date) {
                const eventDate = new Date(date);
                const todayDate = new Date();
                if (eventDate < todayDate) {
                    return res.status(400).json({
                        message: "Event date cannot be in the past. Please select a valid date.",
                    });
                }
                event.date = eventDate;
            }
            // Update other fields
            if (name)
                event.name = name;
            if (description)
                event.description = description;
            if (status)
                event.status = status;
            if (price)
                event.price = price;
            // Save the updated event
            const updatedEvent = yield event.save();
            res.status(200).json({
                message: "Event updated successfully!",
                data: updatedEvent,
            });
            return next();
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }))(req, res, next);
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("jwt", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login",
                });
            }
            const { id } = req.params;
            // Find the event by ID
            const event = yield Events_1.default.findById(id);
            if (!event) {
                return res.status(404).json({
                    message: "Event not found.",
                });
            }
            // Check if the user is the creator of the event
            if (event.creatorId.toString() !== user._id.toString()) {
                return res.status(403).json({
                    message: "You are not authorized to delete this event.",
                });
            }
            // Delete the event
            yield Events_1.default.findByIdAndDelete(id);
            res.status(200).json({
                message: "Event deleted successfully!",
            });
            return next();
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }))(req, res, next);
});
exports.deleteEvent = deleteEvent;
