"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubscriberToDynamo = exports.addSubscriberToDynamoEncrypted = void 0;
const tslib_1 = require("tslib");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const piiSafety_1 = require("../utils/piiSafety");
const piiEncryption_1 = require("../utils/piiEncryption");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
dotenv_1.default.config();
const logger = (0, piiSafety_1.createSafeLogger)(console.log);
const REGION = process.env.AWS_REGION;
const ddb = new client_dynamodb_1.DynamoDBClient({
    region: REGION,
    logger: undefined,
    maxAttempts: 3,
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddb, {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
    },
});
const addSubscriberToDynamoEncrypted = (fname, lname, email) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const operationId = crypto_1.default.randomUUID();
    const TABLE_NAME = process.env.DDB_TABLE_NAME;
    console.log(TABLE_NAME);
    const KMS_KEY_ID = process.env.KMS_KEY_ID;
    if (!TABLE_NAME) {
        throw new Error("DDB_TABLE_NAME is missing in environment variables.");
    }
    if (!KMS_KEY_ID) {
        throw new Error("KMS_KEY_ID is required for encryption.");
    }
    if (!email) {
        const error = new Error("Email address is required.");
        logger.error("DynamoDB operation failed: missing email", error, { operationId });
        throw error;
    }
    if (email.length > 254) {
        const error = new Error("Email address exceeds maximum length.");
        logger.error("DynamoDB operation failed: email too long", error, { operationId });
        throw error;
    }
    const nowIso = new Date().toISOString();
    try {
        logger.info("Attempting to encrypt and save subscriber to DynamoDB", {
            operationId,
            hasFirstName: !!fname,
            hasLastName: !!lname,
            tableName: TABLE_NAME
        });
        const encryptedEmail = yield (0, piiEncryption_1.encryptSearchablePII)(email, KMS_KEY_ID, operationId);
        let encryptedFname = null;
        let encryptedLname = null;
        if (fname) {
            const fnameEncrypted = yield (0, piiEncryption_1.encryptSearchablePII)(fname, KMS_KEY_ID, operationId);
            encryptedFname = fnameEncrypted.encrypted;
        }
        if (lname) {
            const lnameEncrypted = yield (0, piiEncryption_1.encryptSearchablePII)(lname, KMS_KEY_ID, operationId);
            encryptedLname = lnameEncrypted.encrypted;
        }
        const updateCommand = new lib_dynamodb_1.UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                emailHash: encryptedEmail.searchHash
            },
            UpdateExpression: `
        SET #EMAIL_DATA = :emailData,
            #FNAME_DATA = :fnameData,
            #LNAME_DATA = :lnameData,
            #STATUS = :status,
            #UPDATED_AT = :updatedAt,
            #CREATED_AT = if_not_exists(#CREATED_AT, :createdAt)
      `,
            ExpressionAttributeNames: {
                "#EMAIL_DATA": "encryptedEmail",
                "#FNAME_DATA": "encryptedFname",
                "#LNAME_DATA": "encryptedLname",
                "#STATUS": "status",
                "#UPDATED_AT": "updatedAt",
                "#CREATED_AT": "createdAt"
            },
            ExpressionAttributeValues: {
                ":emailData": encryptedEmail.encrypted,
                ":fnameData": encryptedFname,
                ":lnameData": encryptedLname,
                ":status": "subscribed",
                ":updatedAt": nowIso,
                ":createdAt": nowIso
            },
            ReturnValues: "ALL_NEW"
        });
        const response = yield docClient.send(updateCommand);
        (0, piiSafety_1.auditPIIOperation)('CREATE', 'EMAIL', true, undefined, {
            operationId,
            tableName: TABLE_NAME,
            encrypted: true
        });
        logger.info("Successfully saved encrypted subscriber to DynamoDB", {
            operationId,
            hasAttributes: !!response.Attributes
        });
        return response.Attributes;
    }
    catch (error) {
        (0, piiSafety_1.auditPIIOperation)('CREATE', 'EMAIL', false, undefined, {
            operationId,
            tableName: TABLE_NAME,
            encrypted: true
        });
        if (error instanceof Error) {
            if (error.name === 'ConditionalCheckFailedException') {
                logger.error("DynamoDB conditional check failed", error, { operationId });
                throw new Error("is already a list member");
            }
            else if (error.name === 'ValidationException') {
                logger.error("DynamoDB validation error", error, { operationId });
                throw new Error("invalid email");
            }
            else if (error.name === 'ProvisionedThroughputExceededException') {
                logger.error("DynamoDB throttling error", error, { operationId });
                throw new Error("Service temporarily unavailable. Please try again later.");
            }
            else if (error.message.includes("KMS")) {
                logger.error("KMS encryption error", error, { operationId });
                throw new Error("Encryption service unavailable. Please try again later.");
            }
            else {
                logger.error("DynamoDB operation failed", error, { operationId });
                throw new Error("Database operation failed");
            }
        }
        else {
            logger.error("Unknown error in DynamoDB operation", undefined, {
                operationId,
                errorType: typeof error
            });
            throw new Error("Unknown database error");
        }
    }
});
exports.addSubscriberToDynamoEncrypted = addSubscriberToDynamoEncrypted;
var writeSignupEmails_1 = require("./writeSignupEmails");
Object.defineProperty(exports, "addSubscriberToDynamo", { enumerable: true, get: function () { return writeSignupEmails_1.addSubscriberToDynamo; } });
