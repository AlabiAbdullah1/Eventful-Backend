import { NextFunction, Request, Response } from "express";
import Event from "../models/Events";
import { sendEmail } from "../utils/mail";

export const cronJOb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const events = await Event.find();

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  events.forEach((event) => {
    // const userDOB = new Date(user.DOB)
    event.reminders.forEach((reminder) => {
      const date = new Date(reminder.date);
      const email = reminder.email;
      console.log({
        realDate: reminder.date,
        DBday: date.getDate(),
        todayDay: day,
      });
      console.log({
        realDate: reminder.date,
        DBmonth: date.getMonth() + 1,
        todayMonth: month,
      });
      console.log({
        realDate: reminder.date,
        DByear: date.getFullYear(),
        todayYear: year,
      });

      console.log({ userId: reminder.userId, date: reminder.date });
      if (
        date.getDate() === day &&
        date.getMonth() + 1 === month &&
        date.getFullYear() == year
      ) {
        // sendEmail(email);
      }
    });
  });
};

// users.forEach((user) => {
//     const userDOB = new Date(user.DOB);
//     if (userDOB.getDate() === day && userDOB.getMonth() === month) {
//       console.log(`Happy Birthday ${user.fullName} @ ${user.email}`);

//     }
//   });
// });
