import passport from "passport";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { generateQRCode } from "../utils/qrcode";
import Event from "../models/Events";

export const signup_post = async (req: Request, res: Response) => {
  return res.json({
    message: "Signup successful",
    user: req.body._id,
  });
};

export const login_post = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("login", async (err: Error, user: any, info: any) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        // Use the message from `info` if available, otherwise default to "incorrect_credentials"
        const message = info ? info.message : "incorrect_credentials";
        return next(message);
      }

      req.login(user, { session: false }, async (error: Error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign(
          { user: body },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );

        return res.json({ token, Id: user._id });
        // res.status(200).render("login");
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

export const eventsAttended = async (
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

      const users = await User.findById(user._id);

      const eventId = users?.eventAttended.map((event) => {
        return event.id;
      });

      const qrCode = await generateQRCode(
        `https://eventful-zeta.vercel.app/events/${eventId}`
      );

      res.status(200).json({
        message: users?.eventAttended,
        qrCode,
      });
    } catch (err: any) {
      res.status(500).json({
        message: err.message,
        stack: err.stack,
      });
    }
  })(req, res, next);
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // passport.authenticate("auth", async (err: Error, user: any, info: any) => {
  try {
    //     if (err || !user) {
    //       res.status(401).json({
    //         message: "Unauthorized, Please Login in",
    //       });
    //     }

    const users = await User.find();
    return res.status(200).json({
      users,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
    // }
    // })(req, res, next);
  }
};
export const setReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", async (err: Error, user: any, info: any) => {
    try {
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized, Please Login",
        });
      }

      const eventId: any = req.params;
      const { date } = req.body;

      if (!eventId || !date) {
        return res.status(400).json({
          message: "Event ID and date are required",
        });
      }

      // Find the event and update the reminders array
      const event = await Event.findById(eventId);

      const events = await Event.find;

      if (!event) {
        return res.status(404).json({
          message: "Event not found",
        });
      }

      // Add or update the reminder
      const reminderIndex = event.reminders.findIndex((reminder: any) =>
        reminder.userId.equals(user._id)
      );

      if (reminderIndex > -1) {
        // Update existing reminder
        event.reminders[reminderIndex] = {
          userId: user._id,
          email: user.email,
          date: new Date(date),
        };
      } else {
        // Add new reminder
        event.reminders.push({
          userId: user._id,
          email: user.email,
          date: new Date(date),
        });
      }

      // Save the event
      await event.save();

      res.status(200).json({
        message: "Reminder set successfully",
        event,
      });
    } catch (err: any) {
      console.error(err); // Log the error for debugging
      res.status(500).json({
        message: err.message,
        stack: err.stack,
      });
    }
  })(req, res, next);
};
