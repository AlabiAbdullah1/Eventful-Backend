const corsConfig: any = {
  paths: ["/api/*"],
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedOrigins: ["*"],
  allowedHeaders: ["*"],
  exposedHeaders: [],
  maxAge: 3600,
  supportsCredentials: true,
};

export default corsConfig;
