"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEncryptionSetup = validateEncryptionSetup;
exports.validateEnvironmentConfig = validateEnvironmentConfig;
exports.getEncryptionHealthStatus = getEncryptionHealthStatus;
const tslib_1 = require("tslib");
const piiEncryption_1 = require("./piiEncryption");
const encryption_1 = require("../config/encryption");
const piiSafety_1 = require("./piiSafety");
const logger = (0, piiSafety_1.createSafeLogger)(console.log);
function validateEncryptionSetup() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            (0, encryption_1.validateEncryptionConfig)();
            if (!encryption_1.encryptionConfig.enabled) {
                logger.info("Encryption disabled - running in plaintext mode");
                return;
            }
            logger.info("Validating encryption setup", {
                keyId: encryption_1.encryptionConfig.kmsKeyId,
                hasSearchSalt: !!encryption_1.encryptionConfig.searchSalt,
                encryptedTable: encryption_1.encryptionConfig.encryptedTableName
            });
            if (!encryption_1.encryptionConfig.kmsKeyId) {
                throw new Error('KMS key ID is required when encryption is enabled');
            }
            const isKeyValid = yield (0, piiEncryption_1.validateKMSKey)(encryption_1.encryptionConfig.kmsKeyId);
            if (!isKeyValid) {
                throw new Error(`KMS key ${encryption_1.encryptionConfig.kmsKeyId} is not accessible`);
            }
            logger.info("Encryption setup validation successful", {
                keyId: encryption_1.encryptionConfig.kmsKeyId,
                encryptedTable: encryption_1.encryptionConfig.encryptedTableName
            });
        }
        catch (error) {
            logger.error("Encryption setup validation failed", error);
            throw new Error(`Encryption validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
}
function validateEnvironmentConfig() {
    const requiredVars = [
        'AWS_REGION',
        'DDB_TABLE_NAME'
    ];
    if (encryption_1.encryptionConfig.enabled) {
        requiredVars.push('KMS_KEY_ID', 'SEARCH_SALT', 'DDB_ENCRYPTED_TABLE_NAME');
    }
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    logger.info("Environment configuration validated", {
        encryptionEnabled: encryption_1.encryptionConfig.enabled,
        requiredVarsCount: requiredVars.length
    });
}
function getEncryptionHealthStatus() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const errors = [];
        let kmsKeyAccessible;
        try {
            (0, encryption_1.validateEncryptionConfig)();
            if (encryption_1.encryptionConfig.enabled) {
                if (!encryption_1.encryptionConfig.kmsKeyId) {
                    errors.push('KMS key ID is required when encryption is enabled');
                }
                else {
                    kmsKeyAccessible = yield (0, piiEncryption_1.validateKMSKey)(encryption_1.encryptionConfig.kmsKeyId);
                    if (!kmsKeyAccessible) {
                        errors.push(`KMS key ${encryption_1.encryptionConfig.kmsKeyId} not accessible`);
                    }
                }
            }
        }
        catch (error) {
            errors.push(error instanceof Error ? error.message : 'Unknown configuration error');
        }
        const status = errors.length === 0 ? 'healthy' :
            errors.length === 1 ? 'degraded' : 'unhealthy';
        return {
            status,
            encryption: {
                enabled: encryption_1.encryptionConfig.enabled,
                kmsKeyAccessible,
                configurationValid: errors.length === 0
            },
            errors
        };
    });
}
