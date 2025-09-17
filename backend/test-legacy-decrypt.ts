/**
 * Test script to verify legacy decryption functionality
 * This simulates the decryption issue you're experiencing
 */

import { decryptLegacyPII, EncryptedData } from './src/utils/piiEncryption';

// Mock encrypted data structure (replace with actual data from your DynamoDB)
const mockEncryptedData: EncryptedData = {
  encryptedData: "example_encrypted_data",
  encryptedKey: "example_encrypted_key", 
  iv: "example_iv",
  tag: "example_tag",
  keyId: process.env.KMS_KEY_ID || "your-kms-key-id",
  algorithm: "aes-256-gcm",
  version: 1
};

async function testLegacyDecryption() {
  try {
    console.log("Testing legacy decryption...");
    
    // This should try multiple AAD approaches
    const decrypted = await decryptLegacyPII(mockEncryptedData);
    
    console.log("✅ Legacy decryption successful!");
    console.log("Decrypted:", decrypted);
    
  } catch (error) {
    console.error("❌ Legacy decryption failed:", error instanceof Error ? error.message : error);
  }
}

testLegacyDecryption();