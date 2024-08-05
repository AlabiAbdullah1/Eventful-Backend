import mongoose, { Schema, model, Document } from "mongoose";

// Define the User interface
interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  price: Number;
  creatorEmail: string;
  creatorName: string;
  creatorId: mongoose.Types.ObjectId;
  status: "pending" | "active" | "done";
  attendees: {
    name: string;
    email: string;
  }[];
  reminders: {
    userId: mongoose.Types.ObjectId;
    email: string;
    date: Date;
  }[];
}

// Define the User schema
const eventSchema = new Schema<IEvent>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  creatorEmail: {
    type: String,
    // required: true,
  },

  creatorName: {
    type: String,
    // required: true,
  },

  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "Creator",
    // required: true,
  },
  status: {
    type: String,
    enum: ["active", "pending", "done"],
    default: "pending",
  },
  attendees: [
    {
      name: {
        type: String,
        ref: "User",
      },
      email: {
        type: String,
        ref: "User",
      },
    },
  ],
  reminders: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      email: {
        type: String,
        ref: "User",
      },
      date: {
        type: Date,
        // required: true,
      },
    },
  ],
});

// Create and export the User model
const Event = model<IEvent>("Event", eventSchema);
export default Event;
