// emailService.js
import nodemailer from "nodemailer";
require("dotenv").config();

// Configure your email transport
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  host: process.env.HOST,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a reminder email to a user
 * @param {any} email - Recipient email address
 * @param {object} event - Event details
 */
const sendReminderEmail = async (email: any, event: any) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Reminder for Event: ${event.name}`,
    text: `Hi there,

This is a reminder for the event "${event.name}" happening on ${new Date(
      event.date
    ).toLocaleDateString()}.

Event Description: ${event.description}

Best regards,
Your Event Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendReminderEmail;
