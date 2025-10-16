"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptionConfig = void 0;
exports.validateEncryptionConfig = validateEncryptionConfig;
exports.encryptionConfig = {
    enabled: process.env.ENCRYPTION_ENABLED === 'true',
    kmsKeyId: process.env.KMS_KEY_ID,
    searchSalt: process.env.SEARCH_SALT,
    encryptedTableName: process.env.ENCRYPTED_TABLE_NAME || 'signup-emails-encrypted'
};
function validateEncryptionConfig() {
    if (!exports.encryptionConfig.enabled) {
        return;
    }
    const errors = [];
    if (!exports.encryptionConfig.kmsKeyId) {
        errors.push('KMS_KEY_ID environment variable is required when encryption is enabled');
    }
    if (!exports.encryptionConfig.searchSalt) {
        errors.push('SEARCH_SALT environment variable is required when encryption is enabled');
    }
    if (!exports.encryptionConfig.encryptedTableName) {
        errors.push('ENCRYPTED_TABLE_NAME environment variable is required when encryption is enabled');
    }
    if (errors.length > 0) {
        throw new Error(`Encryption configuration validation failed:\n${errors.join('\n')}`);
    }
}
