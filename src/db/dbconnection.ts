import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../logging/logger";

dotenv.config();

const MONGODB_URI: any = process.env.MONGODB_URI;

function connectToDB(): void {
  mongoose.connect(MONGODB_URI);

  mongoose.connection.on("connected", () => {
    logger.info("DB connected Successfully!");
    console.log("DB connected Successfully!");
  });

  mongoose.connection.on("error", () => {
    logger.info("An error occured!");
    console.log("An error occured!");
  });
}

export default connectToDB;
