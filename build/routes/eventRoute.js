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
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const eventRoute = (0, express_1.Router)();
// eventRoute.post("/", verifyRole, createEvent);
eventRoute.post("/", eventController_1.createEvent);
eventRoute.get("/:id", eventController_1.getEvent);
eventRoute.post("/pay", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// eventRoute.get("/verify/:reference", async (req: Request, res: Response) => {
//   const { reference } = req.params;
//   try {
//     await paymentQueue.add({ reference });
//     res.status(200).json({ message: "Payment verification in progress" });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// });
eventRoute.post("/:id/join", eventController_1.attendee_post);
eventRoute.get("/", eventController_1.getEvents);
exports.default = eventRoute;
