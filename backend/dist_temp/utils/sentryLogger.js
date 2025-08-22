"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const winston_1 = require("winston");
dotenv_1.default.config();
const { NODE_ENV, SENTRY_DSN } = process.env;
const payload = [];
if (NODE_ENV == "production" && SENTRY_DSN) {
    payload.push(new winston_1.transports.Console({
        level: "debug",
        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    }));
}
else {
    payload.push(new winston_1.transports.Console({
        level: "info",
        format: winston_1.format.json()
    }));
}
const sentryLogger = (0, winston_1.createLogger)({
    transports: payload,
});
exports.default = sentryLogger;
