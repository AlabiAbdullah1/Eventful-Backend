"use strict";
// import { expect } from "chai";
// import sinon from "sinon";
// import supertest from "supertest";
// import app from "../index"; // Adjust the path to your app file
// import User from "../models/user";
// import passport from "passport";
// import jwt from "jsonwebtoken";
// describe("Auth Controller", () => {
//   describe("POST /signup", () => {
//     it("should return a success message and user ID", async () => {
//       const response = await supertest(app)
//         .post("/signup")
//         .send({ _id: "user-id" });
//       expect(response.status).to.equal(200);
//       expect(response.body).to.have.property("message", "Signup successful");
//       expect(response.body).to.have.property("user", "user-id");
//     });
//   });
//   describe("POST /login", () => {
//     it("should return a token and user ID if login is successful", async () => {
//       const user = { _id: "user-id", email: "test@example.com" };
//       const jwtSecret = process.env.JWT_SECRET || "secret";
//       sinon.stub(passport, "authenticate").callsFake((strategy, callback) => {
//         return (req, res, next) => {
//           callback(null, user, null);
//         };
//       });
//       const response = await supertest(app)
//         .post("/login")
//         .send({ email: "test@example.com", password: "password" });
//       expect(response.status).to.equal(200);
//       expect(response.body).to.have.property("token");
//       expect(response.body).to.have.property("Id", "user-id");
//       const decoded = jwt.verify(response.body.token, jwtSecret);
//       expect(decoded).to.have.property("user").that.includes({ _id: "user-id", email: "test@example.com" });
//       (passport.authenticate as sinon.SinonStub).restore();
//     });
//   });
//   describe("GET /events-attended", () => {
//     it("should return events attended by the user", async () => {
//       const user = { _id: "user-id", eventAttended: ["event1", "event2"] };
//       sinon.stub(passport, "authenticate").callsFake((strategy, callback) => {
//         return (req, res, next) => {
//           callback(null, user, null);
//         };
//       });
//       sinon.stub(User, "findById").resolves(user);
//       const response = await supertest(app).get("/events-attended");
//       expect(response.status).to.equal(200);
//       expect(response.body).to.have.property("message").that.includes.members(["event1", "event2"]);
//       (passport.authenticate as sinon.SinonStub).restore();
//       (User.findById as sinon.SinonStub).restore();
//     });
//   });
//   describe("GET /all-users", () => {
//     it("should return all users", async () => {
//       const users = [{ _id: "user-id1" }, { _id: "user-id2" }];
//       sinon.stub(passport, "authenticate").callsFake((strategy, callback) => {
//         return (req, res, next) => {
//           callback(null, {}, null);
//         };
//       });
//       sinon.stub(User, "find").resolves(users);
//       const response = await supertest(app).get("/all-users");
//       expect(response.status).to.equal(200);
//       expect(response.body).to.have.property("message").that.includes.members(users);
//       (passport.authenticate as sinon.SinonStub).restore();
//       (User.find as sinon.SinonStub).restore();
//     });
//   });
//   describe("POST /set-reminder", () => {
//     it("should return a success message after setting a reminder", async () => {
//       const user = { _id: "user-id", eventAttended: ["event1", "event2"] };
//       sinon.stub(passport, "authenticate").callsFake((strategy, callback) => {
//         return (req, res, next) => {
//           callback(null, user, null);
//         };
//       });
//       sinon.stub(User, "findById").resolves(user);
//       const response = await supertest(app)
//         .post("/set-reminder")
//         .send({ date: "2024-12-31" });
//       expect(response.status).to.equal(200);
//       expect(response.body).to.have.property("message").that.includes.members(["event1", "event2"]);
//       (passport.authenticate as sinon.SinonStub).restore();
//       (User.findById as sinon.SinonStub).restore();
//     });
//   });
// });
