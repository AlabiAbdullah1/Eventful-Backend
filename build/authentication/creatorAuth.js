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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const user_1 = __importDefault(require("../models/user"));
const creator_1 = __importDefault(require("../models/creator"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: JWT_SECRET,
    // jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token') // Use this if we are using query
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(), // Use this if you are using Bearer token
}, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return done(null, token.user);
    }
    catch (error) {
        done(error);
    }
})));
// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.
passport_1.default.use("creator-signup", new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.findOne({ email });
        const creator = yield creator_1.default.findOne({ email });
        if (users || creator) {
            return done(null, false, {
                message: "Email already in use",
            });
            //   return console.log("Email already in use");
        }
        const { name } = req.body;
        const user = yield creator_1.default.create({ name, email, password });
        return done(null, user);
    }
    catch (error) {
        console.log(error.message);
        done(error);
    }
})));
// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport_1.default.use("creator-login", new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield creator_1.default.findOne({ email });
        if (!user) {
            return done(null, false, { message: "User not found" });
        }
        const validate = yield user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: "Wrong Password" });
        }
        return done(null, user, { message: "Logged in Successfully" });
    }
    catch (error) {
        return done(error);
    }
})));
exports.default = passport_1.default;
