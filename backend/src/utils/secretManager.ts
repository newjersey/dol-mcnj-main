import AWS from 'aws-sdk';
AWS.config.update({ region: 'us-east-1' });
const secretsManager = new AWS.SecretsManager();

export async function getContentfulAccessToken(): Promise<string> {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: 'mycareernj-contentful-token-prod' }).promise();
        if (data.SecretString) {
            return data.SecretString;
        }
        throw new Error('Secret string is empty');
    } catch (error) {
        console.error('Error retrieving secret:', error);
        throw error;
    }
}