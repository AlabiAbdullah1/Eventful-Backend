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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJOb = void 0;
const Events_1 = __importDefault(require("../models/Events"));
const cronJOb = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield Events_1.default.find();
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
            if (date.getDate() === day &&
                date.getMonth() + 1 === month &&
                date.getFullYear() == year) {
                // sendEmail(email);
            }
        });
    });
});
exports.cronJOb = cronJOb;
// users.forEach((user) => {
//     const userDOB = new Date(user.DOB);
//     if (userDOB.getDate() === day && userDOB.getMonth() === month) {
//       console.log(`Happy Birthday ${user.fullName} @ ${user.email}`);
//     }
//   });
// });
