import { Router } from "express";
import {
  Analytics,
  login_creator,
  signup_creator,
  test,
} from "../controllers/creatorController";
import passport from "passport";

const creatorRoute = Router();

creatorRoute.get("/analytic", Analytics);
creatorRoute.get("/", test);
creatorRoute.post("/login", login_creator);

creatorRoute.post(
  "/signup",
  passport.authenticate("creator-signup", {
    session: false,
  }),
  signup_creator
);

export default creatorRoute;
