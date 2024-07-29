import passport from "passport";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { generateQRCode } from "../utils/qrcode";

export const getRegister = async (req: Request, res: Response) => {
  try {
    res.status(200).render("login");
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

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
  passport.authenticate("auth", async (err: Error, user: any, info: any) => {
    try {
      if (err || !user) {
        res.status(401).json({
          message: "Unauthorized, Please Login in",
        });
      }

      const users = await User.findById(user.id);

      res.status(200).json({
        message: users?.eventAttended,
      });
    } catch (err: any) {
      // return next();
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
  passport.authenticate("auth", async (err: Error, user: any, info: any) => {
    try {
      if (err || !user) {
        res.status(401).json({
          message: "Unauthorized, Please Login in",
        });
      }

      const date = req.body; //Date to set for the reminder
      const users = await User.findById(user.id);

      res.status(200).json({
        message: users?.eventAttended,
      });
    } catch (err: any) {
      // return next();
      res.status(500).json({
        message: err.message,
        stack: err.stack,
      });
    }
  })(req, res, next);
};
