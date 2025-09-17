/**
 * Deep analysis of encrypted data to find clues about original AAD
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { KMSClient, DecryptCommand } from "@aws-sdk/client-kms";
import * as crypto from "crypto";

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(ddb);
const kmsClient = new KMSClient({ region: process.env.AWS_REGION || "us-east-1" });

async function deepAnalysis() {
  try {
    console.log("🔬 Deep analysis of encrypted data...");
    
    const tableName = process.env.DDB_TABLE_NAME || 'userSignUpEmails-encypted';
    
    // Get all encrypted records to see if they're all affected
    const result = await docClient.send(new ScanCommand({
      TableName: tableName,
      Limit: 3  // Get a few records to compare
    }));

    if (!result.Items || result.Items.length === 0) {
      console.log("❌ No items found");
      return;
    }

    console.log(`📊 Found ${result.Items.length} records to analyze`);
    console.log("");

    for (let i = 0; i < result.Items.length; i++) {
      const item = result.Items[i];
      console.log(`🔍 Record ${i + 1}:`);
      console.log("- Created:", item.createdAt);
      console.log("- Email hash:", item.emailHash ? item.emailHash.substring(0, 20) + "..." : "missing");
      
      if (item.encryptedEmail) {
        const enc = item.encryptedEmail;
        console.log("- Encrypted data length:", enc.encryptedData ? enc.encryptedData.length : "missing");
        console.log("- IV length:", enc.iv ? Buffer.from(enc.iv, 'base64').length : "missing");
        console.log("- Tag length:", enc.tag ? Buffer.from(enc.tag, 'base64').length : "missing");
        console.log("- Key ID:", enc.keyId);
        console.log("- Algorithm:", enc.algorithm);
        console.log("- Version:", enc.version);
      }
      console.log("");
    }

    // Pick the first record for detailed analysis
    const testRecord = result.Items[0];
    const encryptedEmail = testRecord.encryptedEmail;
    
    console.log("🧪 Attempting more exotic AAD possibilities...");
    console.log("");

    // Decrypt the data key
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedEmail.encryptedKey, 'base64'),
      KeyId: encryptedEmail.keyId
    });
    
    const kmsResult = await kmsClient.send(decryptCommand);
    
    if (!kmsResult.Plaintext) {
      console.log("❌ Failed to get data key from KMS");
      return;
    }

    // Try more exotic AAD possibilities
    const exoticAADs = [
      // Maybe AAD was derived from the record itself
      { name: "Email hash as AAD", aad: Buffer.from(testRecord.emailHash || '') },
      { name: "Created timestamp", aad: Buffer.from(testRecord.createdAt || '') },
      { name: "Status field", aad: Buffer.from(testRecord.status || 'subscribed') },
      
      // Maybe AAD was related to the encrypted key itself
      { name: "First 16 bytes of encrypted key", aad: Buffer.from(encryptedEmail.encryptedKey, 'base64').slice(0, 16) },
      { name: "Last 16 bytes of encrypted key", aad: Buffer.from(encryptedEmail.encryptedKey, 'base64').slice(-16) },
      
      // Maybe a combination was used
      { name: "KMS key + table name", aad: Buffer.from(encryptedEmail.keyId + tableName) },
      { name: "Algorithm + version", aad: Buffer.from(encryptedEmail.algorithm + encryptedEmail.version.toString()) },
      
      // Maybe it was a hash of some combination
      { name: "SHA256 of key ID", aad: Buffer.from(crypto.createHash('sha256').update(encryptedEmail.keyId).digest('hex').substring(0, 36)) },
      { name: "MD5 of key ID", aad: Buffer.from(crypto.createHash('md5').update(encryptedEmail.keyId).digest('hex')) },
      
      // Maybe the AAD was encoded differently
      { name: "Key ID as hex", aad: Buffer.from(encryptedEmail.keyId, 'hex') },
      { name: "Empty buffer (different from null)", aad: Buffer.alloc(0) },
      
      // Maybe some common constants were used
      { name: "email", aad: Buffer.from('email') },
      { name: "pii", aad: Buffer.from('pii') },
      { name: "encrypt", aad: Buffer.from('encrypt') },
      { name: "aes-256-gcm", aad: Buffer.from('aes-256-gcm') },
    ];

    for (const attempt of exoticAADs) {
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
        
        console.log(`🎉 BREAKTHROUGH! Success with "${attempt.name}"!`);
        console.log("Decrypted email:", decrypted);
        console.log("");
        console.log("🔧 AAD details:");
        console.log("AAD Buffer:", Array.from(attempt.aad));
        console.log("AAD String:", attempt.aad.toString());
        console.log("AAD Length:", attempt.aad.length);
        
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
    console.log("❌ ALL AAD attempts exhausted");
    console.log("");
    console.log("🤔 Possible conclusions:");
    console.log("1. The AAD was a specific UUID that we can't guess");
    console.log("2. The data was encrypted with different parameters");
    console.log("3. There may be data corruption");
    console.log("4. The encryption implementation changed between versions");
    console.log("");
    console.log("💡 Next steps:");
    console.log("- Check git history for changes to encryption code");
    console.log("- Look for backup of original encryption parameters");
    console.log("- Consider if data needs to be re-encrypted");

  } catch (error) {
    console.error("❌ Deep analysis failed:", error);
  }
}

deepAnalysis();