import { Request, Response } from "express";
import axios from "axios";
import paystack from "../services/payStack";

require("dotenv").config();

interface PaymentRequestBody {
  email: string;
  amount: number;
}

export const initializePayment = async (req: Request, res: Response) => {
  const { email, amount }: PaymentRequestBody = req.body;

  try {
    const response = await paystack.post("/transaction/initialize", {
      email,
      amount: amount * 100, // Convert amount to kobo
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { reference } = req.params;

  try {
    const response = await paystack.get(`/transaction/verify/${reference}`);

    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
