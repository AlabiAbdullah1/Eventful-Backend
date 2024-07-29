"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI;
function connectToDB() {
    mongoose_1.default.connect(MONGODB_URI);
    mongoose_1.default.connection.on("connected", () => {
        console.log("DB connected Successfully!");
    });
    mongoose_1.default.connection.on("error", () => {
        console.log("An error occured!");
    });
}
exports.default = connectToDB;
