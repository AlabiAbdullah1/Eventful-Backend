import { Router } from "express";
import {
  eventsAttended,
  getAllUsers,
  getRegister,
  login_post,
  signup_post,
} from "../controllers/userController";
import passport from "passport";

const userRoute = Router();

userRoute.get("/login", getRegister);

userRoute.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  signup_post
);

userRoute.post("/login", login_post);

userRoute.get("/eventsAttended", eventsAttended);
userRoute.get("/", getAllUsers);

export default userRoute;
