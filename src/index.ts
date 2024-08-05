import express, { Response, Request } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectToDB from "./db/dbconnection";
import userRoute from "./routes/userRoute";
import "./authentication/usersAuth";
import "./authentication/creatorAuth";
import eventRoute from "./routes/eventRoute";
import creatorRoute from "./routes/creatorRoute";
import path from "path";
import corsMiddleware from "./middleware/corsMiddleware";
import cookieParser from "cookie-parser";
import PaymentRoute from "./routes/paymentRoute";
import logger from "./logging/logger";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

dotenv.config();

connectToDB();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(helmet());

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/user", userRoute);
app.use("/creator", creatorRoute);
app.use("/event", eventRoute);
app.use("/payment", PaymentRoute);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Eventful API",
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});

export default app;
