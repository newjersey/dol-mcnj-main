import dotenv from 'dotenv';
import { createLogger, transports, format } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

dotenv.config();

// Determine log group and stream based on NODE_ENV
let logGroupName: string;
let logStreamName: string;

switch (process.env.NODE_ENV) {
    case 'production':
        logGroupName = process.env.PROD_LOG_GROUP_NAME || '';
        logStreamName = process.env.PROD_LOG_STREAM_NAME || '';
        break;
    case 'test':
        logGroupName = process.env.TEST_LOG_GROUP_NAME || '';
        logStreamName = process.env.TEST_LOG_STREAM_NAME || '';
        break;
    case 'development':
    default:
        logGroupName = process.env.DEV_LOG_GROUP_NAME || '';
        logStreamName = process.env.DEV_LOG_STREAM_NAME || '';
        break;
}

const cloudwatchLogger = createLogger({
    format: format.json(),
    transports: [
        new WinstonCloudWatch({
            logGroupName: logGroupName,
            logStreamName: logStreamName,
            awsRegion: process.env.AWS_REGION
/*            createLogGroup: true,
            createLogStream: true,*/
        }),
    ],
});

export default cloudwatchLogger;
