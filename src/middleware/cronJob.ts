import cron from "node-cron";
import sendReminderEmail from "../services/email";
import Event from "../models/Events";

const cronScheduler = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily reminder check...");

    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Find events with reminders set for today
      const events = await Event.find({
        "reminders.date": { $eq: today },
      }).exec();

      // Process each event
      for (const event of events) {
        for (const reminder of event.reminders) {
          if (reminder.date.toISOString().split("T")[0] === today) {
            // Send email for each reminder
            await sendReminderEmail(reminder.email, event);
          }
        }
      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};

export default cronScheduler;
