/**
 * Test encryption and immediate decryption to verify the logic works
 */

import { encryptPII, decryptPII, encryptSearchablePII } from './src/utils/piiEncryption';
import * as crypto from "crypto";

async function testEncryptDecryptCycle() {
  try {
    console.log("🔄 Testing encryption → decryption cycle...");
    
    const testData = "test@example.com";
    const kmsKeyId = process.env.KMS_KEY_ID;
    const operationId = crypto.randomUUID();
    
    if (!kmsKeyId) {
      console.log("❌ KMS_KEY_ID not set");
      return;
    }
    
    console.log("Test data:", testData);
    console.log("KMS Key ID:", kmsKeyId);
    console.log("Operation ID:", operationId);
    console.log("");

    // Test 1: Direct encryption/decryption
    console.log("🔐 Test 1: Direct encryptPII → decryptPII");
    try {
      const encrypted = await encryptPII(testData, kmsKeyId, operationId);
      console.log("✅ Encryption successful");
      console.log("Encrypted structure:", {
        hasEncryptedData: !!encrypted.encryptedData,
        hasEncryptedKey: !!encrypted.encryptedKey,
        hasIv: !!encrypted.iv,
        hasTag: !!encrypted.tag,
        keyId: encrypted.keyId,
        algorithm: encrypted.algorithm,
        version: encrypted.version
      });
      
      // Now try to decrypt with the SAME operation ID
      const decrypted = await decryptPII(encrypted, operationId);
      console.log("✅ Decryption successful:", decrypted);
      console.log("Data matches:", decrypted === testData ? "✅ Yes" : "❌ No");
      
    } catch (error) {
      console.log("❌ Direct encryption/decryption failed:", error instanceof Error ? error.message : error);
    }
    
    console.log("");

    // Test 2: Searchable encryption/decryption
    console.log("🔐 Test 2: encryptSearchablePII → decryptPII");
    try {
      const searchableEncrypted = await encryptSearchablePII(testData, kmsKeyId, operationId);
      console.log("✅ Searchable encryption successful");
      
      // Try to decrypt the encrypted part
      const decrypted2 = await decryptPII(searchableEncrypted.encrypted, operationId);
      console.log("✅ Searchable decryption successful:", decrypted2);
      console.log("Data matches:", decrypted2 === testData ? "✅ Yes" : "❌ No");
      
    } catch (error) {
      console.log("❌ Searchable encryption/decryption failed:", error instanceof Error ? error.message : error);
    }

    console.log("");

    // Test 3: Try decrypting with a DIFFERENT operation ID (simulating export scenario)
    console.log("🔐 Test 3: Decrypt with different operation ID (export scenario)");
    try {
      const encrypted = await encryptPII(testData, kmsKeyId, operationId);
      const differentOpId = crypto.randomUUID();
      
      console.log("Original operation ID:", operationId);
      console.log("Different operation ID:", differentOpId);
      
      const decrypted3 = await decryptPII(encrypted, differentOpId);
      console.log("✅ Decryption with different op ID successful:", decrypted3);
      
    } catch (error) {
      console.log("❌ Decryption with different op ID failed:", error instanceof Error ? error.message : error);
      console.log("This confirms the AAD mismatch issue");
    }

  } catch (error) {
    console.error("❌ Test cycle failed:", error);
  }
}

testEncryptDecryptCycle();