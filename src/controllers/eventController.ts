import { Request, Response, NextFunction } from "express";
import passport from "passport";
import Event from "../models/Events";
import { generateQRCode } from "../utils/qrcode";
import User from "../models/user";
import { cronJOb } from "../middleware/cronJob";
import { initializeTransaction } from "../services/payStack";
import { paymentQueue } from "../workers/paymentVerification";
import axios from "axios";
import { any, number } from "joi";

export const createEvent = async (
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

      const { name, description, date, status } = req.body;

      const creatorId = user._id;
      const creatorName = user.name;
      const todayDate: any = new Date();
      const event = await Event.create({
        name,
        description,
        date: new Date(date),
        creatorId,
        creatorName,
        status,
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
  passport.authenticate("auth", async (err: Error, user: any, info: any) => {
    try {
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized, Please Login in",
        });
      }

      const events = await Event.find();
      const reminder = cronJOb(req, res, next);

      res.status(200).json({
        // data: events,
        reminder,
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
  passport.authenticate("auth", async (err: Error, user: any, info: any) => {
    try {
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized, Please Login in",
        });
      }

      const id = req.params.id;
      const events = await Event.findById(id);

      const eventDate: any = events?.date;
      const todayDate: any = new Date();

      console.log(todayDate);

      if (!events) {
        console.log("Event not found.");
        return;
      }

      // Check if event date is less than today
      if (events?.date < todayDate) {
        // Update the event status to 'done'
        Event.findByIdAndUpdate(id, { status: "done" }, { new: true }).then(
          (event) => {
            res.status(200).json({
              message: `The details for ${event?.name}`,
              name: event?.name,
              description: event?.description,
              date: event?.date,
              status: event?.status,
            });
            console.log("Event updated(done):", event, eventDate);
          }
        );
      } else if (events?.date === todayDate) {
        Event.findByIdAndUpdate(id, { status: "active" }, { new: true }).then(
          (event) => {
            res.status(200).json({
              message: `The details for ${event?.name}`,
              name: event?.name,
              description: event?.description,
              date: event?.date,
              status: event?.status,
            });
            console.log("Event updated(done):", event, eventDate);
          }
        );
      } else {
        Event.findByIdAndUpdate(id, { status: "pending" }, { new: true }).then(
          (event) => {
            res.status(200).json({
              message: `The details for ${event?.name}`,
              name: event?.name,
              description: event?.description,
              date: event?.date,
              status: event?.status,
            });
            console.log("Event updated(active):", event, eventDate);
          }
        );
      }

      // return next();
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  })(req, res, next);
};

//CREATE ATTENDEES FOR AN EVENT

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

export const attendee_post = async (
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

      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ msg: "Event not found" });

      const users = await User.findById(user.id).populate(
        "eventAttended",
        "name description"
      );

      const attendee: any = {
        id: user.id,
        email: user.email,
      };

      const eventReminder: any = event.date;
      const remind = eventReminder - 2 * 24 * 60 * 60 * 1000;

      const reminder: any = {
        userId: user.id,
        email: user.email,
        date: remind,
      };

      const events: any = {
        name: event.name,
        description: event.description,
        date: event.date,
        status: event.status,
      };

      const isAlreadyAttendee = event.attendees.some((att) =>
        att.email.match(user.email)
      );
      if (isAlreadyAttendee) {
        return res
          .status(400)
          .json({ msg: "User already registered for this event" });
      }

      // Initialize Paystack payment
      const price: any = event.price;
      const paymentInitResponse = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: user.email,
          amount: price * 100, // Paystack expects the amount in kobo
        },
        {
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
          },
        }
      );

      if (paymentInitResponse.status !== 200) {
        return res.status(500).json({
          message: "Payment initialization failed",
        });
      }

      const { authorization_url, reference } = paymentInitResponse.data.data;

      // Save payment reference to the event or user record for future verification
      attendee.paymentReference = reference;

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
        paymentUrl: authorization_url,
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
export const get_Event_Attender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // passport.authenticate(
  //   "auth",
  //   { session: false },
  //   async (err: any, user: any, info: any) => {
  //     if (err || !user) {
  //       return res.status(401).json({
  //         message: "Unauthorized, Please Login in",
  //       });
  //     }

  res.status(200).render("index");

  return next();
};
// )(req, res, next);
// };

// passport.authenticate("auth", async (err: Error, user: any, info: any) => {
//   try {
//     if (err || !user) {
//       return res.status(401).json({
//         message: "Unauthorized, Please Login in",
//       });
//     }
//   } catch (err) {}
// });
// };
