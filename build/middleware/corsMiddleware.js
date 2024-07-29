"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const corsConfig_1 = __importDefault(require("../config/corsConfig"));
const corsMiddleware = (req, res, next) => {
    // Retrieve the origin header from the incoming request
    const origin = req.headers.origin;
    // Check if the requested origin is allowed based on configured CORS settings
    if (corsConfig_1.default.allowedOrigins.includes("*") || // Allow all origins
        corsConfig_1.default.allowedOrigins.includes(origin) // Allow specific origins
    ) {
        // Set Access-Control-Allow-Origin header to the requested origin
        res.header("Access-Control-Allow-Origin", origin);
    }
    // Set Access-Control-Allow-Methods header based on allowed HTTP methods
    res.header("Access-Control-Allow-Methods", corsConfig_1.default.allowedMethods.join(","));
    // Set Access-Control-Allow-Headers header based on allowed request headers
    if (corsConfig_1.default.allowedHeaders.includes("*")) {
        // Allow all headers
        res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "*");
    }
    else {
        // Allow configured headers
        res.header("Access-Control-Allow-Headers", corsConfig_1.default.allowedHeaders.join(","));
    }
    // Set Access-Control-Expose-Headers header for headers exposed to the client
    res.header("Access-Control-Expose-Headers", corsConfig_1.default.exposedHeaders.join(","));
    const maxAge = corsConfig_1.default.maxAge;
    // Set Access-Control-Max-Age header to specify duration for which preflight request results are cached
    res.header("Access-Control-Max-Age", maxAge);
    //? Set Access-Control-Allow-Credentials header to indicate whether credentials (such as cookies) can be sent in the CORS request
    res.header("Access-Control-Allow-Credentials", corsConfig_1.default.supportsCredentials.toString());
    //? Handle preflight requests sent with OPTIONS method
    if (req.method === "OPTIONS") {
        //? Respond with HTTP status 204 (No Content) to indicate preflight request was successful
        return res.sendStatus(204);
    }
    // Continue to the next middleware or route handler
    next();
};
exports.default = corsMiddleware;
