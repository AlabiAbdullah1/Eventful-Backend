import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../models/user";
import Creator from "../models/creator";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

passport.use(
  new JWTStrategy(
    {
      secretOrKey: JWT_SECRET,
      // jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token') // Use this if we are using query
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Use this if you are using Bearer token
    },
    async (token: any, done: (error: any, user?: any) => void) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.
passport.use(
  "creator-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (
      req: Request,
      email: string,
      password: string,
      done: (error: any, user?: any, options?: any) => void
    ) => {
      try {
        const users = await UserModel.findOne({ email });
        const creator = await Creator.findOne({ email });

        if (users || creator) {
          return done(null, false, {
            message: "Email already in use",
          });
          //   return console.log("Email already in use");
        }

        const { name } = req.body;
        const user = await Creator.create({ name, email, password });
        return done(null, user);
      } catch (error: any) {
        console.log(error.message);
        done(error);
      }
    }
  )
);

// This middleware authenticates the user based on the email and password provided.
// If the user is found, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport.use(
  "creator-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (
      email: string,
      password: string,
      done: (error: any, user?: any, options?: any) => void
    ) => {
      try {
        const user = await Creator.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
