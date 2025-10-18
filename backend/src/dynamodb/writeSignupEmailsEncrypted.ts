import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";
import { createSafeLogger, auditPIIOperation } from "../utils/piiSafety";
import { encryptSearchablePII, SearchableEncryptedData } from "../utils/piiEncryption";
import crypto from "crypto";

dotenv.config();

const logger = createSafeLogger(console.log);

const REGION = process.env.AWS_REGION;

// Configure DynamoDB client with PII-safe settings
const ddb = new DynamoDBClient({ 
  region: REGION,
  // Disable client-side logging to prevent PII exposure
  logger: undefined,
  maxAttempts: 3,
});
const docClient = DynamoDBDocumentClient.from(ddb, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
  },
});

/**
 * Insert a new subscriber record with client-side encryption for PII
 * - Email addresses are encrypted before storage using AWS KMS
 * - Supports searchable encryption for duplicate detection
 * - Idempotent: same email won't create duplicates (using search hash)
 * - Includes audit logging for PII operations
 * - Error handling without PII exposure
 */
export const addSubscriberToDynamoEncrypted = async (
  fname: string,
  lname: string,
  email: string
) => {
  const operationId = crypto.randomUUID();
  const TABLE_NAME = process.env.DDB_TABLE_NAME;
  const KMS_KEY_ID = process.env.KMS_KEY_ID;

  if (!TABLE_NAME) {
    throw new Error("DDB_TABLE_NAME is missing in environment variables.");
  }

  if (!KMS_KEY_ID) {
    throw new Error("KMS_KEY_ID is required for encryption.");
  }
  
  // Validate required email
  if (!email) {
    const error = new Error("Email address is required.");
    logger.error("DynamoDB operation failed: missing email", error, { operationId });
    throw error;
  }

  // Additional PII validation
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

    // Encrypt email with searchable encryption
    const encryptedEmail: SearchableEncryptedData = await encryptSearchablePII(
      email, 
      KMS_KEY_ID, 
      operationId
    );

    // Encrypt names if provided
    let encryptedFname = null;
    let encryptedLname = null;

    if (fname) {
      const fnameEncrypted = await encryptSearchablePII(fname, KMS_KEY_ID, operationId);
      encryptedFname = fnameEncrypted.encrypted;
    }

    if (lname) {
      const lnameEncrypted = await encryptSearchablePII(lname, KMS_KEY_ID, operationId);
      encryptedLname = lnameEncrypted.encrypted;
    }

    const updateCommand = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { 
        // Use search hash as the key to maintain uniqueness while keeping email encrypted
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

    const response = await docClient.send(updateCommand);
    
    // Audit successful PII storage
    auditPIIOperation('CREATE', 'EMAIL', true, undefined, { 
      operationId,
      tableName: TABLE_NAME,
      encrypted: true 
    });
    
    logger.info("Successfully saved encrypted subscriber to DynamoDB", { 
      operationId,
      hasAttributes: !!response.Attributes 
    });

    return response.Attributes;

  } catch (error) {
    // Audit failed PII operation
    auditPIIOperation('CREATE', 'EMAIL', false, undefined, { 
      operationId,
      tableName: TABLE_NAME,
      encrypted: true 
    });

    // Log error without exposing PII
    if (error instanceof Error) {
      // Check for specific AWS errors
      if (error.name === 'ConditionalCheckFailedException') {
        logger.error("DynamoDB conditional check failed", error, { operationId });
        throw new Error("is already a list member");
      } else if (error.name === 'ValidationException') {
        logger.error("DynamoDB validation error", error, { operationId });
        throw new Error("invalid email");
      } else if (error.name === 'ProvisionedThroughputExceededException') {
        logger.error("DynamoDB throttling error", error, { operationId });
        throw new Error("Service temporarily unavailable. Please try again later.");
      } else if (error.message.includes("KMS")) {
        logger.error("KMS encryption error", error, { operationId });
        throw new Error("Encryption service unavailable. Please try again later.");
      } else {
        logger.error("DynamoDB operation failed", error, { operationId });
        throw new Error("Database operation failed");
      }
    } else {
      logger.error("Unknown error in DynamoDB operation", undefined, { 
        operationId, 
        errorType: typeof error 
      });
      throw new Error("Unknown database error");
    }
  }
};

// Keep the original function for backward compatibility during migration
export { addSubscriberToDynamo } from "./writeSignupEmails";