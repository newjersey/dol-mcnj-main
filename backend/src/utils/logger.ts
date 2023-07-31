import dotenv from "dotenv";
import { createLogger, transports, format } from "winston";

dotenv.config();

const winston = require("winston");
let date = new Date().toISOString();
const logFormat = format.printf(function (info) {
  return `${info.level}: ${JSON.stringify(info.message, null, 4)}\n`;
});

const { NODE_ENV, SENTRY_DSN } = process.env;
const payload = [];

if (NODE_ENV == "production" && SENTRY_DSN) {
  payload.push(
    new transports.Console({
      level: "debug",
      format: format.combine(format.timestamp(), format.json()),
    }),
  );
} else {
  // add to sentry if in production
  payload.push(
    new transports.Console({
      level: "info",
      format: format.combine(format.colorize(), format.json(), logFormat),
    }),
  );
}

const logger = createLogger({
  transports: payload,
});

export default logger;
