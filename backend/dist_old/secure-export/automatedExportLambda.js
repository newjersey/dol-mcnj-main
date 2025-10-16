"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tslib_1 = require("tslib");
const client_sesv2_1 = require("@aws-sdk/client-sesv2");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto = tslib_1.__importStar(require("crypto"));
const archiver_1 = tslib_1.__importDefault(require("archiver"));
const dataExport_1 = require("../utils/dataExport");
const piiSafety_1 = require("../utils/piiSafety");
const logger = (0, piiSafety_1.createSafeLogger)(console.log);
const CONFIG = {
    FROM_EMAIL: process.env.FROM_EMAIL || 'no-reply@dol.nj.gov',
    ANALYST_EMAILS: (process.env.ANALYST_EMAILS || '').split(',').filter(Boolean),
    CC_SECURITY_EMAIL: process.env.CC_SECURITY_EMAIL,
    S3_BUCKET: process.env.EXPORT_S3_BUCKET || '',
    S3_PREFIX: 'secure-exports/',
    ZIP_PASSWORD_LENGTH: 16,
    DOWNLOAD_EXPIRY_HOURS: 24,
    ALLOWED_IP_RANGES: (process.env.ALLOWED_IP_RANGES || '').split(',').filter(Boolean),
    MAX_RECORDS_PER_EXPORT: 25000,
    EXPORT_SCHEDULE: process.env.EXPORT_SCHEDULE || 'weekly'
};
const sesClient = new client_sesv2_1.SESv2Client({ region: process.env.AWS_REGION || 'us-east-1' });
const s3Client = new client_s3_1.S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
function generateSecurePassword(length) {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
    }
    return password;
}
function createZipFile(csvData, filename) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const archive = (0, archiver_1.default)('zip', {
                zlib: { level: 9 }
            });
            const chunks = [];
            let totalSize = 0;
            archive.on('data', (chunk) => {
                chunks.push(chunk);
                totalSize += chunk.length;
            });
            archive.on('end', () => {
                console.log('Archive finalized, total size:', totalSize);
                resolve(Buffer.concat(chunks));
            });
            archive.on('error', (err) => {
                console.error('Archiving error:', err);
                reject(err);
            });
            archive.append(csvData, { name: filename });
            archive.finalize();
        });
    });
}
function uploadToS3(zipBuffer, key, expiryHours) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const uploadParams = {
            Bucket: CONFIG.S3_BUCKET,
            Key: key,
            Body: zipBuffer,
            ContentType: 'application/zip',
            ServerSideEncryption: 'AES256',
            Metadata: {
                'created-by': 'secure-export-lambda',
                'expires-at': new Date(Date.now() + (expiryHours * 60 * 60 * 1000)).toISOString()
            },
            Expires: new Date(Date.now() + (expiryHours * 60 * 60 * 1000))
        };
        yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
        const downloadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, new client_s3_1.PutObjectCommand({
            Bucket: CONFIG.S3_BUCKET,
            Key: key
        }), {
            expiresIn: expiryHours * 3600
        });
        return downloadUrl;
    });
}
function sendSecureNotification(downloadUrl, password, metadata, operationId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const subject = `[SECURE] My Career NJ Weekly Subscriber Data Export - ${new Date().toISOString().split('T')[0]}`;
        const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Secure Data Export</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .security-info { background-color: #e7f3ff; border: 1px solid #b8daff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .download-info { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff; }
        .password { font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; background-color: #f8f9fa; padding: 10px; border-radius: 3px; word-break: break-all; }
        .footer { font-size: 12px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .red { color: #dc3545; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h2>🔒 Secure Subscriber Data Export</h2>
        <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Operation ID:</strong> ${operationId}</p>
    </div>
    
    <div class="warning">
        <h3>⚠️ CONFIDENTIAL DATA - HANDLE WITH CARE</h3>
        <p class="red">This email contains access to personally identifiable information (PII). Please follow all data handling protocols.</p>
    </div>
    
    <div class="security-info">
        <h3>🛡️ Security Information</h3>
        <ul>
            <li>The attached data is password-protected and encrypted</li>
            <li>Download link expires in ${CONFIG.DOWNLOAD_EXPIRY_HOURS} hours</li>
            <li>Access is logged and monitored</li>
            <li>Do not forward this email or share the password</li>
        </ul>
    </div>
    
    <div class="download-info">
        <h3>📥 Download Information</h3>
        <p><strong>Records Exported:</strong> ${metadata.recordCount}</p>
        <p><strong>Export Range:</strong> ${metadata.dateRange || 'All available data'}</p>
        <p><strong>File Size:</strong> ${metadata.fileSizeFormatted}</p>
        
        <p><strong>Step 1:</strong> Copy the password below (click to select all):</p>
        <div class="password" onclick="this.select()" title="Click to select password">${password}</div>
        
        <p><strong>Step 2:</strong> <a href="${downloadUrl}" style="color: #007bff; text-decoration: none; font-weight: bold;">Click here to download the secure file</a></p>
        
        <p><strong>Step 3:</strong> Extract the ZIP file using the password above</p>
    </div>
    
    <div class="warning">
        <h3>📋 Data Handling Requirements</h3>
        <ul>
            <li><strong>Storage:</strong> Store files on secure, company-approved devices only</li>
            <li><strong>Sharing:</strong> Do not email, upload to cloud services, or share via messaging</li>
            <li><strong>Retention:</strong> Delete files when analysis is complete (max 30 days)</li>
            <li><strong>Issues:</strong> Report any security concerns to IT Security immediately</li>
        </ul>
    </div>
    
    <div class="footer">
        <p><strong>Important Notes:</strong></p>
        <ul>
            <li>This download link will expire on ${new Date(Date.now() + (CONFIG.DOWNLOAD_EXPIRY_HOURS * 60 * 60 * 1000)).toLocaleString()}</li>
            <li>Access attempts are logged with IP addresses and timestamps</li>
            <li>Contact IT if you experience any issues accessing the data</li>
        </ul>
        
        <p><em>This is an automated message from the Secure Data Export System. Do not reply to this email.</em></p>
    </div>
</body>
</html>`;
        const recipients = [...CONFIG.ANALYST_EMAILS];
        if (CONFIG.CC_SECURITY_EMAIL) {
            recipients.push(CONFIG.CC_SECURITY_EMAIL);
        }
        const emailParams = {
            FromEmailAddress: CONFIG.FROM_EMAIL,
            Destination: Object.assign({ ToAddresses: CONFIG.ANALYST_EMAILS }, (CONFIG.CC_SECURITY_EMAIL && { CcAddresses: [CONFIG.CC_SECURITY_EMAIL] })),
            Content: {
                Simple: {
                    Subject: {
                        Data: subject,
                        Charset: 'UTF-8'
                    },
                    Body: {
                        Html: {
                            Data: emailBody,
                            Charset: 'UTF-8'
                        },
                        Text: {
                            Data: `
SECURE DATA EXPORT NOTIFICATION

Export Date: ${new Date().toLocaleDateString()}
Operation ID: ${operationId}
Records: ${metadata.recordCount}

SECURITY NOTICE: This email provides access to encrypted PII data.

Password: ${password}
Download: ${downloadUrl}

IMPORTANT:
- Download link expires in ${CONFIG.DOWNLOAD_EXPIRY_HOURS} hours
- Use password above to extract ZIP file
- Follow all data handling protocols
- Do not forward this email

Contact IT Security with any concerns.
            `,
                            Charset: 'UTF-8'
                        }
                    }
                }
            }
        };
        yield sesClient.send(new client_sesv2_1.SendEmailCommand(emailParams));
        logger.info("Secure notification email sent", {
            operationId,
            recipientCount: recipients.length,
            expiresAt: new Date(Date.now() + (CONFIG.DOWNLOAD_EXPIRY_HOURS * 60 * 60 * 1000)).toISOString()
        });
    });
}
const handler = (event) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const operationId = crypto.randomUUID();
    try {
        logger.info("Secure export Lambda triggered", {
            operationId,
            triggerSource: event.source,
            schedule: CONFIG.EXPORT_SCHEDULE
        });
        if (!CONFIG.S3_BUCKET || CONFIG.ANALYST_EMAILS.length === 0) {
            throw new Error("Missing required configuration: S3_BUCKET or ANALYST_EMAILS");
        }
        const tableName = process.env.DDB_TABLE_NAME;
        if (!tableName) {
            throw new Error("DDB_TABLE_NAME environment variable not set");
        }
        const now = new Date();
        const exportOptions = {
            tableName,
            limit: CONFIG.MAX_RECORDS_PER_EXPORT
        };
        if (CONFIG.EXPORT_SCHEDULE === 'weekly') {
            const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            exportOptions.startDate = weekAgo.toISOString();
            exportOptions.endDate = now.toISOString();
        }
        logger.info("Starting data export", {
            operationId,
            exportOptions: Object.assign(Object.assign({}, exportOptions), { tableName: '[REDACTED]' })
        });
        const exportResult = yield (0, dataExport_1.exportSubscribersAsCSV)(exportOptions, operationId);
        const zipPassword = generateSecurePassword(CONFIG.ZIP_PASSWORD_LENGTH);
        const csvFilename = `subscribers_export_${now.toISOString().split('T')[0]}.csv`;
        logger.info("Creating secure ZIP file", { operationId, recordCount: exportResult.metadata.recordCount });
        const zipBuffer = yield createZipFile(exportResult.csv, csvFilename);
        const s3Key = `${CONFIG.S3_PREFIX}${operationId}/${csvFilename.replace('.csv', '.zip')}`;
        const downloadUrl = yield uploadToS3(zipBuffer, s3Key, CONFIG.DOWNLOAD_EXPIRY_HOURS);
        const metadata = Object.assign(Object.assign({}, exportResult.metadata), { fileSizeFormatted: `${Math.round(zipBuffer.length / 1024)} KB`, dateRange: exportOptions.startDate
                ? `${new Date(exportOptions.startDate).toLocaleDateString()} - ${new Date(exportOptions.endDate || '').toLocaleDateString()}`
                : undefined });
        yield sendSecureNotification(downloadUrl, zipPassword, metadata, operationId);
        (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', true, operationId, {
            reason: 'AUTOMATED_EXPORT',
            recordCount: exportResult.metadata.recordCount,
            deliveryMethod: 'EMAIL',
            recipients: CONFIG.ANALYST_EMAILS.length,
            expiresAt: new Date(Date.now() + (CONFIG.DOWNLOAD_EXPIRY_HOURS * 60 * 60 * 1000)).toISOString()
        });
        logger.info("Secure export completed successfully", {
            operationId,
            recordCount: exportResult.metadata.recordCount,
            recipientCount: CONFIG.ANALYST_EMAILS.length,
            fileSize: zipBuffer.length,
            expiresAt: new Date(Date.now() + (CONFIG.DOWNLOAD_EXPIRY_HOURS * 60 * 60 * 1000)).toISOString()
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                operationId,
                recordCount: exportResult.metadata.recordCount,
                message: "Secure export completed and notifications sent"
            })
        };
    }
    catch (error) {
        logger.error("Secure export failed", error, { operationId });
        (0, piiSafety_1.auditPIIOperation)('READ', 'EMAIL', false, operationId, {
            reason: 'AUTOMATED_EXPORT_FAILED',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        if (CONFIG.CC_SECURITY_EMAIL) {
            try {
                const failureEmailParams = {
                    FromEmailAddress: CONFIG.FROM_EMAIL,
                    Destination: {
                        ToAddresses: [CONFIG.CC_SECURITY_EMAIL]
                    },
                    Content: {
                        Simple: {
                            Subject: {
                                Data: `[ALERT] Secure Export Failed - ${new Date().toISOString()}`,
                                Charset: 'UTF-8'
                            },
                            Body: {
                                Text: {
                                    Data: `
Secure data export failed at ${new Date().toISOString()}

Operation ID: ${operationId}
Error: ${error instanceof Error ? error.message : 'Unknown error'}

Please investigate and ensure analysts are notified of the delay.
                  `,
                                    Charset: 'UTF-8'
                                }
                            }
                        }
                    }
                };
                yield sesClient.send(new client_sesv2_1.SendEmailCommand(failureEmailParams));
            }
            catch (emailError) {
                logger.error("Failed to send failure notification", emailError, { operationId });
            }
        }
        throw error;
    }
});
exports.handler = handler;
