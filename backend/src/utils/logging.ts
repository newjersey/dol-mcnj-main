import dotenv from "dotenv";
import { createLogger, transports, format } from "winston";
const Sentry = require("winston-transport-sentry-node").default;

dotenv.config();

const { NODE_ENV, SENTRY_DSN } = process.env;
const payload = [];

payload.push(
  new transports.Console({
    level: "info",
    format: format.json(),
  }),
);

export const logger = createLogger({
  transports: payload,
});

// add to sentry if in production

const options = {
  sentry: {
    dsn: SENTRY_DSN,
  },
  level: "info",
};

export const sentry = createLogger({
  transports: [new Sentry(options)],
});
