"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const passport_1 = __importDefault(require("passport"));
const userRoute = (0, express_1.Router)();
userRoute.post("/signup", passport_1.default.authenticate("signup", { session: false }), userController_1.signup_post);
userRoute.post("/login", userController_1.login_post);
userRoute.get("/eventsAttended", userController_1.eventsAttended);
userRoute.get("/", userController_1.getAllUsers);
userRoute.post("/set-reminder/:eventId", userController_1.setReminder);
exports.default = userRoute;
