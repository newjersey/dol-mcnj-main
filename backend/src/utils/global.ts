import cloudwatchLogger from './cloudwatchLogger';
import sentryLogger from './sentryLogger';

(function overrideConsoleMethods() {
  const statusDict: Array<string> = ["error", "warn", "info", "http", "verbose", "debug"];

  /* We're preserving the original console.log functionality just in case there are log messages that don't fit into
  the predefined statuses. This helps in making sure we don't unintentionally suppress important log messages. */
  const originalConsoleLog = console.log;

  console.log = function (message: string, status = "info") {
    if (statusDict.indexOf(status) === -1) {
      originalConsoleLog(message);
      return;
    }

    switch (status) {
      case "error":
        cloudwatchLogger.error(message);
        sentryLogger.error(message);
        break;
      case "warn":
        cloudwatchLogger.warn(message);
        break;
      case "info":
        cloudwatchLogger.info(message);
        break;
        // Assuming you have an http method for cloudwatchLogger
      case "http":
        cloudwatchLogger.info(`HTTP: ${message}`);  // Modify this line if you have a dedicated method for HTTP
        break;
      case "debug":
      case "verbose":
        cloudwatchLogger.info(message);  // Assuming you want to treat "debug" and "verbose" as "info" for CloudWatch
        break;
      default:
        originalConsoleLog(message);
        break;
    }
  };

  console.info = function (...args) {
    const message = args.join(' ');
    cloudwatchLogger.info(message);
  };

  console.warn = function (...args) {
    const message = args.join(' ');
    cloudwatchLogger.warn(message);
  };

  console.error = function (...args) {
    const message = args.join(' ');
    cloudwatchLogger.error(message);
    sentryLogger.error(message);
  };

  console.debug = function (...args) {
    const message = args.join(' ');
    cloudwatchLogger.info(message);  // Assuming you want to treat "debug" as "info" for CloudWatch
  };
})();