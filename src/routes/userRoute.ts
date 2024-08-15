import { Router } from "express";
import {
  eventsAttended,
  getAllUsers,
  login_post,
  setReminder,
  signup_post,
} from "../controllers/userController";
import passport from "passport";

const userRoute = Router();

userRoute.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  signup_post
);

userRoute.post("/login", login_post);

userRoute.get("/eventsAttended", eventsAttended);
userRoute.get("/", getAllUsers);
userRoute.post("/set-reminder/:eventId", setReminder);

export default userRoute;
