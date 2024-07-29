import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI: any = process.env.MONGODB_URI;

function connectToDB(): void {
  mongoose.connect(MONGODB_URI);

  mongoose.connection.on("connected", () => {
    console.log("DB connected Successfully!");
  });

  mongoose.connection.on("error", () => {
    console.log("An error occured!");
  });
}

export default connectToDB;
