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
exports.get_Event_Attender = exports.attendee_post = exports.getEvent = exports.getEvents = exports.createEvent = void 0;
const passport_1 = __importDefault(require("passport"));
const Events_1 = __importDefault(require("../models/Events"));
const qrcode_1 = require("../utils/qrcode");
const user_1 = __importDefault(require("../models/user"));
const cronJob_1 = require("../middleware/cronJob");
const axios_1 = __importDefault(require("axios"));
const createEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("auth", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login in",
                });
            }
            const { name, description, date, status } = req.body;
            const creatorId = user._id;
            const creatorName = user.name;
            const todayDate = new Date();
            const event = yield Events_1.default.create({
                name,
                description,
                date: new Date(date),
                creatorId,
                creatorName,
                status,
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
    passport_1.default.authenticate("auth", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login in",
                });
            }
            const events = yield Events_1.default.find();
            const reminder = (0, cronJob_1.cronJOb)(req, res, next);
            res.status(200).json({
                // data: events,
                reminder,
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
    passport_1.default.authenticate("auth", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login in",
                });
            }
            const id = req.params.id;
            const events = yield Events_1.default.findById(id);
            const eventDate = events === null || events === void 0 ? void 0 : events.date;
            const todayDate = new Date();
            console.log(todayDate);
            if (!events) {
                console.log("Event not found.");
                return;
            }
            // Check if event date is less than today
            if ((events === null || events === void 0 ? void 0 : events.date) < todayDate) {
                // Update the event status to 'done'
                Events_1.default.findByIdAndUpdate(id, { status: "done" }, { new: true }).then((event) => {
                    res.status(200).json({
                        message: `The details for ${event === null || event === void 0 ? void 0 : event.name}`,
                        name: event === null || event === void 0 ? void 0 : event.name,
                        description: event === null || event === void 0 ? void 0 : event.description,
                        date: event === null || event === void 0 ? void 0 : event.date,
                        status: event === null || event === void 0 ? void 0 : event.status,
                    });
                    console.log("Event updated(done):", event, eventDate);
                });
            }
            else if ((events === null || events === void 0 ? void 0 : events.date) === todayDate) {
                Events_1.default.findByIdAndUpdate(id, { status: "active" }, { new: true }).then((event) => {
                    res.status(200).json({
                        message: `The details for ${event === null || event === void 0 ? void 0 : event.name}`,
                        name: event === null || event === void 0 ? void 0 : event.name,
                        description: event === null || event === void 0 ? void 0 : event.description,
                        date: event === null || event === void 0 ? void 0 : event.date,
                        status: event === null || event === void 0 ? void 0 : event.status,
                    });
                    console.log("Event updated(done):", event, eventDate);
                });
            }
            else {
                Events_1.default.findByIdAndUpdate(id, { status: "pending" }, { new: true }).then((event) => {
                    res.status(200).json({
                        message: `The details for ${event === null || event === void 0 ? void 0 : event.name}`,
                        name: event === null || event === void 0 ? void 0 : event.name,
                        description: event === null || event === void 0 ? void 0 : event.description,
                        date: event === null || event === void 0 ? void 0 : event.date,
                        status: event === null || event === void 0 ? void 0 : event.status,
                    });
                    console.log("Event updated(active):", event, eventDate);
                });
            }
            // return next();
        }
        catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }))(req, res, next);
});
exports.getEvent = getEvent;
//CREATE ATTENDEES FOR AN EVENT
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
const attendee_post = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("auth", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err || !user) {
                return res.status(401).json({
                    message: "Unauthorized, Please Login in",
                });
            }
            const event = yield Events_1.default.findById(req.params.id);
            if (!event)
                return res.status(404).json({ msg: "Event not found" });
            const users = yield user_1.default.findById(user.id).populate("eventAttended", "name description");
            const attendee = {
                id: user.id,
                email: user.email,
            };
            const eventReminder = event.date;
            const remind = eventReminder - 2 * 24 * 60 * 60 * 1000;
            const reminder = {
                userId: user.id,
                email: user.email,
                date: remind,
            };
            const events = {
                name: event.name,
                description: event.description,
                date: event.date,
                status: event.status,
            };
            const isAlreadyAttendee = event.attendees.some((att) => att.email.match(user.email));
            if (isAlreadyAttendee) {
                return res
                    .status(400)
                    .json({ msg: "User already registered for this event" });
            }
            // Initialize Paystack payment
            const price = event.price;
            const paymentInitResponse = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", {
                email: user.email,
                amount: price * 100, // Paystack expects the amount in kobo
            }, {
                headers: {
                    Authorization: `Bearer ${paystackSecretKey}`,
                },
            });
            if (paymentInitResponse.status !== 200) {
                return res.status(500).json({
                    message: "Payment initialization failed",
                });
            }
            const { authorization_url, reference } = paymentInitResponse.data.data;
            // Save payment reference to the event or user record for future verification
            attendee.paymentReference = reference;
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
                paymentUrl: authorization_url,
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
const get_Event_Attender = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // passport.authenticate(
    //   "auth",
    //   { session: false },
    //   async (err: any, user: any, info: any) => {
    //     if (err || !user) {
    //       return res.status(401).json({
    //         message: "Unauthorized, Please Login in",
    //       });
    //     }
    res.status(200).render("index");
    return next();
});
exports.get_Event_Attender = get_Event_Attender;
// )(req, res, next);
// };
// passport.authenticate("auth", async (err: Error, user: any, info: any) => {
//   try {
//     if (err || !user) {
//       return res.status(401).json({
//         message: "Unauthorized, Please Login in",
//       });
//     }
//   } catch (err) {}
// });
// };
