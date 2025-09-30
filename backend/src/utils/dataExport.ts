/**
 * Data Export Utilities for Encrypted PII
 * 
 * Provides secure data export functionality for analysts to retrieve
 * decrypted CSV data from DynamoDB through authenticated endpoints
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { decryptPII, decryptLegacyPII, EncryptedData } from "./piiEncryption";
import { createSafeLogger, auditPIIOperation } from "./piiSafety";
import * as crypto from "crypto";

const logger = createSafeLogger(console.log);

// Configure DynamoDB client
const ddb = new DynamoDBClient({ 
  region: process.env.AWS_REGION || "us-east-1",
  logger: undefined,
});
const docClient = DynamoDBDocumentClient.from(ddb);

export interface ExportOptions {
  tableName: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface DecryptedSubscriber {
  email: string;
  fname: string | null;
  lname: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExportResult {
  csv: string;
  metadata: {
    recordCount: number;
    exportedAt: string;
    operationId: string;
    dateRange?: {
      startDate: string;
      endDate: string;
    };
  };
}

/**
 * Exports encrypted subscriber data as decrypted CSV
 * This function should only be called by authenticated analysts with proper permissions
 */
export async function exportSubscribersAsCSV(
  options: ExportOptions,
  operationId?: string
): Promise<ExportResult> {
  const opId = operationId || crypto.randomUUID();
  const { tableName, limit = 1000, startDate, endDate, status } = options;
  
  try {
    logger.info("Starting encrypted data export", { 
      operationId: opId,
      tableName,
      limit,
      hasDateFilter: !!(startDate && endDate)
    });

    // Audit export operation start
    auditPIIOperation('READ', 'EMAIL', true, undefined, { 
      operationId: opId,
      tableName,
      limit,
      bulkExport: true
    });

    // Build scan parameters
    let filterExpression = '';
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    // Add status filter if provided
    if (status) {
      filterExpression = '#status = :status';
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = status;
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      const dateFilter = '#createdAt BETWEEN :startDate AND :endDate';
      filterExpression = filterExpression 
        ? `${filterExpression} AND ${dateFilter}`
        : dateFilter;
      
      expressionAttributeNames['#createdAt'] = 'createdAt';
      expressionAttributeValues[':startDate'] = startDate;
      expressionAttributeValues[':endDate'] = endDate;
    }

    // Scan DynamoDB table for encrypted records
    const scanParams: {
      TableName: string;
      Limit: number;
      FilterExpression?: string;
      ExpressionAttributeNames?: Record<string, string>;
      ExpressionAttributeValues?: Record<string, unknown>;
    } = {
      TableName: tableName,
      Limit: limit,
    };

    if (filterExpression) {
      scanParams.FilterExpression = filterExpression;
      scanParams.ExpressionAttributeNames = expressionAttributeNames;
      scanParams.ExpressionAttributeValues = expressionAttributeValues;
    }

    const result = await docClient.send(new ScanCommand(scanParams));
    
    if (!result.Items || result.Items.length === 0) {
      logger.info("No records found for export", { operationId: opId });
      return {
        csv: 'email,firstName,lastName,status,createdAt,updatedAt\n',
        metadata: {
          recordCount: 0,
          exportedAt: new Date().toISOString(),
          operationId: opId,
          ...(startDate && endDate && {
            dateRange: { startDate, endDate }
          })
        }
      };
    }

    logger.info("Retrieved encrypted records, starting decryption", { 
      operationId: opId,
      recordCount: result.Items.length
    });

    // Decrypt each record
    const decryptedRecords: DecryptedSubscriber[] = [];
    let decryptionErrors = 0;

    for (const item of result.Items) {
      try {
        const decryptedRecord: DecryptedSubscriber = {
          email: '',
          fname: null,
          lname: null,
          status: item.status || 'unknown',
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || ''
        };

        // Decrypt email
        if (item.encryptedEmail) {
          try {
            // Try standard decryption first, then fall back to legacy decryption
            try {
              decryptedRecord.email = await decryptPII(
                item.encryptedEmail as EncryptedData, 
                opId
              );
            } catch {
              // Fall back to legacy decryption for older data
              logger.info("Standard decryption failed, trying legacy decryption", { 
                operationId: opId,
                recordId: item.emailHash 
              });
              
              decryptedRecord.email = await decryptLegacyPII(
                item.encryptedEmail as EncryptedData, 
                opId
              );
            }
          } catch (error) {
            logger.error("Failed to decrypt email", error, { 
              operationId: opId,
              recordId: item.emailHash 
            });
            decryptedRecord.email = '[DECRYPTION_FAILED]';
            decryptionErrors++;
          }
        }

        // Decrypt first name if present
        if (item.encryptedFname) {
          try {
            // Try standard decryption first, then fall back to legacy decryption
            try {
              decryptedRecord.fname = await decryptPII(
                item.encryptedFname as EncryptedData, 
                opId
              );
            } catch {
              // Fall back to legacy decryption for older data
              logger.info("Standard decryption failed, trying legacy decryption", { 
                operationId: opId,
                recordId: item.emailHash 
              });
              
              decryptedRecord.fname = await decryptLegacyPII(
                item.encryptedFname as EncryptedData, 
                opId
              );
            }
          } catch (error) {
            logger.error("Failed to decrypt first name", error, { 
              operationId: opId,
              recordId: item.emailHash 
            });
            decryptedRecord.fname = '[DECRYPTION_FAILED]';
            decryptionErrors++;
          }
        }

        // Decrypt last name if present
        if (item.encryptedLname) {
          try {
            // Try standard decryption first, then fall back to legacy decryption
            try {
              decryptedRecord.lname = await decryptPII(
                item.encryptedLname as EncryptedData, 
                opId
              );
            } catch {
              // Fall back to legacy decryption for older data
              logger.info("Standard decryption failed, trying legacy decryption", { 
                operationId: opId,
                recordId: item.emailHash 
              });
              
              decryptedRecord.lname = await decryptLegacyPII(
                item.encryptedLname as EncryptedData, 
                opId
              );
            }
          } catch (error) {
            logger.error("Failed to decrypt last name", error, { 
              operationId: opId,
              recordId: item.emailHash 
            });
            decryptedRecord.lname = '[DECRYPTION_FAILED]';
            decryptionErrors++;
          }
        }

        decryptedRecords.push(decryptedRecord);

      } catch (error) {
        logger.error("Failed to process record", error, { 
          operationId: opId,
          recordId: item.emailHash 
        });
        decryptionErrors++;
      }
    }

    // Generate CSV manually
    const csvHeader = 'email,firstName,lastName,status,createdAt,updatedAt\n';
    const csvRows = decryptedRecords.map(record => {
      const escapeCSV = (value: string | null): string => {
        if (value === null) return '';
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      return [
        escapeCSV(record.email),
        escapeCSV(record.fname),
        escapeCSV(record.lname),
        escapeCSV(record.status),
        escapeCSV(record.createdAt),
        escapeCSV(record.updatedAt)
      ].join(',');
    }).join('\n');

    const csvData = csvHeader + csvRows;

    const exportResult: ExportResult = {
      csv: csvData,
      metadata: {
        recordCount: decryptedRecords.length,
        exportedAt: new Date().toISOString(),
        operationId: opId,
        ...(startDate && endDate && {
          dateRange: { startDate, endDate }
        })
      }
    };

    // Log successful export
    logger.info("Data export completed successfully", { 
      operationId: opId,
      recordCount: decryptedRecords.length,
      decryptionErrors,
      csvLength: csvData.length
    });

    // Audit successful export
    auditPIIOperation('READ', 'EMAIL', true, undefined, { 
      operationId: opId,
      tableName,
      recordCount: decryptedRecords.length,
      decryptionErrors,
      bulkExport: true
    });

    return exportResult;

  } catch (error) {
    // Audit failed export
    auditPIIOperation('READ', 'EMAIL', false, undefined, { 
      operationId: opId,
      tableName,
      error: error instanceof Error ? error.message : 'Unknown error',
      bulkExport: true
    });

    logger.error("Data export failed", error, { operationId: opId });
    throw new Error("Data export operation failed");
  }
}

/**
 * Validates export permissions and prerequisites
 */
export async function validateExportPermissions(
  tableName: string,
  operationId?: string
): Promise<{ canExport: boolean; issues: string[] }> {
  const opId = operationId || crypto.randomUUID();
  const issues: string[] = [];

  try {
    // Check if table exists and is accessible
    await docClient.send(new ScanCommand({
      TableName: tableName,
      Limit: 1
    }));

    // Check for required environment variables
    if (!process.env.AWS_REGION) {
      issues.push("AWS_REGION environment variable not configured");
    }

    // Validate KMS access (this would be done by attempting a small decrypt operation)
    // For now, we'll just check if any KMS keys are configured
    if (!process.env.KMS_KEY_ID) {
      issues.push("KMS_KEY_ID not configured for decryption");
    }

    const canExport = issues.length === 0;

    logger.info("Export permissions validation completed", { 
      operationId: opId,
      tableName,
      canExport,
      issueCount: issues.length
    });

    return { canExport, issues };

  } catch (error) {
    logger.error("Export permissions validation failed", error, { 
      operationId: opId,
      tableName 
    });
    
    issues.push(`Table access validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { canExport: false, issues };
  }
}

/**
 * Gets export statistics without performing the actual export
 */
export async function getExportStatistics(
  options: ExportOptions,
  operationId?: string
): Promise<{
  estimatedRecordCount: number;
  tableSizeBytes?: number;
  lastUpdated?: string;
}> {
  const opId = operationId || crypto.randomUUID();
  const { tableName, startDate, endDate, status } = options;

  try {
    // Build filter for count estimation
    let filterExpression = '';
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    if (status) {
      filterExpression = '#status = :status';
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = status;
    }

    if (startDate && endDate) {
      const dateFilter = '#createdAt BETWEEN :startDate AND :endDate';
      filterExpression = filterExpression 
        ? `${filterExpression} AND ${dateFilter}`
        : dateFilter;
      
      expressionAttributeNames['#createdAt'] = 'createdAt';
      expressionAttributeValues[':startDate'] = startDate;
      expressionAttributeValues[':endDate'] = endDate;
    }

    // Perform a scan with Select: "COUNT" to get record count without retrieving data
    const countParams: {
      TableName: string;
      Select: "COUNT";
      FilterExpression?: string;
      ExpressionAttributeNames?: Record<string, string>;
      ExpressionAttributeValues?: Record<string, unknown>;
    } = {
      TableName: tableName,
      Select: "COUNT"
    };

    if (filterExpression) {
      countParams.FilterExpression = filterExpression;
      countParams.ExpressionAttributeNames = expressionAttributeNames;
      countParams.ExpressionAttributeValues = expressionAttributeValues;
    }

    const result = await docClient.send(new ScanCommand(countParams));

    logger.info("Export statistics retrieved", { 
      operationId: opId,
      tableName,
      estimatedCount: result.Count || 0
    });

    return {
      estimatedRecordCount: result.Count || 0,
      // Note: tableSizeBytes and lastUpdated would require additional AWS API calls
      // to DynamoDB's DescribeTable operation
    };

  } catch (error) {
    logger.error("Failed to get export statistics", error, { 
      operationId: opId,
      tableName 
    });
    
    return {
      estimatedRecordCount: 0
    };
  }
}