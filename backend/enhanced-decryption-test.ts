#!/usr/bin/env npx ts-node

/**
 * Enhanced decryption test with empty string and systematic AAD testing
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

console.log('🔧 Enhanced decryption test with systematic AAD testing...');
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
  
  // Set AAD if provided
  if (aad !== null) {
    decipher.setAAD(Buffer.from(aad, 'utf8'));
  }
  
  decipher.setAuthTag(Buffer.from(encryptedStruct.tag, 'base64'));
  
  let decrypted = decipher.update(Buffer.from(encryptedStruct.encryptedData, 'base64'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

async function testEnhancedDecryption() {
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
      console.log('\n🧪 Testing email decryption with systematic AAD values...');
      
      // More comprehensive AAD test list
      const aadCandidates = [
        { desc: 'NULL (no AAD)', aad: null },
        { desc: 'Empty string', aad: '' },
        { desc: 'Space character', aad: ' ' },
        { desc: 'Static "email"', aad: 'email' },
        { desc: 'Static "pii"', aad: 'pii' },
        { desc: 'Static "data"', aad: 'data' },
        { desc: 'Static "encryption"', aad: 'encryption' },
        { desc: 'Static "aes-256-gcm"', aad: 'aes-256-gcm' },
        { desc: 'Record emailHash field', aad: record.emailHash || 'NO_HASH' },
        { desc: 'Search salt', aad: searchSalt || 'NO_SALT' },
        { desc: 'Table name', aad: tableName },
        { desc: 'Table name (corrected)', aad: 'userSignUpEmails-encrypted' },
        { desc: 'KMS Key ID', aad: kmsKeyId || 'NO_KEY' },
        { desc: 'KMS Key ID (short)', aad: (kmsKeyId || '').split('-')[0] },
        { desc: 'CreatedAt timestamp', aad: record.createdAt || 'NO_CREATED' },
        { desc: 'UpdatedAt timestamp', aad: record.updatedAt || 'NO_UPDATED' },
        { desc: 'Version number', aad: '1' },
        { desc: 'Algorithm name', aad: 'aes-256-gcm' },
        { desc: 'Status field', aad: record.status || 'NO_STATUS' }
      ];
      
      let successCount = 0;
      
      for (let i = 0; i < aadCandidates.length; i++) {
        const candidate = aadCandidates[i];
        
        try {
          let aadValue = candidate.aad;
          if (aadValue === 'NO_HASH' || aadValue === 'NO_SALT' || aadValue === 'NO_KEY' || 
              aadValue === 'NO_CREATED' || aadValue === 'NO_UPDATED' || aadValue === 'NO_STATUS') {
            console.log(`⏭️  Skipping ${candidate.desc} (value not available)`);
            continue;
          }
          
          const decrypted = await decryptWithCorrectStructure(record.encryptedEmail, aadValue);
          console.log(`🎉 SUCCESS #${++successCount}! AAD: ${candidate.desc}`);
          console.log(`📝 AAD value: ${aadValue === null ? 'NULL' : `"${aadValue}"`}`);
          console.log(`📧 Decrypted email: "${decrypted}"`);
          
          // Test firstName and lastName with the same successful AAD
          if (record.encryptedFname) {
            try {
              const firstName = await decryptWithCorrectStructure(record.encryptedFname, aadValue);
              console.log(`👤 Decrypted firstName: "${firstName}"`);
            } catch (e) {
              console.log(`❌ firstName decryption failed with same AAD`);
            }
          }
          
          if (record.encryptedLname) {
            try {
              const lastName = await decryptWithCorrectStructure(record.encryptedLname, aadValue);
              console.log(`👤 Decrypted lastName: "${lastName}"`);
            } catch (e) {
              console.log(`❌ lastName decryption failed with same AAD`);
            }
          }
          
          // Continue testing to see if multiple AADs work
          console.log(`\n🔄 Continuing to test remaining AADs...\n`);
          
        } catch (error) {
          if (i < 10 || i % 5 === 0) { // Reduce noise, show first 10 and every 5th
            console.log(`❌ #${i + 1} Failed with AAD "${candidate.desc}": ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      }
      
      if (successCount === 0) {
        console.log('\n❌ All AAD attempts failed with correct structure');
        console.log('\n🔍 Let me try some additional debugging...');
        
        // Additional debugging - try to see what's in the encrypted data
        const encEmail = record.encryptedEmail;
        console.log(`\n📊 Detailed structure analysis:`);
        console.log(`- encryptedData length: ${encEmail.encryptedData?.length || 'undefined'}`);
        console.log(`- encryptedKey length: ${encEmail.encryptedKey?.length || 'undefined'}`);
        console.log(`- iv length: ${encEmail.iv?.length || 'undefined'}`);
        console.log(`- tag length: ${encEmail.tag?.length || 'undefined'}`);
        console.log(`- keyId: ${encEmail.keyId || 'undefined'}`);
        console.log(`- algorithm: ${encEmail.algorithm || 'undefined'}`);
        console.log(`- version: ${encEmail.version || 'undefined'}`);
        
        // Test KMS decryption separately
        console.log(`\n🔑 Testing KMS data key decryption only...`);
        try {
          const decryptCommand = new DecryptCommand({
            CiphertextBlob: Buffer.from(encEmail.encryptedKey, 'base64')
          });
          
          const kmsResult = await kmsClient.send(decryptCommand);
          if (kmsResult.Plaintext) {
            console.log(`✅ KMS data key decryption successful! Key length: ${kmsResult.Plaintext.length} bytes`);
            
            // Try raw AES decryption without AAD
            console.log(`🧪 Testing raw AES decryption without AAD...`);
            try {
              const dataKey = Buffer.from(kmsResult.Plaintext);
              const decipher = crypto.createDecipheriv('aes-256-gcm', dataKey, Buffer.from(encEmail.iv, 'base64'));
              // No AAD set
              decipher.setAuthTag(Buffer.from(encEmail.tag, 'base64'));
              
              let decrypted = decipher.update(Buffer.from(encEmail.encryptedData, 'base64'));
              decrypted = Buffer.concat([decrypted, decipher.final()]);
              
              const result = decrypted.toString('utf8');
              console.log(`🎉 RAW DECRYPTION SUCCESS! Result: "${result}"`);
            } catch (rawError) {
              console.log(`❌ Raw AES decryption failed: ${rawError instanceof Error ? rawError.message : String(rawError)}`);
            }
          } else {
            console.log(`❌ KMS returned no plaintext data key`);
          }
        } catch (kmsError) {
          console.log(`❌ KMS data key decryption failed: ${kmsError instanceof Error ? kmsError.message : String(kmsError)}`);
        }
      } else {
        console.log(`\n✅ Found ${successCount} working AAD value(s)!`);
      }
      
    } else {
      console.log('❌ No encryptedEmail field found');
    }
    
  } catch (error) {
    console.error('❌ Error in test:', error);
  }
}

// Run the test
testEnhancedDecryption().catch(console.error);