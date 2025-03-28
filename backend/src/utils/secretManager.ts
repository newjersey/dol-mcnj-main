import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({ region: 'us-east-1' });
const secretsManager = new AWS.SecretsManager();

export async function getContentfulAccessToken(): Promise<string> {
    console.log('Retrieving secret for Contentful access token...');

    const environment = process.env.ENVIRONMENT || 'master'; // Default to 'master'
    const secretEnvironment = environment === 'master' ? 'prod' : environment;
    const secretId = `mycareernj-contentful-token-${secretEnvironment}`;
    try {
        console.log(`Requesting secret value for ID: '${secretId}'`);

        const data = await secretsManager.getSecretValue({ SecretId: secretId }).promise();

        if (data.SecretString) {
            console.log('Secret string found, returning the secret value.');
            return data.SecretString;
        } else {
            console.log('Secret string is empty or not found in the response.');
            throw new Error('Secret string is empty');
        }
    } catch (error: unknown) {
        console.error('Error retrieving secret from Secrets Manager. Falling back to environment variable DELIVERY_API.');

        const fallbackValue = process.env.DELIVERY_API;
        if (!fallbackValue) {
            console.error('DELIVERY_API environment variable is not set. Unable to retrieve access token.');
            throw new Error('DELIVERY_API environment variable is not set.');
        }

        console.log('Using fallback DELIVERY_API value.');
        return fallbackValue;
    }
}
