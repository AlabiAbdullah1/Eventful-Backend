"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const passport_1 = __importDefault(require("passport"));
const authenticate = (req, res, next) => {
    passport_1.default.authenticate("auth", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        req.user = user;
        return next();
    })(req, res, next);
};
exports.authenticate = authenticate;
