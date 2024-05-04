import dotenv from "dotenv";
import { createLogger, transports, format } from "winston";

dotenv.config();

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
      format: format.json(),
    }),
  );
}

const logger = createLogger({
  transports: payload,
});

export default logger;