import { Router } from "express";
import {
  Analytics,
  deleteEvent,
  login_creator,
  signup_creator,
  test,
  updateEvent,
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

creatorRoute.put("/:id", updateEvent);
creatorRoute.delete("/:id", deleteEvent);

export default creatorRoute;
