import { Request, Response, NextFunction } from "express";
import passport from "passport";
import Event from "../models/Events";
import { generateQRCode } from "../utils/qrcode";
import User from "../models/user";
import { cronJOb } from "../middleware/cronJob";
import axios from "axios";
import logger from "../logging/logger";

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", async (err: Error, user: any, info: any) => {
    try {
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized, Please Login in",
        });
      }

      const { name, description, date, status, price } = req.body;

      const creatorId = user._id;
      const creatorName = user.email;
      const todayDate: any = new Date();
      const event = await Event.create({
        name,
        description,
        date: new Date(date),
        creatorId,
        creatorName,
        status,
        price,
      });
      res.status(201).json({
        message: "Event created Successfully!",
        data: event,
      });
      return next();
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  })(req, res, next);
};

// GET ALL EVENTS:
export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", async (err: Error, user: any, info: any) => {
    try {
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized, Please Login in",
        });
      }

      const events = await Event.find();
      // const reminder = cronJOb(req, res, next);

      res.status(200).json({
        data: events,
        // reminder,
      });
      return next();
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  })(req, res, next);
};

// GET AN EVENT
export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (err: any, user: any, info: any) => {
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized, Please Login",
        });
      }

      try {
        const id = req.params.id;
        const events = await Event.findById(id);

        if (!events) {
          return res.status(404).json({
            message: "Event not found.",
          });
        }

        const todayDate = new Date();

        const updateStatus = (eventDate: Date) => {
          if (eventDate < todayDate) {
            return "done";
          } else if (eventDate.toDateString() === todayDate.toDateString()) {
            return "active";
          } else {
            return "pending";
          }
        };

        const updatedStatus = updateStatus(events.date);
        const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { status: updatedStatus },
          { new: true }
        );

        res.status(200).json({
          message: `The details for ${updatedEvent?.name}`,
          name: updatedEvent?.name,
          description: updatedEvent?.description,
          date: updatedEvent?.date,
          status: updatedEvent?.status,
          price: updatedEvent?.price,
        });
      } catch (error: any) {
        res.status(500).json({
          message: error.message,
        });
        logger.error(error);
      }
    }
  )(req, res, next);
};
//CREATE ATTENDEES FOR AN EVENT

export const attendee_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", async (err: Error, user: any, info: any) => {
    try {
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized, Please Login in",
        });
      }

      const eventId = req.params.eventId;
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ msg: "Event not found" });

      const users = await User.findById(user._id).populate(
        "eventAttended",
        "name description"
      );

      const attendee: any = {
        id: user._id,
        email: user.email,
      };

      const eventReminder: any = event.date;
      const remind = eventReminder - 2 * 24 * 60 * 60 * 1000;

      const reminder: any = {
        userId: user._id,
        email: user.email,
        date: remind,
      };

      const events: any = {
        id: event._id,
        name: event.name,
        description: event.description,
        date: event.date,
        status: event.status,
        price: event.price,
      };

      const isAlreadyAttendee = event.attendees.some((att) =>
        att.email.match(user.email)
      );
      if (isAlreadyAttendee) {
        return res
          .status(400)
          .json({ msg: "User already registered for this event" });
      }

      // Update event and user records
      event.attendees.push(attendee);
      event.reminders.push(reminder);
      users?.eventAttended.push(events);
      await event.save();
      await users?.save();

      // Generate QR code
      const qrCode = await generateQRCode(
        `http://localhost:8000/event/${req.params.id}`
      );

      res.json({
        event,
        qrCode,
      });
      return next();
    } catch (err: any) {
      return res.status(500).json({
        message: err.message,
      });
    }
  })(req, res, next);
};

// THIS ONE NA TESTING!!
export const get_Event_By_Creator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", async (err: Error, user: any, info: any) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Unauthorized, Please Log in",
      });
    }

    try {
      const events = await Event.find({ creatorId: user._id });
      if (events.length === 0) {
        return res.status(404).json({
          message: "No events found for this user",
        });
      }

      return res.status(200).json({
        data: events,
      });
    } catch (error) {}
  })(req, res, next);
};
