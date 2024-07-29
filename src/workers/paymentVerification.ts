import Queue from "bull";
import { verifyTransaction } from "../services/payStack"; // Adjust the import path as needed
import Event from "../models/Events";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const paymentQueue = new Queue("payment-verification", REDIS_URL);

paymentQueue.process(async (job) => {
  const { reference } = job.data;
  const transaction = await verifyTransaction(reference);

  if (transaction.data.status === "success") {
    const { metadata, customer } = transaction.data;
    const eventId = metadata.eventId;
    const email = customer.email;

    // Update your database here
    const event = await Event.findById(eventId);
    if (event) {
      event.attendees.push(email); // Assuming you store attendees by email
      await event.save();

      //   const attendee = new Attendee({ eventId, email });
      //   await attendee.save();
    } else {
      throw new Error("Event not found");
    }
  } else {
    throw new Error("Payment verification failed");
  }
});

export { paymentQueue };
