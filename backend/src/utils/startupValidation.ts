/**
 * Application Startup Validation
 * Validates encryption setup during application startup
 */

import { validateKMSKey } from "./piiEncryption";
import { encryptionConfig, validateEncryptionConfig } from "../config/encryption";
import { createSafeLogger } from "./piiSafety";

const logger = createSafeLogger(console.log);

/**
 * Validates the complete encryption setup during application startup
 * Throws error if encryption is enabled but setup is invalid
 */
export async function validateEncryptionSetup(): Promise<void> {
  try {
    // Step 1: Validate configuration
    validateEncryptionConfig();
    
    if (!encryptionConfig.enabled) {
      logger.info("Encryption disabled - running in plaintext mode");
      return;
    }
    
    logger.info("Validating encryption setup", { 
      keyId: encryptionConfig.kmsKeyId,
      hasSearchSalt: !!encryptionConfig.searchSalt,
      encryptedTable: encryptionConfig.encryptedTableName
    });
    
    // Step 2: Validate KMS key access
    if (!encryptionConfig.kmsKeyId) {
      throw new Error('KMS key ID is required when encryption is enabled');
    }
    
    const isKeyValid = await validateKMSKey(encryptionConfig.kmsKeyId);
    if (!isKeyValid) {
      throw new Error(`KMS key ${encryptionConfig.kmsKeyId} is not accessible`);
    }
    
    // Step 3: Log successful validation
    logger.info("Encryption setup validation successful", { 
      keyId: encryptionConfig.kmsKeyId,
      encryptedTable: encryptionConfig.encryptedTableName
    });
    
  } catch (error) {
    logger.error("Encryption setup validation failed", error);
    throw new Error(`Encryption validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validates environment configuration without checking KMS access
 * Useful for basic configuration checks
 */
export function validateEnvironmentConfig(): void {
  const requiredVars = [
    'AWS_REGION',
    'DDB_TABLE_NAME'
  ];
  
  if (encryptionConfig.enabled) {
    requiredVars.push(
      'KMS_KEY_ID',
      'SEARCH_SALT',
      'DDB_ENCRYPTED_TABLE_NAME'
    );
  }
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  logger.info("Environment configuration validated", {
    encryptionEnabled: encryptionConfig.enabled,
    requiredVarsCount: requiredVars.length
  });
}

/**
 * Pre-deployment health check
 * Returns detailed status for monitoring systems
 */
export async function getEncryptionHealthStatus(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  encryption: {
    enabled: boolean;
    kmsKeyAccessible?: boolean;
    configurationValid: boolean;
  };
  errors: string[];
}> {
  const errors: string[] = [];
  let kmsKeyAccessible: boolean | undefined;
  
  try {
    // Check configuration
    validateEncryptionConfig();
    
    // Check KMS access if encryption enabled
    if (encryptionConfig.enabled) {
      if (!encryptionConfig.kmsKeyId) {
        errors.push('KMS key ID is required when encryption is enabled');
      } else {
        kmsKeyAccessible = await validateKMSKey(encryptionConfig.kmsKeyId);
        if (!kmsKeyAccessible) {
          errors.push(`KMS key ${encryptionConfig.kmsKeyId} not accessible`);
        }
      }
    }
    
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown configuration error');
  }
  
  const status = errors.length === 0 ? 'healthy' : 
                 errors.length === 1 ? 'degraded' : 'unhealthy';
  
  return {
    status,
    encryption: {
      enabled: encryptionConfig.enabled,
      kmsKeyAccessible,
      configurationValid: errors.length === 0
    },
    errors
  };
}