"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the User schema
const eventSchema = new mongoose_1.Schema({
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
    creatorName: {
        type: String,
        // required: true,
    },
    creatorId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
const Event = (0, mongoose_1.model)("Event", eventSchema);
exports.default = Event;
