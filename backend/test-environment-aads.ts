/**
 * Targeted AAD test using environment-specific values
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { KMSClient, DecryptCommand } from "@aws-sdk/client-kms";
import * as crypto from "crypto";

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(ddb);
const kmsClient = new KMSClient({ region: process.env.AWS_REGION || "us-east-1" });

async function testEnvironmentAADs() {
  try {
    console.log("🎯 Testing environment-specific AAD values...");
    
    const tableName = process.env.DDB_TABLE_NAME || 'userSignUpEmails-encypted';
    
    // Get actual encrypted data
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
    
    console.log("📧 Testing with actual encrypted email data");
    console.log("");

    // Decrypt the data key from KMS
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedEmail.encryptedKey, 'base64'),
      KeyId: encryptedEmail.keyId
    });
    
    const kmsResult = await kmsClient.send(decryptCommand);
    
    if (!kmsResult.Plaintext) {
      console.log("❌ Failed to get data key from KMS");
      return;
    }
    
    console.log("✅ Data key decrypted from KMS");
    console.log("");

    // Environment-specific AAD attempts
    const environmentAADs = [
      // Search salt related
      { name: "Search salt: 'default-search-salt'", aad: Buffer.from('default-search-salt') },
      { name: "Current SEARCH_SALT env var", aad: process.env.SEARCH_SALT ? Buffer.from(process.env.SEARCH_SALT) : null },
      
      // Common signup/encryption identifiers
      { name: "signup", aad: Buffer.from('signup') },
      { name: "email-signup", aad: Buffer.from('email-signup') },
      { name: "subscriber", aad: Buffer.from('subscriber') },
      { name: "encrypted-signup", aad: Buffer.from('encrypted-signup') },
      
      // Table name related
      { name: "Table name", aad: Buffer.from(tableName) },
      { name: "userSignUpEmails", aad: Buffer.from('userSignUpEmails') },
      
      // KMS key related
      { name: "KMS key ID", aad: Buffer.from(encryptedEmail.keyId) },
      { name: "Full KMS ARN pattern", aad: Buffer.from(`arn:aws:kms:us-east-1:*:key/${encryptedEmail.keyId}`) },
      
      // Common development values
      { name: "test", aad: Buffer.from('test') },
      { name: "development", aad: Buffer.from('development') },
      { name: "production", aad: Buffer.from('production') },
      
      // Region related
      { name: "AWS region", aad: Buffer.from(process.env.AWS_REGION || 'us-east-1') },
      
      // Hash of search salt (might have been used)
      { name: "Hash of default-search-salt", aad: Buffer.from(crypto.createHash('sha256').update('default-search-salt').digest('hex').substring(0, 36)) },
    ];

    for (const attempt of environmentAADs) {
      if (attempt.aad === null) {
        console.log(`⏭️  Skipping ${attempt.name} (null value)`);
        continue;
      }
      
      try {
        console.log(`🔐 Trying: ${attempt.name}...`);
        
        const decipher = crypto.createDecipheriv(
          encryptedEmail.algorithm,
          kmsResult.Plaintext,
          Buffer.from(encryptedEmail.iv, 'base64')
        ) as crypto.DecipherGCM;
        
        decipher.setAAD(attempt.aad);
        decipher.setAuthTag(Buffer.from(encryptedEmail.tag, 'base64'));
        
        let decrypted = decipher.update(encryptedEmail.encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        console.log(`🎉 SUCCESS with "${attempt.name}"!`);
        console.log("Decrypted email:", decrypted);
        console.log("");
        console.log("🔧 This is the AAD value that was used during encryption:");
        console.log("AAD Buffer:", Array.from(attempt.aad));
        console.log("AAD String:", attempt.aad.toString());
        
        // Clear data key and return success
        kmsResult.Plaintext.fill(0);
        return;
        
      } catch (error) {
        console.log(`❌ Failed with ${attempt.name}`);
      }
    }

    // Clear data key
    kmsResult.Plaintext.fill(0);
    
    console.log("");
    console.log("❌ All environment-specific AAD attempts failed");
    console.log("The AAD used during encryption is not among the common values tested");

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testEnvironmentAADs();