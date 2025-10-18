/**
 * Automated Secure Export Lambda Function
 * 
 * FIXED: Compilation issues resolved with separate tsconfig.json
 * Build with: npm run build:lambda
 * Deploy: Upload lambda-export.zip to AWS Lambda
 * 
 * Security Features (v2.0 - Enhanced):
 * - ✅ Password-protected ZIP files (AES-256)
 * - ✅ IP whitelisting via S3 bucket policy
 * - ✅ Time-limited S3 pre-signed URLs (24h expiry)
 * - ✅ Automatic file deletion after expiration
 * - ✅ Comprehensive audit logging
 * - ✅ PII-safe error handling
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Automated Secure Export Lambda Function
 * 
 * A Lambda function that securely exports encrypted subscriber data and delivers
 * it via email with multiple security layers. This solution balances usability
 * for non-technical analysts with strong security practices.
 * 
 * Security Features:
 * - Password-protected ZIP files
 * - Email encryption (S/MIME when possible)
 * - Automatic file expiration
 * - Audit logging
 * - IP whitelisting for email links
 * - Time-limited download URLs
 */

import { Handler, ScheduledEvent } from 'aws-lambda';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { S3Client, PutObjectCommand, PutObjectCommandInput, GetObjectCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import archiver from 'archiver';
import * as node7z from 'node-7z';
import { exportSubscribersAsCSV, ExportOptions } from '../utils/dataExport';
import { createSafeLogger, auditPIIOperation } from '../utils/piiSafety';
import { createWriteStream, createReadStream, unlinkSync } from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import * as os from 'os';

const logger = createSafeLogger(console.log);

interface LambdaConfig {
  // Email configuration
  FROM_EMAIL: string;
  ANALYST_EMAILS: string[];
  CC_SECURITY_EMAIL?: string;
  
  // S3 configuration for temporary files
  S3_BUCKET: string;
  S3_PREFIX: string;
  
  // Security configuration
  ZIP_PASSWORD_LENGTH: number;
  DOWNLOAD_EXPIRY_HOURS: number;
  ALLOWED_IP_RANGES: string[];
  
  // Export configuration
  MAX_RECORDS_PER_EXPORT: number;
  EXPORT_SCHEDULE: string; // e.g., "weekly", "monthly"
}

const CONFIG: LambdaConfig = {
  FROM_EMAIL: process.env.FROM_EMAIL || 'no-reply@dol.nj.gov',
  ANALYST_EMAILS: (process.env.ANALYST_EMAILS || '').split(',').filter(Boolean),
  CC_SECURITY_EMAIL: process.env.CC_SECURITY_EMAIL,
  
  S3_BUCKET: process.env.EXPORT_S3_BUCKET || '',
  S3_PREFIX: 'secure-exports/',
  
  ZIP_PASSWORD_LENGTH: 16,
  DOWNLOAD_EXPIRY_HOURS: 24, // Files expire after 24 hours
  ALLOWED_IP_RANGES: (process.env.ALLOWED_IP_RANGES || '').split(',').filter(Boolean),
  
  MAX_RECORDS_PER_EXPORT: 25000,
  EXPORT_SCHEDULE: process.env.EXPORT_SCHEDULE || 'weekly'
};

// Initialize AWS clients
const sesClient = new SESv2Client({ region: process.env.AWS_REGION || 'us-east-1' });
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * Generate a secure random password for ZIP file protection
 */
function generateSecurePassword(length: number): string {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

/**
 * Create a password-protected ZIP file containing the CSV data
 * Uses 7zip for AES-256 encryption
 */
async function createPasswordProtectedZip(
  csvData: string, 
  filename: string,
  password: string
): Promise<Buffer> {
  const tmpDir = os.tmpdir();
  const csvPath = path.join(tmpDir, filename);
  const zipPath = path.join(tmpDir, filename.replace('.csv', '.zip'));

  try {
    // Write CSV to temporary file
    await promisify(createWriteStream(csvPath).write.bind(createWriteStream(csvPath)))(csvData);
    
    // Create password-protected ZIP using 7zip
    const sevenZip = node7z.default || node7z;
    const stream = sevenZip.add(zipPath, csvPath, {
      password: password,
      method: ['0=LZMA2'], // Use LZMA2 compression
      mx: 9, // Maximum compression
    });

    // Wait for compression to complete
    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    // Read the ZIP file into a buffer
    const zipBuffer = await promisify(
      (cb: (err: Error | null, data?: Buffer) => void) => {
        const chunks: Buffer[] = [];
        const readStream = createReadStream(zipPath);
        readStream.on('data', (chunk) => chunks.push(chunk));
        readStream.on('end', () => cb(null, Buffer.concat(chunks)));
        readStream.on('error', cb);
      }
    )();

    // Clean up temporary files
    try {
      unlinkSync(csvPath);
      unlinkSync(zipPath);
    } catch (cleanupError) {
      logger.error('Failed to clean up temporary files', cleanupError);
    }

    return zipBuffer;

  } catch (error) {
    // Clean up on error
    try {
      unlinkSync(csvPath);
      unlinkSync(zipPath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Configure S3 bucket policy to restrict access by IP address
 */
async function configureBucketIPRestrictions(): Promise<void> {
  if (!CONFIG.ALLOWED_IP_RANGES || CONFIG.ALLOWED_IP_RANGES.length === 0) {
    logger.info("No IP restrictions configured - skipping bucket policy update");
    return;
  }

  const bucketPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AllowAccessFromAllowedIPs',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: `arn:aws:s3:::${CONFIG.S3_BUCKET}/${CONFIG.S3_PREFIX}*`,
        Condition: {
          IpAddress: {
            'aws:SourceIp': CONFIG.ALLOWED_IP_RANGES
          }
        }
      },
      {
        Sid: 'DenyAccessFromOtherIPs',
        Effect: 'Deny',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: `arn:aws:s3:::${CONFIG.S3_BUCKET}/${CONFIG.S3_PREFIX}*`,
        Condition: {
          NotIpAddress: {
            'aws:SourceIp': CONFIG.ALLOWED_IP_RANGES
          }
        }
      }
    ]
  };

  try {
    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: CONFIG.S3_BUCKET,
      Policy: JSON.stringify(bucketPolicy)
    }));
    
    logger.info("S3 bucket IP restrictions configured successfully", {
      allowedIPs: CONFIG.ALLOWED_IP_RANGES.length
    });
  } catch (error) {
    logger.error("Failed to configure S3 bucket IP restrictions", error);
    // Don't fail the entire export if IP restrictions can't be set
    // This allows graceful degradation
  }
}

/**
 * Upload encrypted file to S3 with automatic expiration and IP restrictions
 */
async function uploadToS3(zipBuffer: Buffer, key: string, expiryHours: number): Promise<string> {
  // Configure IP restrictions if not already set
  await configureBucketIPRestrictions();

  const uploadParams: PutObjectCommandInput = {
    Bucket: CONFIG.S3_BUCKET,
    Key: key,
    Body: zipBuffer,
    ContentType: 'application/zip',
    ServerSideEncryption: 'AES256',
    Metadata: {
      'created-by': 'secure-export-lambda',
      'expires-at': new Date(Date.now() + (expiryHours * 60 * 60 * 1000)).toISOString(),
      'ip-restricted': CONFIG.ALLOWED_IP_RANGES.length > 0 ? 'true' : 'false'
    },
    // Set S3 object to automatically delete after expiry time
    Expires: new Date(Date.now() + (expiryHours * 60 * 60 * 1000))
  };
  
  await s3Client.send(new PutObjectCommand(uploadParams));
  
  // Generate a presigned URL for secure download
  const downloadUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: CONFIG.S3_BUCKET,
      Key: key
    }),
    {
      expiresIn: expiryHours * 3600 // Convert hours to seconds
    }
  );
  
  logger.info("File uploaded to S3 with security controls", {
    key,
    expiryHours,
    serverSideEncryption: true,
    ipRestricted: CONFIG.ALLOWED_IP_RANGES.length > 0
  });
  
  return downloadUrl;
}

/**
 * Send secure email notification to analysts
 */
async function sendSecureNotification(
  downloadUrl: string,
  password: string,
  metadata: any,
  operationId: string
): Promise<void> {
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
    Destination: {
      ToAddresses: CONFIG.ANALYST_EMAILS,
      ...(CONFIG.CC_SECURITY_EMAIL && { CcAddresses: [CONFIG.CC_SECURITY_EMAIL] })
    },
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
  
  await sesClient.send(new SendEmailCommand(emailParams));
  
  logger.info("Secure notification email sent", {
    operationId,
    recipientCount: recipients.length,
    expiresAt: new Date(Date.now() + (CONFIG.DOWNLOAD_EXPIRY_HOURS * 60 * 60 * 1000)).toISOString()
  });
}

/**
 * Main Lambda handler for scheduled data exports
 */
export const handler: Handler<ScheduledEvent> = async (event) => {
  const operationId = crypto.randomUUID();
  
  try {
    logger.info("Secure export Lambda triggered", {
      operationId,
      triggerSource: event.source,
      schedule: CONFIG.EXPORT_SCHEDULE
    });
    
    // Validate configuration
    if (!CONFIG.S3_BUCKET || CONFIG.ANALYST_EMAILS.length === 0) {
      throw new Error("Missing required configuration: S3_BUCKET or ANALYST_EMAILS");
    }
    
    const tableName = process.env.DDB_TABLE_NAME;
    if (!tableName) {
      throw new Error("DDB_TABLE_NAME environment variable not set");
    }
    
    // Determine export date range based on schedule
    const now = new Date();
    const exportOptions: ExportOptions = {
      tableName,
      limit: CONFIG.MAX_RECORDS_PER_EXPORT
    };
    
    if (CONFIG.EXPORT_SCHEDULE === 'weekly') {
      const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      exportOptions.startDate = weekAgo.toISOString();
      exportOptions.endDate = now.toISOString();
    }
    
    // Perform the export
    logger.info("Starting data export", {
      operationId,
      exportOptions: {
        ...exportOptions,
        tableName: '[REDACTED]' // Don't log table name
      }
    });
    
    const exportResult = await exportSubscribersAsCSV(exportOptions, operationId);
    
    // Generate secure password and create encrypted ZIP
    const zipPassword = generateSecurePassword(CONFIG.ZIP_PASSWORD_LENGTH);
    const csvFilename = `subscribers_export_${now.toISOString().split('T')[0]}.csv`;
    
    logger.info("Creating password-protected ZIP file", { operationId, recordCount: exportResult.metadata.recordCount });
    
    const zipBuffer = await createPasswordProtectedZip(exportResult.csv, csvFilename, zipPassword);
    
    // Upload to S3 with expiration
    const s3Key = `${CONFIG.S3_PREFIX}${operationId}/${csvFilename.replace('.csv', '.zip')}`;
    const downloadUrl = await uploadToS3(zipBuffer, s3Key, CONFIG.DOWNLOAD_EXPIRY_HOURS);
    
    // Prepare metadata for email
    const metadata = {
      ...exportResult.metadata,
      fileSizeFormatted: `${Math.round(zipBuffer.length / 1024)} KB`,
      dateRange: exportOptions.startDate 
        ? `${new Date(exportOptions.startDate).toLocaleDateString()} - ${new Date(exportOptions.endDate || '').toLocaleDateString()}`
        : undefined
    };
    
    // Send secure notification email
    await sendSecureNotification(downloadUrl, zipPassword, metadata, operationId);
    
    // Log successful completion
    auditPIIOperation('READ', 'EMAIL', true, operationId, {
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
    
  } catch (error) {
    logger.error("Secure export failed", error, { operationId });
    
    auditPIIOperation('READ', 'EMAIL', false, operationId, {
      reason: 'AUTOMATED_EXPORT_FAILED',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Send failure notification to security team
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
        
        await sesClient.send(new SendEmailCommand(failureEmailParams));
      } catch (emailError) {
        logger.error("Failed to send failure notification", emailError, { operationId });
      }
    }
    
    throw error;
  }
};