import { NextFunction, Response, Request } from "express";
import passport from "passport";

export const verifyRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("auth", async (err: Error, user: any, info: any) => {
    if (user?.role !== "creator")
      res.status(403).json({
        message: "You are not a creator, this route is unauthorized for you!",
      });
    else {
      next();
    }
  })(req, res, next);
};
