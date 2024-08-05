import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define the User interface
interface ICreator extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isValidPassword(password: string): Promise<boolean>;
}

// Define the User schema
const creatorSchema = new Schema<ICreator>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "creator",
  },
});

creatorSchema.pre<ICreator>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
  } catch (error) {
    next(error as any);
  }
});

// Add methods to the User schema
creatorSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  const user = this as ICreator;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// Create and export the User model
const Creator = model<ICreator>("Creator", creatorSchema);
export default Creator;
