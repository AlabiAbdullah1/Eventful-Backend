import axios, { AxiosInstance } from "axios";
require("dotenv").config();

const PAYSTACK_SECRET_KEY: string | undefined = process.env.PAY_STAK_SECRET_KEY;

const paystack: AxiosInstance = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
  },
});

export default paystack;
