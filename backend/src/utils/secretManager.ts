import AWS from 'aws-sdk';

// Configure AWS SDK and create SecretsManager instance
AWS.config.update({ region: 'us-east-1' });
const secretsManager = new AWS.SecretsManager();

export async function getContentfulAccessToken(): Promise<string> {
    console.log('Retrieving secret for Contentful access token...');

    try {
        // Log the request details for debugging
        console.log(`Requesting secret value for ID: 'mycareernj-contentful-token-prod'`);

        const data = await secretsManager.getSecretValue({ SecretId: 'mycareernj-contentful-token-prod' }).promise();

        // Debugging: Log the raw response from Secrets Manager
        console.log('Received response from Secrets Manager:', JSON.stringify(data, null, 2));

        if (data.SecretString) {
            console.log('Secret string found, returning the secret value.');
            return data.SecretString;
        } else {
            console.log('Secret string is empty or not found in the response.');
            throw new Error('Secret string is empty');
        }
    } catch (error: unknown) { // Note the type annotation here
        // Properly check the error type before accessing properties
        if (error instanceof Error) {
            console.error('Error retrieving secret:', error.message);
            console.error('Stack Trace:', error.stack);
        } else {
            // Handle the case where the error is not an instance of Error
            console.error('An unexpected error occurred:', error);
        }
        throw error; // Rethrow the error after logging it
    }
}
