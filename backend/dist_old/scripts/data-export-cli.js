#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dataExport_1 = require("../utils/dataExport");
const crypto = tslib_1.__importStar(require("crypto"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const os = tslib_1.__importStar(require("os"));
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .name('data-export')
    .description('Secure CLI tool for exporting encrypted subscriber data')
    .version('1.0.0');
function validateSecureEnvironment() {
    const issues = [];
    if (!process.env.DDB_TABLE_NAME) {
        issues.push("DDB_TABLE_NAME environment variable not set");
    }
    if (!process.env.KMS_KEY_ID) {
        issues.push("KMS_KEY_ID environment variable not set");
    }
    if (!process.env.AWS_REGION) {
        issues.push("AWS_REGION environment variable not set");
    }
    if (process.env.PORT || process.env.HTTP_PORT) {
        issues.push("This tool should not be run in a web server environment");
    }
    if (process.platform !== 'win32' && process.getuid && process.getuid() === 0) {
        issues.push("This tool should not be run as root for security reasons");
    }
    const auditLogDir = process.env.AUDIT_LOG_DIR || '/var/log/data-export';
    if (!fs.existsSync(auditLogDir)) {
        try {
            fs.mkdirSync(auditLogDir, { recursive: true, mode: 0o750 });
        }
        catch (_a) {
            issues.push(`Cannot create audit log directory: ${auditLogDir}`);
        }
    }
    return {
        isSecure: issues.length === 0,
        issues
    };
}
function createSecureOutputFile(filename) {
    const outputDir = process.env.EXPORT_OUTPUT_DIR || '/tmp/secure-exports';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true, mode: 0o700 });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const secureFilename = `${filename}_${timestamp}.csv`;
    const fullPath = path.join(outputDir, secureFilename);
    fs.writeFileSync(fullPath, '', { mode: 0o600 });
    return fullPath;
}
function logExportOperation(operationId, operation, success, details) {
    const auditLogDir = process.env.AUDIT_LOG_DIR || '/var/log/data-export';
    const auditLogFile = path.join(auditLogDir, 'export-audit.log');
    const auditEntry = Object.assign({ timestamp: new Date().toISOString(), operationId,
        operation,
        success, user: process.env.USER || 'unknown', pid: process.pid, hostname: os.hostname() }, details);
    fs.appendFileSync(auditLogFile, JSON.stringify(auditEntry) + '\n', { mode: 0o640 });
}
program
    .command('export')
    .description('Export subscriber data to CSV file')
    .option('-l, --limit <number>', 'Maximum number of records to export', '1000')
    .option('-s, --start-date <date>', 'Start date filter (ISO format)')
    .option('-e, --end-date <date>', 'End date filter (ISO format)')
    .option('--status <status>', 'Filter by subscription status')
    .option('-o, --output <filename>', 'Output filename prefix', 'subscribers_export')
    .option('--dry-run', 'Show statistics without performing export')
    .action((options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const operationId = crypto.randomUUID();
    console.log(`Starting data export operation: ${operationId}`);
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
        logExportOperation(operationId, 'EXPORT_START', true, {
            limit,
            startDate: options.startDate,
            endDate: options.endDate,
            status: options.status,
            dryRun: options.dryRun
        });
        const exportOptions = Object.assign(Object.assign(Object.assign({ tableName,
            limit }, (options.startDate && { startDate: options.startDate })), (options.endDate && { endDate: options.endDate })), (options.status && { status: options.status }));
        console.log('📊 Getting export statistics...');
        const stats = yield (0, dataExport_1.getExportStatistics)(exportOptions, operationId);
        console.log(`📈 Export Statistics:`);
        console.log(`  - Estimated records: ${stats.estimatedRecordCount}`);
        console.log(`  - Records to export: ${Math.min(stats.estimatedRecordCount, limit)}`);
        if (options.dryRun) {
            console.log('🔍 Dry run completed - no data exported');
            logExportOperation(operationId, 'DRY_RUN', true, { estimatedRecordCount: stats.estimatedRecordCount });
            return;
        }
        console.log('🔐 Validating export permissions...');
        const permissionCheck = yield (0, dataExport_1.validateExportPermissions)(tableName, operationId);
        if (!permissionCheck.canExport) {
            console.error('❌ Export permissions validation failed:');
            permissionCheck.issues.forEach(issue => console.error(`  - ${issue}`));
            logExportOperation(operationId, 'PERMISSION_CHECK', false, { issues: permissionCheck.issues });
            process.exit(1);
        }
        console.log('✅ Export permissions validated');
        console.log('🔄 Starting data export and decryption...');
        const result = yield (0, dataExport_1.exportSubscribersAsCSV)(exportOptions, operationId);
        const outputPath = createSecureOutputFile(options.output);
        fs.writeFileSync(outputPath, result.csv);
        console.log('✅ Export completed successfully');
        console.log(`📁 Output file: ${outputPath}`);
        console.log(`📊 Records exported: ${result.metadata.recordCount}`);
        console.log(`🕒 Export time: ${result.metadata.exportedAt}`);
        logExportOperation(operationId, 'EXPORT_SUCCESS', true, {
            recordCount: result.metadata.recordCount,
            outputPath,
            fileSize: result.csv.length
        });
        console.log('\n🔒 SECURITY REMINDER:');
        console.log('  - The exported file contains decrypted PII data');
        console.log('  - File has restricted permissions (600)');
        console.log('  - Delete the file when no longer needed');
        console.log('  - Do not transfer over insecure channels');
    }
    catch (error) {
        console.error('❌ Export failed:', error instanceof Error ? error.message : 'Unknown error');
        logExportOperation(operationId, 'EXPORT_FAILED', false, {
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        process.exit(1);
    }
}));
program
    .command('validate')
    .description('Validate export system configuration and permissions')
    .action(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const operationId = crypto.randomUUID();
    console.log(`Validating export system: ${operationId}`);
    const envCheck = validateSecureEnvironment();
    console.log('\n🔧 Environment Check:');
    if (envCheck.isSecure) {
        console.log('✅ Environment is secure');
    }
    else {
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
        const permissionCheck = yield (0, dataExport_1.validateExportPermissions)(tableName, operationId);
        if (permissionCheck.canExport) {
            console.log('✅ Export permissions validated');
        }
        else {
            console.log('❌ Permission issues found:');
            permissionCheck.issues.forEach(issue => console.log(`  - ${issue}`));
        }
        console.log('\n📊 System Status:');
        console.log(`  - Table: ${tableName}`);
        console.log(`  - KMS Key: ${process.env.KMS_KEY_ID}`);
        console.log(`  - AWS Region: ${process.env.AWS_REGION}`);
        logExportOperation(operationId, 'VALIDATION', true, {
            environmentSecure: envCheck.isSecure,
            permissionsValid: permissionCheck.canExport
        });
        if (!permissionCheck.canExport) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error('❌ Validation failed:', error instanceof Error ? error.message : 'Unknown error');
        logExportOperation(operationId, 'VALIDATION_FAILED', false, {
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        process.exit(1);
    }
}));
program
    .command('stats')
    .description('Show table statistics without exporting data')
    .option('-s, --start-date <date>', 'Start date filter (ISO format)')
    .option('-e, --end-date <date>', 'End date filter (ISO format)')
    .option('--status <status>', 'Filter by subscription status')
    .action((options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const operationId = crypto.randomUUID();
    try {
        const tableName = process.env.DDB_TABLE_NAME;
        if (!tableName) {
            console.error('❌ DDB_TABLE_NAME environment variable not set');
            process.exit(1);
        }
        const exportOptions = Object.assign(Object.assign(Object.assign({ tableName }, (options.startDate && { startDate: options.startDate })), (options.endDate && { endDate: options.endDate })), (options.status && { status: options.status }));
        console.log('📊 Getting table statistics...');
        const stats = yield (0, dataExport_1.getExportStatistics)(exportOptions, operationId);
        console.log('\n📈 Table Statistics:');
        console.log(`  - Total records: ${stats.estimatedRecordCount}`);
        if (options.startDate || options.endDate) {
            console.log(`  - Date range: ${options.startDate || 'beginning'} to ${options.endDate || 'now'}`);
        }
        if (options.status) {
            console.log(`  - Status filter: ${options.status}`);
        }
        logExportOperation(operationId, 'STATS', true, { estimatedRecordCount: stats.estimatedRecordCount });
    }
    catch (error) {
        console.error('❌ Failed to get statistics:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}));
program.parse();
