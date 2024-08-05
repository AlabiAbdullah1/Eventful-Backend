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
exports.get_Event_By_Creator = exports.attendee_post = exports.getEvent = exports.getEvents = exports.createEvent = void 0;
const passport_1 = __importDefault(require("passport"));
const Events_1 = __importDefault(require("../models/Events"));
const qrcode_1 = require("../utils/qrcode");
const user_1 = __importDefault(require("../models/user"));
const logger_1 = __importDefault(require("../logging/logger"));
const createEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("jwt", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login in",
                });
            }
            const { name, description, date, status, price } = req.body;
            const creatorId = user._id;
            const creatorName = user.email;
            const todayDate = new Date();
            const event = yield Events_1.default.create({
                name,
                description,
                date: new Date(date),
                creatorId,
                creatorName,
                status,
                price,
            });
            res.status(201).json({
                message: "Event created Successfully!",
                data: event,
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
exports.createEvent = createEvent;
// GET ALL EVENTS:
const getEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("jwt", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login in",
                });
            }
            const events = yield Events_1.default.find();
            // const reminder = cronJOb(req, res, next);
            res.status(200).json({
                data: events,
                // reminder,
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
exports.getEvents = getEvents;
// GET AN EVENT
const getEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || !user) {
            return res.status(401).json({
                message: "Unauthorized, Please Login",
            });
        }
        try {
            const id = req.params.id;
            const events = yield Events_1.default.findById(id);
            if (!events) {
                return res.status(404).json({
                    message: "Event not found.",
                });
            }
            const todayDate = new Date();
            const updateStatus = (eventDate) => {
                if (eventDate < todayDate) {
                    return "done";
                }
                else if (eventDate.toDateString() === todayDate.toDateString()) {
                    return "active";
                }
                else {
                    return "pending";
                }
            };
            const updatedStatus = updateStatus(events.date);
            const updatedEvent = yield Events_1.default.findByIdAndUpdate(id, { status: updatedStatus }, { new: true });
            res.status(200).json({
                message: `The details for ${updatedEvent === null || updatedEvent === void 0 ? void 0 : updatedEvent.name}`,
                name: updatedEvent === null || updatedEvent === void 0 ? void 0 : updatedEvent.name,
                description: updatedEvent === null || updatedEvent === void 0 ? void 0 : updatedEvent.description,
                date: updatedEvent === null || updatedEvent === void 0 ? void 0 : updatedEvent.date,
                status: updatedEvent === null || updatedEvent === void 0 ? void 0 : updatedEvent.status,
                price: updatedEvent === null || updatedEvent === void 0 ? void 0 : updatedEvent.price,
            });
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
            logger_1.default.error(error);
        }
    }))(req, res, next);
});
exports.getEvent = getEvent;
//CREATE ATTENDEES FOR AN EVENT
const attendee_post = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("jwt", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login in",
                });
            }
            const eventId = req.params.eventId;
            const event = yield Events_1.default.findById(eventId);
            if (!event)
                return res.status(404).json({ msg: "Event not found" });
            const users = yield user_1.default.findById(user._id).populate("eventAttended", "name description");
            const attendee = {
                id: user._id,
                email: user.email,
            };
            const eventReminder = event.date;
            const remind = eventReminder - 2 * 24 * 60 * 60 * 1000;
            const reminder = {
                userId: user._id,
                email: user.email,
                date: remind,
            };
            const events = {
                id: event._id,
                name: event.name,
                description: event.description,
                date: event.date,
                status: event.status,
                price: event.price,
            };
            const isAlreadyAttendee = event.attendees.some((att) => att.email.match(user.email));
            if (isAlreadyAttendee) {
                return res
                    .status(400)
                    .json({ msg: "User already registered for this event" });
            }
            // Update event and user records
            event.attendees.push(attendee);
            event.reminders.push(reminder);
            users === null || users === void 0 ? void 0 : users.eventAttended.push(events);
            yield event.save();
            yield (users === null || users === void 0 ? void 0 : users.save());
            // Generate QR code
            const qrCode = yield (0, qrcode_1.generateQRCode)(`http://localhost:8000/event/${req.params.id}`);
            res.json({
                event,
                qrCode,
            });
            return next();
        }
        catch (err) {
            return res.status(500).json({
                message: err.message,
            });
        }
    }))(req, res, next);
});
exports.attendee_post = attendee_post;
// THIS ONE NA TESTING!!
const get_Event_By_Creator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("jwt", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || !user) {
            return res.status(401).json({
                message: "Unauthorized, Please Log in",
            });
        }
        try {
            const events = yield Events_1.default.find({ creatorId: user._id });
            if (events.length === 0) {
                return res.status(404).json({
                    message: "No events found for this user",
                });
            }
            return res.status(200).json({
                data: events,
            });
        }
        catch (error) { }
    }))(req, res, next);
});
exports.get_Event_By_Creator = get_Event_By_Creator;
