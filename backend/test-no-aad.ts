#!/usr/bin/env npx ts-node

/**
 * Test if database records were encrypted without AAD
 */

import * as crypto from 'crypto';
import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';

const region = process.env.AWS_REGION || 'us-east-1';
const kmsClient = new KMSClient({ region });

async function testNoAADDecryption() {
  try {
    console.log('🧪 Testing if database records were encrypted without AAD...');
    
    // Actual database record
    const dbRecord = {
      encryptedData: "cxb8DhSjTY6e6ur33uvKEUyOi7k=",
      encryptedKey: "AQIDAHjaur8lPVdqsG6nWvZAtdWjp23STn6nxIMGUstrUYUyogG0UzYL0j0qsnUqKeoQ9WnsAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMow4HCS4zNlTYhXIFAgEQgDuokwu8KpM3qyd7+CRUE8GLwRWJtLvM8Xd/QENLCLpiFGE+3elTLE9STdroivd//+T8wmRIecHkD1jHkw==",
      keyId: "885df373-247c-44c6-ad18-1dc495a3230f",
      tag: "I+rZo5pcN3KCnNPkD4AOFQ==",
      iv: "X0+/L6ymwQ9Glz+WZNp6aQ==",
      version: 1,
      algorithm: "aes-256-gcm"
    };
    
    // Decrypt the data key
    console.log('🔑 Decrypting data key...');
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: Buffer.from(dbRecord.encryptedKey, 'base64'),
      KeyId: dbRecord.keyId
    });
    
    const { Plaintext: dataKey } = await kmsClient.send(decryptCommand);
    
    if (!dataKey) {
      throw new Error("Failed to decrypt data key");
    }
    
    console.log('✅ Data key decrypted successfully');
    
    // Test decryption WITHOUT setting any AAD
    console.log('🧪 Testing decryption without AAD...');
    
    try {
      const decipher = crypto.createDecipheriv('aes-256-gcm', dataKey, Buffer.from(dbRecord.iv, 'base64'));
      // Important: Do NOT call setAAD() at all
      decipher.setAuthTag(Buffer.from(dbRecord.tag, 'base64'));
      
      let decrypted = decipher.update(Buffer.from(dbRecord.encryptedData, 'base64'));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      const result = decrypted.toString('utf8');
      console.log(`🎉 SUCCESS! Decrypted without AAD: "${result}"`);
      
      // Test the other fields too
      console.log('\n🧪 Testing other database records...');
      
      const otherRecords = [
        {
          name: "firstName",
          encryptedData: "W0aKT1C5AA==",
          encryptedKey: "AQIDAHjaur8lPVdqsG6nWvZAtdWjp23STn6nxIMGUstrUYUyogG3aGUiUX0MpqdzZEdSE529AAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMTAGmisWVLnA2tfqKAgEQgDvYfT+EbsL8DjLEBtBNcKv70S+PEjAkZrncV9UZbAiTwjYPkXlUtTXlv9mXqHlhG3xoYLFO77ObJrITVA==",
          keyId: "885df373-247c-44c6-ad18-1dc495a3230f",
          tag: "cMCnS4UnafCt1BEfsrkFdQ==",
          iv: "M0NQm2aWlpS0ixQy/ZTeEw=="
        },
        {
          name: "lastName",
          encryptedData: "C3kTmU0CeZRKXw==",
          encryptedKey: "AQIDAHjaur8lPVdqsG6nWvZAtdWjp23STn6nxIMGUstrUYUyogHrfcqOyjS6hf/jeAHkIFQTAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMHT8st35jJuLyqKT2AgEQgDupCtJhZLvWJQtZ8k/ojOS6q81+JCOAR+9Qe1vqez3S3/KMdqkqTMPVHpScbxU3X/jgF8tN6HkhLQhdlQ==",
          keyId: "885df373-247c-44c6-ad18-1dc495a3230f",
          tag: "30PttMdYr7YCsgqV2gmRsw==",
          iv: "AEU2A6h1/EDk2XJzWZJdNA=="
        }
      ];
      
      for (const record of otherRecords) {
        try {
          const recordDecryptCommand = new DecryptCommand({
            CiphertextBlob: Buffer.from(record.encryptedKey, 'base64'),
            KeyId: record.keyId
          });
          
          const { Plaintext: recordDataKey } = await kmsClient.send(recordDecryptCommand);
          
          if (!recordDataKey) {
            console.log(`❌ ${record.name}: Failed to decrypt data key`);
            continue;
          }
          
          const recordDecipher = crypto.createDecipheriv('aes-256-gcm', recordDataKey, Buffer.from(record.iv, 'base64'));
          // No AAD
          recordDecipher.setAuthTag(Buffer.from(record.tag, 'base64'));
          
          let recordDecrypted = recordDecipher.update(Buffer.from(record.encryptedData, 'base64'));
          recordDecrypted = Buffer.concat([recordDecrypted, recordDecipher.final()]);
          
          const recordResult = recordDecrypted.toString('utf8');
          console.log(`🎉 ${record.name}: "${recordResult}"`);
          
        } catch (error) {
          console.log(`❌ ${record.name}: Failed - ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testNoAADDecryption().catch(console.error);