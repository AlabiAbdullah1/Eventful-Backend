import { Request, Response, NextFunction } from "express";
import passport from "passport";
import Event from "../models/Events";
import { generateQRCode } from "../utils/qrcode";
import Creator from "../models/creator";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const signup_creator = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({
      message: "Signup failed, no user found",
    });
  }

  return res.status(201).json({
    message: "You have signed up successfully!",
    user,
    // id: user._id, // Access the user ID
  });
};

export const login_creator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "creator-login",
    async (err: Error, user: any, info: any) => {
      try {
        if (err) {
          return next(err);
        }
        if (!user) {
          const error = new Error("Username or password is incorrect");
          return next(error);
        }

        req.login(user, { session: false }, async (error: Error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email };
          const token = jwt.sign(
            { user: body },
            process.env.JWT_SECRET as string
          );

          // return res.cookie("token", token);

          return res.json({ token, Id: user._id });
          // res.status(200).render("login");
        });
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};

export const Analytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("auth", async (err: Error, user: any, info: any) => {
    try {
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized, Please Login in",
        });
      }

      const events = await Event.find();

      events.forEach(async (event) => {
        if (event.creatorId === user.id) {
          const qrCode = await generateQRCode(
            `http://localhost:8000/event/${event.id}`
          );
          const attender = event.attendees.length;
          res.status(200).json({
            eventAttender: `There are ${attender} for the event ${event.name}`,
            qrCode,
            numberOfTicketsBought: `${attender} tickets are bought for the ${event.name} event`,
          });
        }
      });

      return next();
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  })(req, res, next);
};

export const test = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("auth", async (err: Error, user: any, info: any) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Unauthorized, Please Log in",
      });
    }

    try {
      const events = await Event.find({ creatorId: user.id });
      if (events.length === 0) {
        return res.status(404).json({
          message: "No events found for this user",
        });
      }

      const eventDetails = await Promise.all(
        events.map(async (event) => {
          const qrCode = await generateQRCode(
            `http://localhost:8000/event/${event.id}`
          );
          const attenderCount = event.attendees.length;

          return {
            eventName: event.name,
            eventAttender: `There are ${attenderCount} attendees for the event ${event.name}`,
            numberOfTicketsBought: `${attenderCount} tickets are bought for the ${event.name} event`,
            qrCode,
          };
        })
      );

      res.status(200).json(eventDetails);
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  })(req, res, next);
};
