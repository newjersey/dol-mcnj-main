import dotenv from 'dotenv'
import { createLogger, transports, format } from "winston";
import Sentry from 'winston-sentry-log';

dotenv.config()

const { NODE_ENV, SENTRY_DSN } = process.env;
const payload = [];

if (NODE_ENV == "production" && SENTRY_DSN) {
  const options = {
    config: {
      dsn: SENTRY_DSN
    },
    level: "info"
  };

  payload.push(
    new Sentry(options)
  );
} else {
  // add to sentry if in production
  payload.push(
    new transports.Console({
      level: "debug",
      format: format.combine(format.timestamp(), format.json()),
    })
  );
}

payload.push(
  new transports.Console({
    level: "debug",
    format: format.combine(format.timestamp(), format.json()),
  })
);

const logger = createLogger({
  transports: payload,
});


export default logger
