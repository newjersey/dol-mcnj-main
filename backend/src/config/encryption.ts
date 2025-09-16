/**
 * Encryption Configuration for PII Protection
 * Configures AWS KMS-based envelope encryption for sensitive data
 */

export interface EncryptionConfig {
  enabled: boolean;
  kmsKeyId?: string;
  searchSalt?: string;
  encryptedTableName?: string;
}

/**
 * Default encryption configuration based on environment variables
 */
export const encryptionConfig: EncryptionConfig = {
  enabled: process.env.ENCRYPTION_ENABLED === 'true',
  kmsKeyId: process.env.KMS_KEY_ID,
  searchSalt: process.env.SEARCH_SALT,
  encryptedTableName: process.env.ENCRYPTED_TABLE_NAME || 'signup-emails-encrypted'
};

/**
 * Validates the encryption configuration
 * Throws an error if encryption is enabled but required settings are missing
 */
export function validateEncryptionConfig(): void {
  if (!encryptionConfig.enabled) {
    // Encryption disabled - no validation needed
    return;
  }

  const errors: string[] = [];

  if (!encryptionConfig.kmsKeyId) {
    errors.push('KMS_KEY_ID environment variable is required when encryption is enabled');
  }

  if (!encryptionConfig.searchSalt) {
    errors.push('SEARCH_SALT environment variable is required when encryption is enabled');
  }

  if (!encryptionConfig.encryptedTableName) {
    errors.push('ENCRYPTED_TABLE_NAME environment variable is required when encryption is enabled');
  }

  if (errors.length > 0) {
    throw new Error(`Encryption configuration validation failed:\n${errors.join('\n')}`);
  }
}