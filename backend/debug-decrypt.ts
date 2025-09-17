/**
 * Debug script to inspect encrypted data structure
 * This will help diagnose why decryption is failing
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddb = new DynamoDBClient({ 
  region: process.env.AWS_REGION || "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(ddb);

async function debugEncryptedData() {
  try {
    console.log("🔍 Debugging encrypted data structure...");
    console.log("Environment variables:");
    console.log("- KMS_KEY_ID:", process.env.KMS_KEY_ID ? "SET" : "NOT SET");
    console.log("- SEARCH_SALT:", process.env.SEARCH_SALT ? "SET" : "NOT SET");
    console.log("- DDB_TABLE_NAME:", process.env.DDB_TABLE_NAME || "NOT SET");
    console.log("- AWS_REGION:", process.env.AWS_REGION || "us-east-1");
    console.log("");

    const tableName = process.env.DDB_TABLE_NAME || 'userSignUpEmails-encypted';
    
    // Get one record to inspect its structure
    const result = await docClient.send(new ScanCommand({
      TableName: tableName,
      Limit: 1
    }));

    if (!result.Items || result.Items.length === 0) {
      console.log("❌ No items found in table");
      return;
    }

    const item = result.Items[0];
    console.log("📊 Sample record structure:");
    console.log("Keys in record:", Object.keys(item));
    console.log("");

    // Check encrypted email structure
    if (item.encryptedEmail) {
      console.log("🔐 Encrypted email structure:");
      console.log("Type:", typeof item.encryptedEmail);
      
      if (typeof item.encryptedEmail === 'object') {
        const encEmail = item.encryptedEmail;
        console.log("Properties:", Object.keys(encEmail));
        
        // Check required properties
        const requiredProps = ['encryptedData', 'encryptedKey', 'iv', 'tag', 'keyId', 'algorithm', 'version'];
        for (const prop of requiredProps) {
          console.log(`- ${prop}:`, encEmail[prop] ? "✅ Present" : "❌ Missing");
        }
        
        if (encEmail.keyId) {
          console.log("Key ID used for encryption:", encEmail.keyId);
          console.log("Current KMS_KEY_ID:", process.env.KMS_KEY_ID);
          console.log("Key IDs match:", encEmail.keyId === process.env.KMS_KEY_ID ? "✅ Yes" : "❌ No");
        }
        
        if (encEmail.algorithm) {
          console.log("Algorithm:", encEmail.algorithm);
        }
        
        if (encEmail.version) {
          console.log("Version:", encEmail.version);
        }
      } else {
        console.log("❌ encryptedEmail is not an object:", item.encryptedEmail);
      }
    } else {
      console.log("❌ No encryptedEmail field found");
    }

    console.log("");
    console.log("🔍 Full record (first 500 chars):");
    console.log(JSON.stringify(item, null, 2).substring(0, 500) + "...");

  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

debugEncryptedData();