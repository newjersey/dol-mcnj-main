#!/usr/bin/env npx ts-node

/**
 * Correct decryption script for the actual encrypted data format
 * This script handles the real structure: encryptedKey, tag, iv, encryptedData
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import * as crypto from 'crypto';
import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';

// Environment setup
const region = process.env.AWS_REGION || 'us-east-1';
const tableName = process.env.DDB_TABLE_NAME || 'userSignUpEmails-encypted';
const kmsKeyId = process.env.KMS_KEY_ID;
const searchSalt = process.env.SEARCH_SALT;

console.log('🔧 Testing decryption with CORRECT data structure...');
console.log(`Environment: Region=${region}, Table=${tableName}`);

const dynamoClient = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const kmsClient = new KMSClient({ region });

interface ActualEncryptedData {
  encryptedData: string;
  encryptedKey: string;
  keyId: string;
  tag: string;
  iv: string;
  version: number;
  algorithm: string;
}

async function decryptWithCorrectStructure(encryptedStruct: ActualEncryptedData, aad: string): Promise<string> {
  // 1. Decrypt the data key using KMS
  const decryptCommand = new DecryptCommand({
    CiphertextBlob: Buffer.from(encryptedStruct.encryptedKey, 'base64')
  });
  
  const kmsResult = await kmsClient.send(decryptCommand);
  if (!kmsResult.Plaintext) {
    throw new Error('Failed to decrypt data key');
  }
  
  const dataKey = Buffer.from(kmsResult.Plaintext);
  
  // 2. Decrypt the actual data using AES-256-GCM
  const decipher = crypto.createDecipheriv('aes-256-gcm', dataKey, Buffer.from(encryptedStruct.iv, 'base64'));
  decipher.setAAD(Buffer.from(aad, 'utf8'));
  decipher.setAuthTag(Buffer.from(encryptedStruct.tag, 'base64'));
  
  let decrypted = decipher.update(Buffer.from(encryptedStruct.encryptedData, 'base64'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

async function testCorrectDecryption() {
  try {
    console.log('\n📊 Fetching one encrypted record...');
    
    const scanCommand = new ScanCommand({
      TableName: tableName,
      Limit: 1
    });
    
    const result = await docClient.send(scanCommand);
    if (!result.Items || result.Items.length === 0) {
      console.log('❌ No records found');
      return;
    }
    
    const record = result.Items[0];
    console.log(`📋 Record keys: ${Object.keys(record).join(', ')}`);
    
    if (record.encryptedEmail) {
      console.log('\n🧪 Testing email decryption with various AAD values...');
      
      // Test different AAD possibilities with the CORRECT structure
      const aadCandidates = [
        { desc: 'Empty string', aad: '' },
        { desc: 'Record hash from emailHash field', aad: record.emailHash || '' },
        { desc: 'Static "email"', aad: 'email' },
        { desc: 'Static "pii"', aad: 'pii' },
        { desc: 'Search salt', aad: searchSalt || '' },
        { desc: 'Table name', aad: tableName },
        { desc: 'KMS Key ID', aad: kmsKeyId || '' },
        { desc: 'CreatedAt timestamp', aad: record.createdAt || '' },
        { desc: 'UpdatedAt timestamp', aad: record.updatedAt || '' }
      ];
      
      for (const candidate of aadCandidates) {
        if (!candidate.aad) continue;
        
        try {
          const decrypted = await decryptWithCorrectStructure(record.encryptedEmail, candidate.aad);
          console.log(`🎉 SUCCESS! AAD: ${candidate.desc}`);
          console.log(`📝 AAD value: "${candidate.aad}"`);
          console.log(`📧 Decrypted email: "${decrypted}"`);
          
          // Test firstName and lastName with the same successful AAD
          if (record.encryptedFname) {
            try {
              const firstName = await decryptWithCorrectStructure(record.encryptedFname, candidate.aad);
              console.log(`👤 Decrypted firstName: "${firstName}"`);
            } catch (e) {
              console.log(`❌ firstName decryption failed with same AAD`);
            }
          }
          
          if (record.encryptedLname) {
            try {
              const lastName = await decryptWithCorrectStructure(record.encryptedLname, candidate.aad);
              console.log(`👤 Decrypted lastName: "${lastName}"`);
            } catch (e) {
              console.log(`❌ lastName decryption failed with same AAD`);
            }
          }
          
          return; // Stop on first success
        } catch (error) {
          console.log(`❌ Failed with AAD "${candidate.desc}": ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      console.log('\n❌ All AAD attempts failed with correct structure');
      
    } else {
      console.log('❌ No encryptedEmail field found');
    }
    
  } catch (error) {
    console.error('❌ Error in test:', error);
  }
}

// Run the test
testCorrectDecryption().catch(console.error);