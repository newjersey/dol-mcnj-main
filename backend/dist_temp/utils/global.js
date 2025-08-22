"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cloudwatchLogger_1 = tslib_1.__importDefault(require("./cloudwatchLogger"));
const sentryLogger_1 = tslib_1.__importDefault(require("./sentryLogger"));
(function overrideConsoleMethods() {
    const isAwsEnvironment = process.env.NODE_ENV === 'awsprod' ||
        process.env.NODE_ENV === 'awstest' ||
        process.env.NODE_ENV === 'awsdev';
    const statusDict = ["error", "warn", "info", "http", "verbose", "debug"];
    const originalConsoleLog = console.log;
    const logMessage = (message, status) => {
        if (!status || statusDict.indexOf(status) === -1 || !isAwsEnvironment) {
            originalConsoleLog(message);
        }
        else {
            switch (status) {
                case "error":
                    cloudwatchLogger_1.default.error(message);
                    sentryLogger_1.default.error(message);
                    break;
                case "warn":
                    cloudwatchLogger_1.default.warn(message);
                    break;
                case "info":
                case "http":
                case "debug":
                case "verbose":
                    cloudwatchLogger_1.default.info(message);
                    break;
            }
        }
    };
    console.log = logMessage;
    console.info = function (...args) {
        const message = args.join(' ');
        logMessage(message, 'info');
    };
    console.warn = function (...args) {
        const message = args.join(' ');
        logMessage(message, 'warn');
    };
    console.error = function (...args) {
        const message = args.join(' ');
        logMessage(message, 'error');
    };
    console.debug = function (...args) {
        const message = args.join(' ');
        logMessage(message, 'debug');
    };
})();
