/**
 * Targeted decryption test script
 * Tests both standard and legacy decryption on actual data
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { decryptPII, decryptLegacyPII, EncryptedData } from './src/utils/piiEncryption';
import * as crypto from "crypto";

const ddb = new DynamoDBClient({ 
  region: process.env.AWS_REGION || "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(ddb);

async function testDecryption() {
  try {
    console.log("🧪 Testing decryption on actual data...");
    
    const tableName = process.env.DDB_TABLE_NAME || 'userSignUpEmails-encypted';
    const testOpId = crypto.randomUUID();
    
    // Get one record to test
    const result = await docClient.send(new ScanCommand({
      TableName: tableName,
      Limit: 1
    }));

    if (!result.Items || result.Items.length === 0) {
      console.log("❌ No items found in table");
      return;
    }

    const item = result.Items[0];
    const encryptedEmail = item.encryptedEmail as EncryptedData;
    
    console.log("📧 Testing email decryption...");
    console.log("Operation ID for test:", testOpId);
    console.log("");

    // Test 1: Standard decryption
    console.log("🔐 Test 1: Standard decryption");
    try {
      const decrypted1 = await decryptPII(encryptedEmail, testOpId);
      console.log("✅ Standard decryption SUCCESS:", decrypted1);
    } catch (error) {
      console.log("❌ Standard decryption FAILED:", error instanceof Error ? error.message : error);
    }
    
    console.log("");

    // Test 2: Legacy decryption
    console.log("🔐 Test 2: Legacy decryption");
    try {
      const decrypted2 = await decryptLegacyPII(encryptedEmail, testOpId);
      console.log("✅ Legacy decryption SUCCESS:", decrypted2);
    } catch (error) {
      console.log("❌ Legacy decryption FAILED:", error instanceof Error ? error.message : error);
      
      // Show the specific error details
      if (error instanceof Error) {
        console.log("Error details:", error.stack);
      }
    }

    console.log("");

    // Test 3: Manual AAD testing with no AAD
    console.log("🔐 Test 3: Manual decryption with no AAD");
    try {
      const { KMSClient, DecryptCommand } = await import("@aws-sdk/client-kms");
      const crypto = await import("crypto");
      
      const kmsClient = new KMSClient({ region: process.env.AWS_REGION || "us-east-1" });
      
      // Decrypt the data key
      const decryptCommand = new DecryptCommand({
        CiphertextBlob: Buffer.from(encryptedEmail.encryptedKey, 'base64'),
        KeyId: encryptedEmail.keyId
      });
      
      const { Plaintext: dataKey } = await kmsClient.send(decryptCommand);
      
      if (dataKey) {
        // Try decryption with no AAD
        const decipher = crypto.createDecipheriv(
          encryptedEmail.algorithm, 
          dataKey, 
          Buffer.from(encryptedEmail.iv, 'base64')
        ) as crypto.DecipherGCM;
        
        // No AAD set - this might be how the original data was encrypted
        decipher.setAuthTag(Buffer.from(encryptedEmail.tag, 'base64'));
        
        let decrypted = decipher.update(encryptedEmail.encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        console.log("✅ Manual decryption (no AAD) SUCCESS:", decrypted);
        
        // Clear the data key
        dataKey.fill(0);
      }
    } catch (error) {
      console.log("❌ Manual decryption (no AAD) FAILED:", error instanceof Error ? error.message : error);
    }

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testDecryption();