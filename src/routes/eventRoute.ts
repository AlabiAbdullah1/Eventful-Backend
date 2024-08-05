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

eventRoute.post("/pay", async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// eventRoute.get("/verify/:reference", async (req: Request, res: Response) => {
//   const { reference } = req.params;

//   try {
//     await paymentQueue.add({ reference });
//     res.status(200).json({ message: "Payment verification in progress" });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });

eventRoute.post("/:eventId/join", attendee_post);
eventRoute.get("/", getEvents);
eventRoute.get("/:id", getEvent);

export default eventRoute;
