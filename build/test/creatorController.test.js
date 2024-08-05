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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index")); // assuming your Express app is exported from app.ts or similar
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Events_1 = __importDefault(require("../models/Events"));
const qrcode_1 = require("../utils/qrcode");
// Mock dependencies
jest.mock("passport");
jest.mock("jsonwebtoken");
jest.mock("../models/Events");
jest.mock("../utils/qrcode");
describe("Controller Tests", () => {
    describe("signup_creator", () => {
        it("should return 201 if user signs up successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: "1", email: "test@example.com" };
            passport_1.default.authenticate.mockImplementation((strategy, options, callback) => {
                return (req, res, next) => callback(null, mockUser);
            });
            const res = yield (0, supertest_1.default)(index_1.default)
                .post("/signup_creator")
                .send({ email: "test@example.com", password: "password" });
            expect(res.status).toBe(201);
            expect(res.body.message).toBe("You have signed up successfully!");
            expect(res.body.user).toEqual(mockUser);
        }));
        it("should return 400 if no user is found", () => __awaiter(void 0, void 0, void 0, function* () {
            passport_1.default.authenticate.mockImplementation((strategy, options, callback) => {
                return (req, res, next) => callback(null, null);
            });
            const res = yield (0, supertest_1.default)(index_1.default)
                .post("/signup_creator")
                .send({ email: "test@example.com", password: "password" });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Signup failed, no user found");
        }));
    });
    describe("login_creator", () => {
        it("should return a token and user id if login is successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: "1", email: "test@example.com" };
            const mockToken = "mockToken";
            passport_1.default.authenticate.mockImplementation((strategy, options, callback) => {
                return (req, res, next) => callback(null, mockUser);
            });
            jsonwebtoken_1.default.sign.mockReturnValue(mockToken);
            const res = yield (0, supertest_1.default)(index_1.default)
                .post("/login_creator")
                .send({ email: "test@example.com", password: "password" });
            expect(res.status).toBe(200);
            expect(res.body.token).toBe(mockToken);
            expect(res.body.Id).toBe(mockUser._id);
        }));
        it("should return 401 if login fails", () => __awaiter(void 0, void 0, void 0, function* () {
            passport_1.default.authenticate.mockImplementation((strategy, options, callback) => {
                return (req, res, next) => callback(null, null);
            });
            const res = yield (0, supertest_1.default)(index_1.default)
                .post("/login_creator")
                .send({ email: "test@example.com", password: "password" });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Username or password is incorrect");
        }));
    });
    describe("Analytics", () => {
        it("should return analytics data for the user", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: "1", email: "test@example.com" };
            const mockEvent = { id: "1", name: "Event 1", attendees: [] };
            const mockQRCode = "mockQRCode";
            passport_1.default.authenticate.mockImplementation((strategy, options, callback) => {
                return (req, res, next) => callback(null, mockUser);
            });
            Events_1.default.find.mockResolvedValue([mockEvent]);
            qrcode_1.generateQRCode.mockResolvedValue(mockQRCode);
            const res = yield (0, supertest_1.default)(index_1.default)
                .get("/analytics")
                .set("Authorization", "Bearer mockToken");
            expect(res.status).toBe(200);
            expect(res.body).toEqual([
                {
                    eventAttender: `There are 0 attendees for the event ${mockEvent.name}`,
                    qrCode: mockQRCode,
                    numberOfTicketsBought: `0 tickets are bought for the ${mockEvent.name} event`,
                },
            ]);
        }));
        it("should return 401 if unauthorized", () => __awaiter(void 0, void 0, void 0, function* () {
            passport_1.default.authenticate.mockImplementation((strategy, options, callback) => {
                return (req, res, next) => callback(null, null);
            });
            const res = yield (0, supertest_1.default)(index_1.default)
                .get("/analytics")
                .set("Authorization", "Bearer mockToken");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized, Please Login");
        }));
    });
});
