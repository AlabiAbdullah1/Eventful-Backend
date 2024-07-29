import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "auth",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err || !user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      req.user = user;
      return next();
    }
  )(req, res, next);
};
