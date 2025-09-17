/**
 * Raw crypto test - bypass our functions and use Node.js crypto directly
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { KMSClient, DecryptCommand } from "@aws-sdk/client-kms";
import * as crypto from "crypto";

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(ddb);
const kmsClient = new KMSClient({ region: process.env.AWS_REGION || "us-east-1" });

async function rawCryptoTest() {
  try {
    console.log("🔧 Raw crypto test - bypassing our functions...");
    
    const tableName = process.env.DDB_TABLE_NAME || 'userSignUpEmails-encypted';
    
    // Get actual encrypted data from your database
    const result = await docClient.send(new ScanCommand({
      TableName: tableName,
      Limit: 1
    }));

    if (!result.Items || result.Items.length === 0) {
      console.log("❌ No items found");
      return;
    }

    const item = result.Items[0];
    const encryptedEmail = item.encryptedEmail;
    
    console.log("📧 Raw encrypted email data:");
    console.log("- Algorithm:", encryptedEmail.algorithm);
    console.log("- Version:", encryptedEmail.version);
    console.log("- Key ID:", encryptedEmail.keyId);
    console.log("- Has encrypted data:", !!encryptedEmail.encryptedData);
    console.log("- Has encrypted key:", !!encryptedEmail.encryptedKey);
    console.log("- Has IV:", !!encryptedEmail.iv);
    console.log("- Has tag:", !!encryptedEmail.tag);
    console.log("");

    // Step 1: Decrypt the data key from KMS
    console.log("🔑 Step 1: Decrypting data key from KMS...");
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedEmail.encryptedKey, 'base64'),
      KeyId: encryptedEmail.keyId
    });
    
    const kmsResult = await kmsClient.send(decryptCommand);
    
    if (!kmsResult.Plaintext) {
      console.log("❌ Failed to get plaintext data key from KMS");
      return;
    }
    
    console.log("✅ Data key decrypted from KMS");
    console.log("- Data key length:", kmsResult.Plaintext.length, "bytes");
    console.log("");

    // Step 2: Try different decryption approaches with raw crypto
    const attempts = [
      { name: "No AAD", aad: null },
      { name: "Empty string AAD", aad: Buffer.from('') },
      { name: "Key ID as AAD", aad: Buffer.from(encryptedEmail.keyId) },
    ];

    for (const attempt of attempts) {
      try {
        console.log(`🔐 Step 2: Trying decryption with ${attempt.name}...`);
        
        // Create decipher with raw crypto
        const decipher = crypto.createDecipheriv(
          encryptedEmail.algorithm,
          kmsResult.Plaintext,
          Buffer.from(encryptedEmail.iv, 'base64')
        ) as crypto.DecipherGCM;
        
        // Set AAD if provided
        if (attempt.aad !== null) {
          decipher.setAAD(attempt.aad);
        }
        
        // Set auth tag
        decipher.setAuthTag(Buffer.from(encryptedEmail.tag, 'base64'));
        
        // Decrypt
        let decrypted = decipher.update(encryptedEmail.encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        console.log(`✅ SUCCESS with ${attempt.name}!`);
        console.log("Decrypted email:", decrypted);
        
        // Clear data key and return success
        kmsResult.Plaintext.fill(0);
        return;
        
      } catch (error) {
        console.log(`❌ Failed with ${attempt.name}:`, error instanceof Error ? error.message : error);
      }
    }

    // Clear data key
    kmsResult.Plaintext.fill(0);
    
    console.log("");
    console.log("❌ All raw crypto attempts failed");
    console.log("This suggests the encrypted data itself may be corrupted or incompatible");

  } catch (error) {
    console.error("❌ Raw crypto test failed:", error);
  }
}

rawCryptoTest();