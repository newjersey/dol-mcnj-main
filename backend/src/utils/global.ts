import cloudwatchLogger from "./cloudwatchLogger";
import sentryLogger from "./sentryLogger";

(function overrideConsoleMethods() {
  const isAwsEnvironment =
    process.env.NODE_ENV === "awsprod" ||
    process.env.NODE_ENV === "awstest" ||
    process.env.NODE_ENV === "awsdev";

  const statusDict: Array<string> = ["error", "warn", "info", "http", "verbose", "debug"];
  const originalConsoleLog = console.log;

  // Define a function to determine which logger to use based on NODE_ENV
  const logMessage = (message: string, status?: string) => {
    if (!status || statusDict.indexOf(status) === -1 || !isAwsEnvironment) {
      originalConsoleLog(message);
    } else {
      // Use cloudwatchLogger and sentryLogger for specified statuses
      switch (status) {
        case "error":
          cloudwatchLogger.error(message);
          sentryLogger.error(message);
          break;
        case "warn":
          cloudwatchLogger.warn(message);
          break;
        case "info":
        case "http":
        case "debug":
        case "verbose":
          cloudwatchLogger.info(message);
          break;
      }
    }
  };

  // Override the console methods
  console.log = logMessage;

  console.info = function (...args) {
    const message = args.join(" ");
    logMessage(message, "info");
  };

  console.warn = function (...args) {
    const message = args.join(" ");
    logMessage(message, "warn");
  };

  console.error = function (...args) {
    const message = args.join(" ");
    logMessage(message, "error");
  };

  console.debug = function (...args) {
    const message = args.join(" ");
    logMessage(message, "debug");
  };
})();
