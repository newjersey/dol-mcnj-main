import dotenv from 'dotenv';
import AWS from 'aws-sdk';
// We are not using Winston or similar for this... winston-cloudwatch doesn't seem to agree with setting VPC endpoints

dotenv.config();

let logGroupName: string;
let logStreamName: string;
let logVpcEndpoint: string;

// Determine log group and stream based on NODE_ENV
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
        logVpcEndpoint = process.env.DEV_LOG_STREAM_NAME || '';
        break;
}

// Configure AWS SDK to use the VPC Endpoint-specific DNS name
AWS.config.update({
    cloudwatchlogs: {
        endpoint: logVpcEndpoint
    }
});

const cloudwatchLogs = new AWS.CloudWatchLogs();
let sequenceToken: string | undefined;

const putLog = async (message: string) => {
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
        const response = await cloudwatchLogs.putLogEvents(params).promise();
        sequenceToken = response.nextSequenceToken;  // Update the sequence token for next log event
        return response;
    } catch (err) {
        console.error('Failed to log to CloudWatch:', err);
    }
};

const cloudwatchLogger = {
    error: async (message: string) => {
        return putLog(`ERROR: ${message}`);
    },
    warn: async (message: string) => {
        return putLog(`WARN: ${message}`);
    },
    info: async (message: string) => {
        return putLog(`INFO: ${message}`);
    }
};

export default cloudwatchLogger;