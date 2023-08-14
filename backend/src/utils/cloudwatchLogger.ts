import dotenv from 'dotenv'
import { createLogger, transports, format } from "winston";
import WinstonCloudWatch from 'winston-cloudwatch';

dotenv.config()

const cloudwatchLogger = createLogger({
    format: format.json(),
    transports: [
        new WinstonCloudWatch({
            logGroupName: process.env.LOG_GROUP_NAME,
            logStreamName: process.env.LOG_STREAM_NAME,
            awsRegion: process.env.AWS_REGION,
            createLogGroup: true,
            createLogStream: true,
        }),
    ],
});

export default cloudwatchLogger