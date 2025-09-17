#!/usr/bin/env npx ts-node

/**
 * Deep diagnostic script to understand the encryption data format
 * This will examine the raw bytes and try different approaches
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

console.log('🔬 Deep diagnostic analysis of encryption format...');

const dynamoClient = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const kmsClient = new KMSClient({ region });

async function deepDiagnostic() {
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
    const encEmail = record.encryptedEmail;
    
    console.log('\n🔍 Raw data analysis:');
    console.log(`Full encrypted email object:`, JSON.stringify(encEmail, null, 2));
    
    // Analyze each component
    console.log('\n📊 Component analysis:');
    
    try {
      const encryptedDataBuffer = Buffer.from(encEmail.encryptedData, 'base64');
      console.log(`✅ encryptedData: ${encryptedDataBuffer.length} bytes`);
      console.log(`   Hex: ${encryptedDataBuffer.toString('hex').substring(0, 32)}...`);
    } catch (e) {
      console.log(`❌ encryptedData invalid base64: ${e}`);
    }
    
    try {
      const encryptedKeyBuffer = Buffer.from(encEmail.encryptedKey, 'base64');
      console.log(`✅ encryptedKey: ${encryptedKeyBuffer.length} bytes`);
      console.log(`   Hex: ${encryptedKeyBuffer.toString('hex').substring(0, 32)}...`);
    } catch (e) {
      console.log(`❌ encryptedKey invalid base64: ${e}`);
    }
    
    try {
      const ivBuffer = Buffer.from(encEmail.iv, 'base64');
      console.log(`✅ iv: ${ivBuffer.length} bytes`);
      console.log(`   Hex: ${ivBuffer.toString('hex')}`);
    } catch (e) {
      console.log(`❌ iv invalid base64: ${e}`);
    }
    
    try {
      const tagBuffer = Buffer.from(encEmail.tag, 'base64');
      console.log(`✅ tag: ${tagBuffer.length} bytes`);
      console.log(`   Hex: ${tagBuffer.toString('hex')}`);
    } catch (e) {
      console.log(`❌ tag invalid base64: ${e}`);
    }
    
    // Test KMS decryption in detail
    console.log('\n🔑 Detailed KMS analysis:');
    try {
      const decryptCommand = new DecryptCommand({
        CiphertextBlob: Buffer.from(encEmail.encryptedKey, 'base64')
      });
      
      const kmsResult = await kmsClient.send(decryptCommand);
      if (kmsResult.Plaintext) {
        const dataKey = Buffer.from(kmsResult.Plaintext);
        console.log(`✅ KMS decryption successful`);
        console.log(`   Data key length: ${dataKey.length} bytes`);
        console.log(`   Data key hex: ${dataKey.toString('hex')}`);
        
        // Now try different AES approaches
        console.log('\n🧪 Testing different AES decryption approaches:');
        
        const iv = Buffer.from(encEmail.iv, 'base64');
        const tag = Buffer.from(encEmail.tag, 'base64');
        const encryptedData = Buffer.from(encEmail.encryptedData, 'base64');
        
        // Approach 1: No AAD, standard order
        console.log('1️⃣ Testing: No AAD, standard order');
        try {
          const decipher1 = crypto.createDecipheriv('aes-256-gcm', dataKey, iv);
          decipher1.setAuthTag(tag);
          let decrypted1 = decipher1.update(encryptedData);
          decrypted1 = Buffer.concat([decrypted1, decipher1.final()]);
          console.log(`🎉 SUCCESS! Result: "${decrypted1.toString('utf8')}"`);
        } catch (e) {
          console.log(`❌ Failed: ${e instanceof Error ? e.message : String(e)}`);
        }
        
        // Approach 2: With empty AAD
        console.log('2️⃣ Testing: Empty string AAD');
        try {
          const decipher2 = crypto.createDecipheriv('aes-256-gcm', dataKey, iv);
          decipher2.setAAD(Buffer.from('', 'utf8'));
          decipher2.setAuthTag(tag);
          let decrypted2 = decipher2.update(encryptedData);
          decrypted2 = Buffer.concat([decrypted2, decipher2.final()]);
          console.log(`🎉 SUCCESS! Result: "${decrypted2.toString('utf8')}"`);
        } catch (e) {
          console.log(`❌ Failed: ${e instanceof Error ? e.message : String(e)}`);
        }
        
        // Approach 3: Different algorithm
        console.log('3️⃣ Testing: aes-256-cbc (wrong algorithm test)');
        try {
          const decipher3 = crypto.createDecipheriv('aes-256-cbc', dataKey, iv.slice(0, 16)); // CBC needs 16-byte IV
          let decrypted3 = decipher3.update(encryptedData);
          decrypted3 = Buffer.concat([decrypted3, decipher3.final()]);
          console.log(`🎉 SUCCESS! Result: "${decrypted3.toString('utf8')}"`);
        } catch (e) {
          console.log(`❌ Failed (expected): ${e instanceof Error ? e.message : String(e)}`);
        }
        
        // Approach 4: Check if IV/tag might be swapped
        console.log('4️⃣ Testing: Swapped IV and tag');
        try {
          const decipher4 = crypto.createDecipheriv('aes-256-gcm', dataKey, tag); // Use tag as IV
          decipher4.setAuthTag(iv); // Use IV as tag
          let decrypted4 = decipher4.update(encryptedData);
          decrypted4 = Buffer.concat([decrypted4, decipher4.final()]);
          console.log(`🎉 SUCCESS! Result: "${decrypted4.toString('utf8')}"`);
        } catch (e) {
          console.log(`❌ Failed: ${e instanceof Error ? e.message : String(e)}`);
        }
        
        // Approach 5: Check if there's additional data in the encrypted payload
        console.log('5️⃣ Testing: Different encrypted data interpretation');
        try {
          // Maybe the encrypted data includes some metadata?
          if (encryptedData.length > 16) {
            const possibleIV = encryptedData.slice(0, 16);
            const possiblePayload = encryptedData.slice(16);
            console.log(`   Trying embedded IV approach: IV=${possibleIV.toString('hex')}, Payload=${possiblePayload.length} bytes`);
            
            const decipher5 = crypto.createDecipheriv('aes-256-gcm', dataKey, possibleIV);
            decipher5.setAuthTag(tag);
            let decrypted5 = decipher5.update(possiblePayload);
            decrypted5 = Buffer.concat([decrypted5, decipher5.final()]);
            console.log(`🎉 SUCCESS! Result: "${decrypted5.toString('utf8')}"`);
          } else {
            console.log(`   Skipped: encrypted data too short (${encryptedData.length} bytes)`);
          }
        } catch (e) {
          console.log(`❌ Failed: ${e instanceof Error ? e.message : String(e)}`);
        }
        
        // Approach 6: Maybe the data key needs processing
        console.log('6️⃣ Testing: Processed data key');
        try {
          const processedKey = crypto.createHash('sha256').update(dataKey).digest().slice(0, 32);
          const decipher6 = crypto.createDecipheriv('aes-256-gcm', processedKey, iv);
          decipher6.setAuthTag(tag);
          let decrypted6 = decipher6.update(encryptedData);
          decrypted6 = Buffer.concat([decrypted6, decipher6.final()]);
          console.log(`🎉 SUCCESS! Result: "${decrypted6.toString('utf8')}"`);
        } catch (e) {
          console.log(`❌ Failed: ${e instanceof Error ? e.message : String(e)}`);
        }
        
      } else {
        console.log(`❌ KMS returned no plaintext`);
      }
    } catch (kmsError) {
      console.log(`❌ KMS decryption failed: ${kmsError instanceof Error ? kmsError.message : String(kmsError)}`);
    }
    
    console.log('\n🔍 Comparison with current encryption code:');
    console.log('Expected structure according to TypeScript interface:');
    console.log('- encryptedData: string (base64)');
    console.log('- encryptedKey: string (base64) ');
    console.log('- iv: string (base64)');
    console.log('- tag: string (base64)');
    console.log('- keyId: string');
    console.log('- algorithm: string');
    console.log('- version: number');
    console.log('\nActual structure in database:');
    console.log(`- encryptedData: ${typeof encEmail.encryptedData} (${encEmail.encryptedData?.length || 0} chars)`);
    console.log(`- encryptedKey: ${typeof encEmail.encryptedKey} (${encEmail.encryptedKey?.length || 0} chars)`);
    console.log(`- iv: ${typeof encEmail.iv} (${encEmail.iv?.length || 0} chars)`);
    console.log(`- tag: ${typeof encEmail.tag} (${encEmail.tag?.length || 0} chars)`);
    console.log(`- keyId: ${typeof encEmail.keyId} (${encEmail.keyId || 'undefined'})`);
    console.log(`- algorithm: ${typeof encEmail.algorithm} (${encEmail.algorithm || 'undefined'})`);
    console.log(`- version: ${typeof encEmail.version} (${encEmail.version || 'undefined'})`);
    
  } catch (error) {
    console.error('❌ Error in diagnostic:', error);
  }
}

// Run the diagnostic
deepDiagnostic().catch(console.error);