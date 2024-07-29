import axios from "axios";
require("dotenv").config();

const PAYSTACK_SECRET_KEY = "your-paystack-secret-key"; // Use environment variable for security

export const initializeTransaction = async (
  email: string,
  amount: number,
  eventId: string
) => {
  const url = "https://api.paystack.co/transaction/initialize";
  const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const response = await axios.post(
    url,
    {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      metadata: { eventId },
    },
    { headers }
  );

  return response.data;
};

export const verifyTransaction = async (reference: string) => {
  const url = `https://api.paystack.co/transaction/verify/${reference}`;
  const headers = {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const response = await axios.get(url, { headers });
  return response.data;
};
