import { Request, Response, NextFunction } from "express";
import corsConfig from "../config/corsConfig";

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the origin header from the incoming request
  const origin: any = req.headers.origin;

  // Check if the requested origin is allowed based on configured CORS settings
  if (
    corsConfig.allowedOrigins.includes("*") || // Allow all origins
    corsConfig.allowedOrigins.includes(origin) // Allow specific origins
  ) {
    // Set Access-Control-Allow-Origin header to the requested origin
    res.header("Access-Control-Allow-Origin", origin);
  }

  // Set Access-Control-Allow-Methods header based on allowed HTTP methods
  res.header(
    "Access-Control-Allow-Methods",
    corsConfig.allowedMethods.join(",")
  );

  // Set Access-Control-Allow-Headers header based on allowed request headers
  if (corsConfig.allowedHeaders.includes("*")) {
    // Allow all headers
    res.header(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"] || "*"
    );
  } else {
    // Allow configured headers
    res.header(
      "Access-Control-Allow-Headers",
      corsConfig.allowedHeaders.join(",")
    );
  }

  // Set Access-Control-Expose-Headers header for headers exposed to the client
  res.header(
    "Access-Control-Expose-Headers",
    corsConfig.exposedHeaders.join(",")
  );

  const maxAge: string = corsConfig.maxAge;
  // Set Access-Control-Max-Age header to specify duration for which preflight request results are cached
  res.header("Access-Control-Max-Age", maxAge);

  //? Set Access-Control-Allow-Credentials header to indicate whether credentials (such as cookies) can be sent in the CORS request
  res.header(
    "Access-Control-Allow-Credentials",
    corsConfig.supportsCredentials.toString()
  );

  //? Handle preflight requests sent with OPTIONS method
  if (req.method === "OPTIONS") {
    //? Respond with HTTP status 204 (No Content) to indicate preflight request was successful
    return res.sendStatus(204);
  }

  // Continue to the next middleware or route handler
  next();
};

export default corsMiddleware;
