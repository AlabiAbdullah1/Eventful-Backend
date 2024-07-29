"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsConfig = {
    paths: ["/api/*"],
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedOrigins: ["*"],
    allowedHeaders: ["*"],
    exposedHeaders: [],
    maxAge: 3600,
    supportsCredentials: true,
};
exports.default = corsConfig;
