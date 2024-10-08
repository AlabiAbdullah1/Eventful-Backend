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
exports.verifyRole = void 0;
const passport_1 = __importDefault(require("passport"));
const verifyRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("auth", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if ((user === null || user === void 0 ? void 0 : user.role) !== "creator")
            res.status(403).json({
                message: "You are not a creator, this route is unauthorized for you!",
            });
        else {
            next();
        }
    }))(req, res, next);
});
exports.verifyRole = verifyRole;
