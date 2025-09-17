/**
 * PII Encryption Utilities
 * 
 * Provides client-side application-level encryption for PII data using:
 * - AES-256-GCM for symmetric encryption
 * - AWS KMS for key management (envelope encryption)
 * - Deterministic encryption for searchable fields
 * - Secure key derivation and rotation
 */

import * as crypto from "crypto";
import { KMSClient, DecryptCommand, GenerateDataKeyCommand } from "@aws-sdk/client-kms";
import { createSafeLogger, auditPIIOperation } from "./piiSafety";

const logger = createSafeLogger(console.log);

// Initialize KMS client
const kmsClient = new KMSClient({ 
  region: process.env.AWS_REGION || "us-east-1",
  logger: undefined, // Disable logging to prevent key exposure
});

// Configuration constants
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128-bit IV for GCM

export interface EncryptedData {
  encryptedData: string; // Base64 encoded encrypted data
  encryptedKey: string;  // Base64 encoded KMS-encrypted data key
  iv: string;           // Base64 encoded initialization vector
  tag: string;          // Base64 encoded authentication tag
  keyId: string;        // KMS key ID used
  algorithm: string;    // Encryption algorithm
  version: number;      // Schema version for future compatibility
}

export interface SearchableEncryptedData {
  encrypted: EncryptedData;
  searchHash: string;   // Deterministic hash for searching
}

/**
 * Encrypts PII data using envelope encryption with AWS KMS
 */
export async function encryptPII(
  plaintext: string, 
  kmsKeyId: string,
  operationId?: string
): Promise<EncryptedData> {
  const opId = operationId || crypto.randomUUID();
  
  try {
    // Validate inputs
    if (!plaintext || typeof plaintext !== 'string') {
      throw new Error("Invalid plaintext data");
    }
    
    if (!kmsKeyId) {
      throw new Error("KMS Key ID is required");
    }

    // Generate data key using KMS
    logger.info("Generating data key for PII encryption", { operationId: opId });
    
    const dataKeyCommand = new GenerateDataKeyCommand({
      KeyId: kmsKeyId,
      KeySpec: "AES_256"
    });
    
    const { Plaintext: dataKey, CiphertextBlob } = await kmsClient.send(dataKeyCommand);
    
    if (!dataKey || !CiphertextBlob) {
      throw new Error("Failed to generate data key");
    }

    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, dataKey, iv);
    cipher.setAAD(Buffer.from(opId)); // Use operation ID as additional authenticated data
    
    // Encrypt the data
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get authentication tag
    const tag = cipher.getAuthTag();
    
    // Clear the plaintext data key from memory (security best practice)
    dataKey.fill(0);
    
    const result: EncryptedData = {
      encryptedData: encrypted,
      encryptedKey: Buffer.from(CiphertextBlob).toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
      keyId: kmsKeyId,
      algorithm: ALGORITHM,
      version: 1
    };
    
    // Audit successful encryption
    auditPIIOperation('CREATE', 'EMAIL', true, undefined, { 
      operationId: opId,
      keyId: kmsKeyId,
      algorithm: ALGORITHM
    });
    
    logger.info("PII encryption successful", { 
      operationId: opId,
      dataLength: plaintext.length,
      algorithm: ALGORITHM
    });
    
    return result;
    
  } catch (error) {
    // Audit failed encryption
    auditPIIOperation('CREATE', 'EMAIL', false, undefined, { 
      operationId: opId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    logger.error("PII encryption failed", error, { operationId: opId });
    
    // Re-throw original error if it's a validation error, otherwise wrap it
    if (error instanceof Error && 
        (error.message.includes("Invalid plaintext") || 
         error.message.includes("KMS Key ID is required"))) {
      throw error;
    }
    
    throw new Error("Encryption operation failed");
  }
}

/**
 * Decrypts PII data using envelope encryption with AWS KMS
 */
export async function decryptPII(
  encryptedData: EncryptedData,
  operationId?: string
): Promise<string> {
  const opId = operationId || crypto.randomUUID();
  
  try {
    // Validate encrypted data structure
    if (!encryptedData || typeof encryptedData !== 'object') {
      throw new Error("Invalid encrypted data structure");
    }
    
    const { encryptedData: data, encryptedKey, iv, tag, keyId, algorithm, version } = encryptedData;
    
    if (!data || !encryptedKey || !iv || !tag || !keyId || !algorithm) {
      throw new Error("Missing required encryption components");
    }
    
    if (algorithm !== ALGORITHM) {
      throw new Error(`Unsupported encryption algorithm: ${algorithm}`);
    }
    
    if (version !== 1) {
      throw new Error(`Unsupported encryption version: ${version}`);
    }

    // Decrypt the data key using KMS
    logger.info("Decrypting data key for PII decryption", { operationId: opId });
    
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedKey, 'base64'),
      KeyId: keyId
    });
    
    const { Plaintext: dataKey } = await kmsClient.send(decryptCommand);
    
    if (!dataKey) {
      throw new Error("Failed to decrypt data key");
    }

    // Try standard decryption first (with operation ID as AAD)
    try {
      // Create decipher
      const decipher = crypto.createDecipheriv(algorithm, dataKey, Buffer.from(iv, 'base64'));
      decipher.setAAD(Buffer.from(opId)); // Use operation ID as additional authenticated data
      decipher.setAuthTag(Buffer.from(tag, 'base64'));
      
      // Decrypt the data
      let decrypted = decipher.update(data, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      // Clear the plaintext data key from memory
      dataKey.fill(0);
      
      // Audit successful decryption
      auditPIIOperation('READ', 'EMAIL', true, undefined, { 
        operationId: opId,
        keyId: keyId,
        algorithm: algorithm
      });
      
      logger.info("PII decryption successful", { 
        operationId: opId,
        algorithm: algorithm
      });
      
      return decrypted;
      
    } catch (standardError) {
      logger.info("Standard decryption failed, trying legacy decryption without AAD", { 
        operationId: opId,
        error: standardError instanceof Error ? standardError.message : String(standardError)
      });
      
      // Try legacy decryption without AAD (for data encrypted before AAD was implemented)
      try {
        const legacyDecipher = crypto.createDecipheriv(algorithm, dataKey, Buffer.from(iv, 'base64'));
        // No AAD set for legacy compatibility
        legacyDecipher.setAuthTag(Buffer.from(tag, 'base64'));
        
        let legacyDecrypted = legacyDecipher.update(data, 'base64', 'utf8');
        legacyDecrypted += legacyDecipher.final('utf8');
        
        // Clear the plaintext data key from memory
        dataKey.fill(0);
        
        // Audit successful legacy decryption
        auditPIIOperation('READ', 'EMAIL', true, undefined, { 
          operationId: opId,
          keyId: keyId,
          algorithm: algorithm,
          legacyDecryption: true
        });
        
        logger.info("Legacy PII decryption successful (no AAD)", { 
          operationId: opId,
          algorithm: algorithm
        });
        
        return legacyDecrypted;
        
      } catch (legacyError) {
        // Clear the plaintext data key from memory
        dataKey.fill(0);
        
        logger.error("Both standard and legacy decryption failed", {
          operationId: opId,
          standardError: standardError instanceof Error ? standardError.message : String(standardError),
          legacyError: legacyError instanceof Error ? legacyError.message : String(legacyError)
        });
        
        // Throw the original standard error
        throw standardError;
      }
    }
    
  } catch (error) {
    // Audit failed decryption
    auditPIIOperation('READ', 'EMAIL', false, undefined, { 
      operationId: opId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    logger.error("PII decryption failed", error, { operationId: opId });
    
    // Re-throw original error if it's a validation error, otherwise wrap it
    if (error instanceof Error && 
        (error.message.includes("Invalid encrypted data") || 
         error.message.includes("Missing required encryption") ||
         error.message.includes("Unsupported encryption"))) {
      throw error;
    }
    
    throw new Error("Decryption operation failed");
  }
}

/**
 * Creates searchable encrypted data by combining encryption with deterministic hashing
 * This allows for encrypted storage while maintaining search capabilities
 */
export async function encryptSearchablePII(
  plaintext: string,
  kmsKeyId: string,
  operationId?: string
): Promise<SearchableEncryptedData> {
  const opId = operationId || crypto.randomUUID();
  
  try {
    // Create deterministic hash for searching
    // Use HMAC with a derived key for consistency
    const searchKey = crypto.pbkdf2Sync(
      process.env.SEARCH_SALT || 'default-search-salt',
      plaintext.toLowerCase().trim(),
      100000, // iterations
      32,     // key length
      'sha256'
    );
    
    const searchHash = crypto.createHmac('sha256', searchKey)
      .update(plaintext.toLowerCase().trim())
      .digest('base64');
    
    // Encrypt the full data
    const encrypted = await encryptPII(plaintext, kmsKeyId, opId);
    
    // Clear sensitive data
    searchKey.fill(0);
    
    const result: SearchableEncryptedData = {
      encrypted,
      searchHash
    };
    
    logger.info("Searchable PII encryption successful", { 
      operationId: opId,
      hasSearchHash: !!searchHash
    });
    
    return result;
    
  } catch (error) {
    logger.error("Searchable PII encryption failed", error, { operationId: opId });
    throw new Error("Searchable encryption operation failed");
  }
}

/**
 * Generates a search hash for an existing plaintext value
 * Used for searching encrypted data
 */
export function generateSearchHash(plaintext: string): string {
  try {
    const searchKey = crypto.pbkdf2Sync(
      process.env.SEARCH_SALT || 'default-search-salt',
      plaintext.toLowerCase().trim(),
      100000, // iterations
      32,     // key length
      'sha256'
    );
    
    const searchHash = crypto.createHmac('sha256', searchKey)
      .update(plaintext.toLowerCase().trim())
      .digest('base64');
    
    // Clear sensitive data
    searchKey.fill(0);
    
    return searchHash;
    
  } catch (error) {
    logger.error("Search hash generation failed", error);
    throw new Error("Search hash generation failed");
  }
}

/**
 * Attempts to decrypt legacy PII data that may have been encrypted with unknown operation IDs
 * This is a fallback function for data that was encrypted before operation ID tracking was standardized
 */
export async function decryptLegacyPII(
  encryptedData: EncryptedData,
  fallbackOperationId?: string
): Promise<string> {
  const opId = fallbackOperationId || crypto.randomUUID();
  
  try {
    // Validate encrypted data structure
    if (!encryptedData || typeof encryptedData !== 'object') {
      throw new Error("Invalid encrypted data structure");
    }
    
    const { encryptedData: data, encryptedKey, iv, tag, keyId, algorithm, version } = encryptedData;
    
    if (!data || !encryptedKey || !iv || !tag || !keyId || !algorithm) {
      throw new Error("Missing required encryption components");
    }
    
    if (algorithm !== ALGORITHM) {
      throw new Error(`Unsupported encryption algorithm: ${algorithm}`);
    }
    
    if (version !== 1) {
      throw new Error(`Unsupported encryption version: ${version}`);
    }

    // Decrypt the data key using KMS
    logger.info("Decrypting data key for legacy PII decryption", { operationId: opId });
    
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedKey, 'base64'),
      KeyId: keyId
    });
    
    const { Plaintext: dataKey } = await kmsClient.send(decryptCommand);
    
    if (!dataKey) {
      throw new Error("Failed to decrypt data key");
    }

    // Try different AAD approaches for legacy compatibility
    const aadAttempts = [
      // Try with current operation ID first (most recent approach)
      Buffer.from(opId),
      // Try with no AAD (original approach might not have used AAD)
      null,
      // Try with empty string
      Buffer.from(''),
      // Try with some common default values that might have been used
      Buffer.from('default-operation-id'),
      Buffer.from('encryption-operation'),
      // Try some UUIDs that might have been used during development
      Buffer.from('00000000-0000-0000-0000-000000000000'),
      Buffer.from('11111111-1111-1111-1111-111111111111'),
      // Try common patterns that might have been used
      Buffer.from('signup-operation'),
      Buffer.from('encrypt-pii'),
      Buffer.from('data-encryption'),
    ];

    // Additionally, try some AAD values derived from the encrypted data itself
    // Sometimes the AAD might be related to parts of the encrypted content
    const derivedAADs = [
      // Try using parts of the encrypted key as AAD
      Buffer.from(encryptedKey, 'base64').slice(0, 16),
      // Try using the key ID as AAD
      Buffer.from(keyId),
      // Try using the IV as AAD
      Buffer.from(iv, 'base64'),
      // Try using a hash of the encrypted data
      Buffer.from(crypto.createHash('sha256').update(data).digest('hex').substring(0, 36)),
    ];

    // Combine all attempts
    const allAADAttempts = [...aadAttempts, ...derivedAADs];

    for (let i = 0; i < allAADAttempts.length; i++) {
      try {
        const aad = allAADAttempts[i];
        
        // Create decipher
        const decipher = crypto.createDecipheriv(algorithm, dataKey, Buffer.from(iv, 'base64'));
        
        // Set AAD if provided
        if (aad !== null) {
          decipher.setAAD(aad);
        }
        
        decipher.setAuthTag(Buffer.from(tag, 'base64'));
        
        // Decrypt the data
        let decrypted = decipher.update(data, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        // Clear the plaintext data key from memory
        dataKey.fill(0);
        
        // Audit successful decryption
        auditPIIOperation('READ', 'EMAIL', true, undefined, { 
          operationId: opId,
          keyId: keyId,
          algorithm: algorithm,
          legacyDecryption: true,
          aadAttempt: i,
          aadType: i < aadAttempts.length ? 'standard' : 'derived'
        });
        
        logger.info("Legacy PII decryption successful", { 
          operationId: opId,
          algorithm: algorithm,
          aadAttempt: i,
          aadType: i < aadAttempts.length ? 'standard' : 'derived'
        });
        
        return decrypted;
        
      } catch (decryptError) {
        // Continue to next AAD attempt if this one fails
        logger.info(`AAD attempt ${i} failed, trying next approach`, { 
          operationId: opId,
          attempt: i,
          aadType: i < aadAttempts.length ? 'standard' : 'derived'
        });
        continue;
      }
    }

    // Clear the plaintext data key from memory if all attempts failed
    dataKey.fill(0);
    
    // If all AAD attempts failed, throw the final error
    throw new Error("All decryption attempts failed - data may be corrupted or use unsupported encryption parameters");
    
  } catch (error) {
    // Audit failed decryption
    auditPIIOperation('READ', 'EMAIL', false, undefined, { 
      operationId: opId,
      error: error instanceof Error ? error.message : 'Unknown error',
      legacyDecryption: true
    });
    
    logger.error("Legacy PII decryption failed", error, { operationId: opId });
    
    // Re-throw original error if it's a validation error, otherwise wrap it
    if (error instanceof Error && 
        (error.message.includes("Invalid encrypted data") || 
         error.message.includes("Missing required encryption") ||
         error.message.includes("Unsupported encryption"))) {
      throw error;
    }
    
    throw new Error("Legacy decryption operation failed");
  }
}

/**
 * Validates KMS key accessibility and permissions
 */
export async function validateKMSKey(kmsKeyId: string): Promise<boolean> {
  try {
    // Test key by generating a small data key
    const testCommand = new GenerateDataKeyCommand({
      KeyId: kmsKeyId,
      KeySpec: "AES_256"
    });
    
    const result = await kmsClient.send(testCommand);
    
    // Clear the test key
    if (result.Plaintext) {
      result.Plaintext.fill(0);
    }
    
    return !!(result.CiphertextBlob);
    
  } catch (error) {
    logger.error("KMS key validation failed", error, { keyId: kmsKeyId });
    return false;
  }
}

// Export types for use in other modules