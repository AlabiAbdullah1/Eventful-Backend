import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectToDB from "./db/dbconnection";
import userRoute from "./routes/userRoute";
import "./authentication/usersAuth";
import "./authentication/creatorAuth";
import eventRoute from "./routes/eventRoute";
import creatorRoute from "./routes/creatorRoute";
import path from "path";
import cors from "cors";
import corsMiddleware from "./middleware/corsMiddleware";
import cookieParser from "cookie-parser";

dotenv.config();

connectToDB();

const app = express();

app.use(corsMiddleware);
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
