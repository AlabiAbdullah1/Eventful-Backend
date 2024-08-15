import { Router } from "express";
import {
  attendee_post,
  createEvent,
  // get_Event_Attender,
  get_Event_By_Creator,
  getEvent,
  getEvents,
} from "../controllers/eventController";
import { verifyRole } from "../middleware/verifyMiddleware";

import { Request, Response } from "express";

const eventRoute = Router();

// eventRoute.post("/", verifyRole, createEvent);
eventRoute.post("/", createEvent);
eventRoute.get("/creator-events", get_Event_By_Creator);
eventRoute.post("/:eventId/join", attendee_post);
eventRoute.get("/", getEvents);
eventRoute.get("/:id", getEvent);

export default eventRoute;
