"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodeMailer = require("nodemailer");
require("dotenv").config();
// const transporter = nodeMailer.createTransport({
//   service: "gmail",
//   host: "smpt.gmail.com",
//   port: 465,
//   // secure: true,
//   auth: {
//     user: "sikeabdulnig@gmail.com",
//     pass: "fdyvlpfxuplojszd",
//   },
// });
const transporter = nodeMailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    port: process.env.SERVICE_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEmail = (recipientEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: "HAPPY BIRTHDAY",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Happy Birthday!</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 20px;
                        color: #333;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        max-width: 600px;
                        margin: 0 auto;
                        overflow: hidden;
                    }
                    .header {
                        background-color: #4CAF50;
                        color: #ffffff;
                        padding: 20px;
                        text-align: center;
                    }
                    .content {
                        padding: 20px;
                        text-align: center;
                    }
                    .footer {
                        background-color: #4CAF50;
                        color: #ffffff;
                        padding: 10px;
                        text-align: center;
                    }
                    .button {
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                        margin-top: 20px;
                    }

                    #abdul{
                     text-align:"center";
                     color:""

                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Happy Birthday, ${name}! 🎊🎉🎂</h1>
                    </div>
                    <div class="content">
                        <p>I hope you have a fantastic day filled with joy, love, and celebration.✨</p>
                        <p>Thank you for being a great friend ${name}. I wish you all the best on your special day!</p>
                        <p id="abdul">From your guy,  ❤ ABDUL ❤</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 ABDUL!. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>`,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendEmail = sendEmail;
