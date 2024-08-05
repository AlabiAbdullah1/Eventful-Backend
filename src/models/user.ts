import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define the User interface
interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  // eventAttended: mongoose.Types.ObjectId[];
  eventAttended: {
    id: string;
    name: string;
    descriptiom: string;
    status: string;
    price: number;
    date: Date;
  }[];
  isValidPassword(password: string): Promise<boolean>;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "user",
  },
  eventAttended: [
    {
      id: {
        type: String,
        ref: "Event",
      },
      name: {
        type: String,
        ref: "Event",
      },
      description: {
        type: String,
        ref: "Event",
      },
      date: {
        type: Date,
        ref: "Event",
      },
      status: {
        type: String,
        ref: "Event",
      },
      price: {
        type: String,
        ref: "Event",
      },
    },
  ],
});

userSchema.pre<IUser>("save", async function (next) {
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
userSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  const user = this as IUser;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// Create and export the User model
const User = model<IUser>("User", userSchema);
export default User;
