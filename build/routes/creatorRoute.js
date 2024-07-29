"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const creatorController_1 = require("../controllers/creatorController");
const passport_1 = __importDefault(require("passport"));
const creatorRoute = (0, express_1.Router)();
creatorRoute.get("/analytic", creatorController_1.Analytics);
creatorRoute.get("/", creatorController_1.test);
creatorRoute.post("/login", creatorController_1.login_creator);
creatorRoute.post("/signup", passport_1.default.authenticate("creator-signup", {
    session: false,
}), creatorController_1.signup_creator);
exports.default = creatorRoute;
