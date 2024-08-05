import request from "supertest";
import app from "../app"; // assuming your Express app is exported from app.ts or similar
import passport from "passport";
import jwt from "jsonwebtoken";
import Event from "../models/Events";
import { generateQRCode } from "../utils/qrcode";

// Mock dependencies
jest.mock("passport");
jest.mock("jsonwebtoken");
jest.mock("../models/Events");
jest.mock("../utils/qrcode");

describe("Controller Tests", () => {
  describe("signup_creator", () => {
    it("should return 201 if user signs up successfully", async () => {
      const mockUser = { _id: "1", email: "test@example.com" };
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy, options, callback) => {
          return (req: any, res: any, next: any) => callback(null, mockUser);
        }
      );

      const res = await request(app)
        .post("/signup_creator")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("You have signed up successfully!");
      expect(res.body.user).toEqual(mockUser);
    });

    it("should return 400 if no user is found", async () => {
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy, options, callback) => {
          return (req: any, res: any, next: any) => callback(null, null);
        }
      );

      const res = await request(app)
        .post("/signup_creator")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Signup failed, no user found");
    });
  });

  describe("login_creator", () => {
    it("should return a token and user id if login is successful", async () => {
      const mockUser = { _id: "1", email: "test@example.com" };
      const mockToken = "mockToken";
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy, options, callback) => {
          return (req: any, res: any, next: any) => callback(null, mockUser);
        }
      );
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const res = await request(app)
        .post("/login_creator")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe(mockToken);
      expect(res.body.Id).toBe(mockUser._id);
    });

    it("should return 401 if login fails", async () => {
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy, options, callback) => {
          return (req: any, res: any, next: any) => callback(null, null);
        }
      );

      const res = await request(app)
        .post("/login_creator")
        .send({ email: "test@example.com", password: "password" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Username or password is incorrect");
    });
  });

  describe("Analytics", () => {
    it("should return analytics data for the user", async () => {
      const mockUser = { _id: "1", email: "test@example.com" };
      const mockEvent = { id: "1", name: "Event 1", attendees: [] };
      const mockQRCode = "mockQRCode";
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy, options, callback) => {
          return (req: any, res: any, next: any) => callback(null, mockUser);
        }
      );
      (Event.find as jest.Mock).mockResolvedValue([mockEvent]);
      (generateQRCode as jest.Mock).mockResolvedValue(mockQRCode);

      const res = await request(app)
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
    });

    it("should return 401 if unauthorized", async () => {
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy, options, callback) => {
          return (req: any, res: any, next: any) => callback(null, null);
        }
      );

      const res = await request(app)
        .get("/analytics")
        .set("Authorization", "Bearer mockToken");

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorized, Please Login");
    });
  });
});
