"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbconnection_1 = __importDefault(require("./db/dbconnection"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
require("./authentication/usersAuth");
require("./authentication/creatorAuth");
const eventRoute_1 = __importDefault(require("./routes/eventRoute"));
const creatorRoute_1 = __importDefault(require("./routes/creatorRoute"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const paymentRoute_1 = __importDefault(require("./routes/paymentRoute"));
const logger_1 = __importDefault(require("./logging/logger"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
(0, dbconnection_1.default)();
// cronScheduler();
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/user", userRoute_1.default);
app.use("/creator", creatorRoute_1.default);
app.use("/event", eventRoute_1.default);
app.use("/payment", paymentRoute_1.default);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Eventful API",
    });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    logger_1.default.info(`Listening on port ${PORT}`);
    console.log(`Listening on port ${PORT}...`);
});
exports.default = app;
