#!/usr/bin/env node

/**
 * Secure Data Export CLI Tool
 * 
 * This is a command-line tool for authorized system administrators
 * to export encrypted subscriber data. This tool should ONLY be run
 * on secure servers with proper access controls.
 * 
 * Security Features:
 * - Requires direct server access (not web-accessible)
 * - Comprehensive audit logging
 * - Secure file output with restricted permissions
 * - Environment validation
 * - Operation tracking
 */

import { exportSubscribersAsCSV, validateExportPermissions, getExportStatistics, ExportOptions } from "../utils/dataExport";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Command } from "commander";

// Initialize CLI
const program = new Command();

program
  .name('data-export')
  .description('Secure CLI tool for exporting encrypted subscriber data')
  .version('1.0.0');

/**
 * Validates that the tool is being run in a secure environment
 */
function validateSecureEnvironment(): { isSecure: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check required environment variables
  if (!process.env.DDB_TABLE_NAME) {
    issues.push("DDB_TABLE_NAME environment variable not set");
  }
  
  if (!process.env.KMS_KEY_ID) {
    issues.push("KMS_KEY_ID environment variable not set");
  }
  
  if (!process.env.AWS_REGION) {
    issues.push("AWS_REGION environment variable not set");
  }
  
  // Check that we're not in a web environment
  if (process.env.PORT || process.env.HTTP_PORT) {
    issues.push("This tool should not be run in a web server environment");
  }
  
  // Ensure we're running as a privileged user (on Unix systems)
  if (process.platform !== 'win32' && process.getuid && process.getuid() === 0) {
    issues.push("This tool should not be run as root for security reasons");
  }
  
  // Check for audit log directory
  const auditLogDir = process.env.AUDIT_LOG_DIR || '/var/log/data-export';
  if (!fs.existsSync(auditLogDir)) {
    try {
      fs.mkdirSync(auditLogDir, { recursive: true, mode: 0o750 });
    } catch (error) {
      issues.push(`Cannot create audit log directory: ${auditLogDir}`);
    }
  }
  
  return {
    isSecure: issues.length === 0,
    issues
  };
}

/**
 * Creates a secure output file with restricted permissions
 */
function createSecureOutputFile(filename: string): string {
  const outputDir = process.env.EXPORT_OUTPUT_DIR || '/tmp/secure-exports';
  
  // Ensure output directory exists with secure permissions
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true, mode: 0o700 });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const secureFilename = `${filename}_${timestamp}.csv`;
  const fullPath = path.join(outputDir, secureFilename);
  
  // Create file with restricted permissions (owner read/write only)
  fs.writeFileSync(fullPath, '', { mode: 0o600 });
  
  return fullPath;
}

/**
 * Log export operation to audit trail
 */
function logExportOperation(
  operationId: string,
  operation: string,
  success: boolean,
  details: Record<string, unknown>
) {
  const auditLogDir = process.env.AUDIT_LOG_DIR || '/var/log/data-export';
  const auditLogFile = path.join(auditLogDir, 'export-audit.log');
  
  const auditEntry = {
    timestamp: new Date().toISOString(),
    operationId,
    operation,
    success,
    user: process.env.USER || 'unknown',
    pid: process.pid,
    hostname: os.hostname(),
    ...details
  };
  
  fs.appendFileSync(auditLogFile, JSON.stringify(auditEntry) + '\n', { mode: 0o640 });
}

// Export command
program
  .command('export')
  .description('Export subscriber data to CSV file')
  .option('-l, --limit <number>', 'Maximum number of records to export', '1000')
  .option('-s, --start-date <date>', 'Start date filter (ISO format)')
  .option('-e, --end-date <date>', 'End date filter (ISO format)')
  .option('--status <status>', 'Filter by subscription status')
  .option('-o, --output <filename>', 'Output filename prefix', 'subscribers_export')
  .option('--dry-run', 'Show statistics without performing export')
  .action(async (options) => {
    const operationId = crypto.randomUUID();
    
    console.log(`Starting data export operation: ${operationId}`);
    
    // Validate secure environment
    const envCheck = validateSecureEnvironment();
    if (!envCheck.isSecure) {
      console.error('❌ Security validation failed:');
      envCheck.issues.forEach(issue => console.error(`  - ${issue}`));
      process.exit(1);
    }
    
    console.log('✅ Security environment validated');
    
    try {
      const tableName = process.env.DDB_TABLE_NAME;
      if (!tableName) {
        console.error('❌ DDB_TABLE_NAME environment variable not set');
        process.exit(1);
      }
      
      const limit = parseInt(options.limit);
      
      if (limit > 50000) {
        console.error('❌ Export limit cannot exceed 50,000 records for security reasons');
        process.exit(1);
      }
      
      // Log operation start
      logExportOperation(operationId, 'EXPORT_START', true, {
        limit,
        startDate: options.startDate,
        endDate: options.endDate,
        status: options.status,
        dryRun: options.dryRun
      });
      
      const exportOptions: ExportOptions = {
        tableName,
        limit,
        ...(options.startDate && { startDate: options.startDate }),
        ...(options.endDate && { endDate: options.endDate }),
        ...(options.status && { status: options.status })
      };
      
      // Get statistics first
      console.log('📊 Getting export statistics...');
      const stats = await getExportStatistics(exportOptions, operationId);
      
      console.log(`📈 Export Statistics:`);
      console.log(`  - Estimated records: ${stats.estimatedRecordCount}`);
      console.log(`  - Records to export: ${Math.min(stats.estimatedRecordCount, limit)}`);
      
      if (options.dryRun) {
        console.log('🔍 Dry run completed - no data exported');
        logExportOperation(operationId, 'DRY_RUN', true, { estimatedRecordCount: stats.estimatedRecordCount });
        return;
      }
      
      // Validate export permissions
      console.log('🔐 Validating export permissions...');
      const permissionCheck = await validateExportPermissions(tableName, operationId);
      if (!permissionCheck.canExport) {
        console.error('❌ Export permissions validation failed:');
        permissionCheck.issues.forEach(issue => console.error(`  - ${issue}`));
        
        logExportOperation(operationId, 'PERMISSION_CHECK', false, { issues: permissionCheck.issues });
        process.exit(1);
      }
      
      console.log('✅ Export permissions validated');
      
      // Perform the export
      console.log('🔄 Starting data export and decryption...');
      const result = await exportSubscribersAsCSV(exportOptions, operationId);
      
      // Create secure output file
      const outputPath = createSecureOutputFile(options.output);
      fs.writeFileSync(outputPath, result.csv);
      
      console.log('✅ Export completed successfully');
      console.log(`📁 Output file: ${outputPath}`);
      console.log(`📊 Records exported: ${result.metadata.recordCount}`);
      console.log(`🕒 Export time: ${result.metadata.exportedAt}`);
      
      // Log successful operation
      logExportOperation(operationId, 'EXPORT_SUCCESS', true, {
        recordCount: result.metadata.recordCount,
        outputPath,
        fileSize: result.csv.length
      });
      
      // Security reminder
      console.log('\n🔒 SECURITY REMINDER:');
      console.log('  - The exported file contains decrypted PII data');
      console.log('  - File has restricted permissions (600)');
      console.log('  - Delete the file when no longer needed');
      console.log('  - Do not transfer over insecure channels');
      
    } catch (error) {
      console.error('❌ Export failed:', error instanceof Error ? error.message : 'Unknown error');
      
      logExportOperation(operationId, 'EXPORT_FAILED', false, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate')
  .description('Validate export system configuration and permissions')
  .action(async () => {
    const operationId = crypto.randomUUID();
    
    console.log(`Validating export system: ${operationId}`);
    
    // Check environment
    const envCheck = validateSecureEnvironment();
    
    console.log('\n🔧 Environment Check:');
    if (envCheck.isSecure) {
      console.log('✅ Environment is secure');
    } else {
      console.log('❌ Environment issues found:');
      envCheck.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (!envCheck.isSecure) {
      process.exit(1);
    }
    
    try {
      const tableName = process.env.DDB_TABLE_NAME;
      if (!tableName) {
        console.error('❌ DDB_TABLE_NAME environment variable not set');
        process.exit(1);
      }
      
      console.log('\n🔐 Permission Check:');
      const permissionCheck = await validateExportPermissions(tableName, operationId);
      
      if (permissionCheck.canExport) {
        console.log('✅ Export permissions validated');
      } else {
        console.log('❌ Permission issues found:');
        permissionCheck.issues.forEach(issue => console.log(`  - ${issue}`));
      }
      
      console.log('\n📊 System Status:');
      console.log(`  - Table: ${tableName}`);
      console.log(`  - KMS Key: ${process.env.KMS_KEY_ID}`);
      console.log(`  - AWS Region: ${process.env.AWS_REGION}`);
      
      // Log validation
      logExportOperation(operationId, 'VALIDATION', true, {
        environmentSecure: envCheck.isSecure,
        permissionsValid: permissionCheck.canExport
      });
      
      if (!permissionCheck.canExport) {
        process.exit(1);
      }
      
    } catch (error) {
      console.error('❌ Validation failed:', error instanceof Error ? error.message : 'Unknown error');
      
      logExportOperation(operationId, 'VALIDATION_FAILED', false, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      process.exit(1);
    }
  });

// Stats command
program
  .command('stats')
  .description('Show table statistics without exporting data')
  .option('-s, --start-date <date>', 'Start date filter (ISO format)')
  .option('-e, --end-date <date>', 'End date filter (ISO format)')
  .option('--status <status>', 'Filter by subscription status')
  .action(async (options) => {
    const operationId = crypto.randomUUID();
    
    try {
      const tableName = process.env.DDB_TABLE_NAME;
      if (!tableName) {
        console.error('❌ DDB_TABLE_NAME environment variable not set');
        process.exit(1);
      }
      
      const exportOptions: ExportOptions = {
        tableName,
        ...(options.startDate && { startDate: options.startDate }),
        ...(options.endDate && { endDate: options.endDate }),
        ...(options.status && { status: options.status })
      };
      
      console.log('📊 Getting table statistics...');
      const stats = await getExportStatistics(exportOptions, operationId);
      
      console.log('\n📈 Table Statistics:');
      console.log(`  - Total records: ${stats.estimatedRecordCount}`);
      if (options.startDate || options.endDate) {
        console.log(`  - Date range: ${options.startDate || 'beginning'} to ${options.endDate || 'now'}`);
      }
      if (options.status) {
        console.log(`  - Status filter: ${options.status}`);
      }
      
      logExportOperation(operationId, 'STATS', true, { estimatedRecordCount: stats.estimatedRecordCount });
      
    } catch (error) {
      console.error('❌ Failed to get statistics:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();