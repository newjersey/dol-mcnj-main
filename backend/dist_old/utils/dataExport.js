"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportSubscribersAsCSV = exportSubscribersAsCSV;
exports.validateExportPermissions = validateExportPermissions;
exports.getExportStatistics = getExportStatistics;
const tslib_1 = require("tslib");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const piiEncryption_1 = require("./piiEncryption");
const piiSafety_1 = require("./piiSafety");
const crypto = tslib_1.__importStar(require("crypto"));
const logger = (0, piiSafety_1.createSafeLogger)(console.log);
const ddb = new client_dynamodb_1.DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    logger: undefined,
});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(ddb);
function exportSubscribersAsCSV(options, operationId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const opId = operationId || crypto.randomUUID();
        const { tableName, limit = 1000, startDate, endDate, status } = options;
        try {
            logger.info("Starting encrypted data export", {
                operationId: opId,
                tableName,
                limit,
                hasDateFilter: !!(startDate && endDate)
            });
            (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', true, undefined, {
                operationId: opId,
                tableName,
                limit,
                bulkExport: true
            });
            let filterExpression = '';
            const expressionAttributeNames = {};
            const expressionAttributeValues = {};
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
            const scanParams = {
                TableName: tableName,
                Limit: limit,
            };
            if (filterExpression) {
                scanParams.FilterExpression = filterExpression;
                scanParams.ExpressionAttributeNames = expressionAttributeNames;
                scanParams.ExpressionAttributeValues = expressionAttributeValues;
            }
            const result = yield docClient.send(new lib_dynamodb_1.ScanCommand(scanParams));
            if (!result.Items || result.Items.length === 0) {
                logger.info("No records found for export", { operationId: opId });
                return {
                    csv: 'email,firstName,lastName,status,createdAt,updatedAt\n',
                    metadata: Object.assign({ recordCount: 0, exportedAt: new Date().toISOString(), operationId: opId }, (startDate && endDate && {
                        dateRange: { startDate, endDate }
                    }))
                };
            }
            logger.info("Retrieved encrypted records, starting decryption", {
                operationId: opId,
                recordCount: result.Items.length
            });
            const decryptedRecords = [];
            let decryptionErrors = 0;
            for (const item of result.Items) {
                try {
                    const decryptedRecord = {
                        email: '',
                        fname: null,
                        lname: null,
                        status: item.status || 'unknown',
                        createdAt: item.createdAt || '',
                        updatedAt: item.updatedAt || ''
                    };
                    if (item.encryptedEmail) {
                        try {
                            try {
                                decryptedRecord.email = yield (0, piiEncryption_1.decryptPII)(item.encryptedEmail, opId);
                            }
                            catch (standardError) {
                                logger.info("Standard decryption failed, trying legacy decryption", {
                                    operationId: opId,
                                    recordId: item.emailHash
                                });
                                decryptedRecord.email = yield (0, piiEncryption_1.decryptLegacyPII)(item.encryptedEmail, opId);
                            }
                        }
                        catch (error) {
                            logger.error("Failed to decrypt email", error, {
                                operationId: opId,
                                recordId: item.emailHash
                            });
                            decryptedRecord.email = '[DECRYPTION_FAILED]';
                            decryptionErrors++;
                        }
                    }
                    if (item.encryptedFname) {
                        try {
                            try {
                                decryptedRecord.fname = yield (0, piiEncryption_1.decryptPII)(item.encryptedFname, opId);
                            }
                            catch (standardError) {
                                logger.info("Standard decryption failed, trying legacy decryption", {
                                    operationId: opId,
                                    recordId: item.emailHash
                                });
                                decryptedRecord.fname = yield (0, piiEncryption_1.decryptLegacyPII)(item.encryptedFname, opId);
                            }
                        }
                        catch (error) {
                            logger.error("Failed to decrypt first name", error, {
                                operationId: opId,
                                recordId: item.emailHash
                            });
                            decryptedRecord.fname = '[DECRYPTION_FAILED]';
                            decryptionErrors++;
                        }
                    }
                    if (item.encryptedLname) {
                        try {
                            try {
                                decryptedRecord.lname = yield (0, piiEncryption_1.decryptPII)(item.encryptedLname, opId);
                            }
                            catch (standardError) {
                                logger.info("Standard decryption failed, trying legacy decryption", {
                                    operationId: opId,
                                    recordId: item.emailHash
                                });
                                decryptedRecord.lname = yield (0, piiEncryption_1.decryptLegacyPII)(item.encryptedLname, opId);
                            }
                        }
                        catch (error) {
                            logger.error("Failed to decrypt last name", error, {
                                operationId: opId,
                                recordId: item.emailHash
                            });
                            decryptedRecord.lname = '[DECRYPTION_FAILED]';
                            decryptionErrors++;
                        }
                    }
                    decryptedRecords.push(decryptedRecord);
                }
                catch (error) {
                    logger.error("Failed to process record", error, {
                        operationId: opId,
                        recordId: item.emailHash
                    });
                    decryptionErrors++;
                }
            }
            const csvHeader = 'email,firstName,lastName,status,createdAt,updatedAt\n';
            const csvRows = decryptedRecords.map(record => {
                const escapeCSV = (value) => {
                    if (value === null)
                        return '';
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
            const exportResult = {
                csv: csvData,
                metadata: Object.assign({ recordCount: decryptedRecords.length, exportedAt: new Date().toISOString(), operationId: opId }, (startDate && endDate && {
                    dateRange: { startDate, endDate }
                }))
            };
            logger.info("Data export completed successfully", {
                operationId: opId,
                recordCount: decryptedRecords.length,
                decryptionErrors,
                csvLength: csvData.length
            });
            (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', true, undefined, {
                operationId: opId,
                tableName,
                recordCount: decryptedRecords.length,
                decryptionErrors,
                bulkExport: true
            });
            return exportResult;
        }
        catch (error) {
            (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', false, undefined, {
                operationId: opId,
                tableName,
                error: error instanceof Error ? error.message : 'Unknown error',
                bulkExport: true
            });
            logger.error("Data export failed", error, { operationId: opId });
            throw new Error("Data export operation failed");
        }
    });
}
function validateExportPermissions(tableName, operationId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const opId = operationId || crypto.randomUUID();
        const issues = [];
        try {
            yield docClient.send(new lib_dynamodb_1.ScanCommand({
                TableName: tableName,
                Limit: 1
            }));
            if (!process.env.AWS_REGION) {
                issues.push("AWS_REGION environment variable not configured");
            }
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
        }
        catch (error) {
            logger.error("Export permissions validation failed", error, {
                operationId: opId,
                tableName
            });
            issues.push(`Table access validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return { canExport: false, issues };
        }
    });
}
function getExportStatistics(options, operationId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const opId = operationId || crypto.randomUUID();
        const { tableName, startDate, endDate, status } = options;
        try {
            let filterExpression = '';
            const expressionAttributeNames = {};
            const expressionAttributeValues = {};
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
            const countParams = {
                TableName: tableName,
                Select: "COUNT"
            };
            if (filterExpression) {
                countParams.FilterExpression = filterExpression;
                countParams.ExpressionAttributeNames = expressionAttributeNames;
                countParams.ExpressionAttributeValues = expressionAttributeValues;
            }
            const result = yield docClient.send(new lib_dynamodb_1.ScanCommand(countParams));
            logger.info("Export statistics retrieved", {
                operationId: opId,
                tableName,
                estimatedCount: result.Count || 0
            });
            return {
                estimatedRecordCount: result.Count || 0,
            };
        }
        catch (error) {
            logger.error("Failed to get export statistics", error, {
                operationId: opId,
                tableName
            });
            return {
                estimatedRecordCount: 0
            };
        }
    });
}
