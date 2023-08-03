import { sentry, logger } from "./logging";
const { NODE_ENV, SENTRY_DSN } = process.env;

// change global console.log to winston logger type

enum ErrorStatus {
  "error",
  "warn",
  "info",
  "http",
  "verbose",
  "debug",
  "fatal",
}

(() => {
  console.log = function (info, alt_status: ErrorStatus) {
    let { message, status } = info;
    // the available status
    status = status || alt_status || "info";
    message = message || info;

    const sentry_code_dict = ["error", "warn", "fatal"];
    const status_dict = ["info", "http", "verbose", "debug", ...sentry_code_dict];
    // if status is not part of the availability, change it to info
    if (!status_dict.includes(status)) {
      status = "info";
    }

    const send_to_sentry =
      NODE_ENV == "production" && SENTRY_DSN && sentry_code_dict.includes(status);

    if (send_to_sentry) {
      sentry.log(status, message);
    } else {
      logger.log(status, message);
    }
  };
})();
