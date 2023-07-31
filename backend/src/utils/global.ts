import logger from "./logger";

// change global console.log to winston logger type

(() => {
  console.log = function (info, alt_status) {
    let { message, status } = info;
    // the available status
    status = status || alt_status || "info";
    message = message || info;

    const status_dict = ["error", "warn", "info", "http", "verbose", "debug"];
    // if status is not part of the availability, change it to info
    if (!status_dict.includes(status)) {
      status = "info";
    }
    logger.log(status, message);
  };
})();
