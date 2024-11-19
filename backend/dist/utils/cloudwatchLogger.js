"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
dotenv_1.default.config();
let logGroupName;
let logStreamName;
let logVpcEndpoint;
switch (process.env.NODE_ENV) {
    case 'awsprod':
        logGroupName = process.env.PROD_LOG_GROUP_NAME || '';
        logStreamName = process.env.PROD_LOG_STREAM_NAME || '';
        logVpcEndpoint = process.env.PROD_LOG_VPC_ENDPOINT || '';
        break;
    case 'awstest':
        logGroupName = process.env.TEST_LOG_GROUP_NAME || '';
        logStreamName = process.env.TEST_LOG_STREAM_NAME || '';
        logVpcEndpoint = process.env.TEST_LOG_VPC_ENDPOINT || '';
        break;
    case 'awsdev':
    default:
        logGroupName = process.env.DEV_LOG_GROUP_NAME || '';
        logStreamName = process.env.DEV_LOG_STREAM_NAME || '';
        logVpcEndpoint = process.env.DEV_LOG_VPC_ENDPOINT || '';
        break;
}
aws_sdk_1.default.config.update({
    cloudwatchlogs: {
        endpoint: logVpcEndpoint
    }
});
const cloudwatchLogs = new aws_sdk_1.default.CloudWatchLogs();
let sequenceToken;
const putLog = (message) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const params = {
        logGroupName,
        logStreamName,
        logEvents: [{
                message,
                timestamp: Date.now()
            }],
        sequenceToken
    };
    try {
        const response = yield cloudwatchLogs.putLogEvents(params).promise();
        sequenceToken = response.nextSequenceToken;
        return response;
    }
    catch (err) {
        console.error('Failed to log to CloudWatch:', err);
    }
});
const cloudwatchLogger = {
    error: (message) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return putLog(`ERROR: ${message}`);
    }),
    warn: (message) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return putLog(`WARN: ${message}`);
    }),
    info: (message) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return putLog(`INFO: ${message}`);
    })
};
exports.default = cloudwatchLogger;
