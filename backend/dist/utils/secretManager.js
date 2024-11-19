"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentfulAccessToken = getContentfulAccessToken;
const tslib_1 = require("tslib");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({ region: 'us-east-1' });
const secretsManager = new aws_sdk_1.default.SecretsManager();
function getContentfulAccessToken() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log('Retrieving secret for Contentful access token...');
        try {
            console.log(`Requesting secret value for ID: 'mycareernj-contentful-token-prod'`);
            const data = yield secretsManager.getSecretValue({ SecretId: 'mycareernj-contentful-token-prod' }).promise();
            if (data.SecretString) {
                console.log('Secret string found, returning the secret value.');
                return data.SecretString;
            }
            else {
                console.log('Secret string is empty or not found in the response.');
                throw new Error('Secret string is empty');
            }
        }
        catch (error) {
            console.error('Error retrieving secret from Secrets Manager. Falling back to environment variable DELIVERY_API.');
            const fallbackValue = process.env.DELIVERY_API;
            if (!fallbackValue) {
                console.error('DELIVERY_API environment variable is not set. Unable to retrieve access token.');
                throw new Error('DELIVERY_API environment variable is not set.');
            }
            console.log('Using fallback DELIVERY_API value.');
            return fallbackValue;
        }
    });
}
