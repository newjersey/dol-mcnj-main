#!/usr/bin/env npx ts-node

/**
 * Test current encryption/decryption cycle to verify the implementation works
 */

import * as crypto from 'crypto';
import { KMSClient, DecryptCommand, GenerateDataKeyCommand } from '@aws-sdk/client-kms';

const region = process.env.AWS_REGION || 'us-east-1';
const kmsKeyId = process.env.KMS_KEY_ID;

console.log('🧪 Testing current encryption/decryption implementation...');

const kmsClient = new KMSClient({ region });

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

interface EncryptedData {
  encryptedData: string;
  encryptedKey: string;
  iv: string;
  tag: string;
  keyId: string;
  algorithm: string;
  version: number;
}

async function testEncryptDecryptCycle() {
  try {
    const testEmail = "test@example.com";
    const operationId = crypto.randomUUID();
    
    console.log(`📝 Test data: "${testEmail}"`);
    console.log(`🆔 Operation ID: ${operationId}`);
    
    // ENCRYPT
    console.log('\n🔐 Encrypting...');
    
    const dataKeyCommand = new GenerateDataKeyCommand({
      KeyId: kmsKeyId,
      KeySpec: "AES_256"
    });
    
    const { Plaintext: dataKey, CiphertextBlob } = await kmsClient.send(dataKeyCommand);
    
    if (!dataKey || !CiphertextBlob) {
      throw new Error("Failed to generate data key");
    }
    
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, dataKey, iv);
    cipher.setAAD(Buffer.from(operationId)); // Use operation ID as AAD
    
    let encrypted = cipher.update(testEmail, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const tag = cipher.getAuthTag();
    
    const encryptedResult: EncryptedData = {
      encryptedData: encrypted,
      encryptedKey: Buffer.from(CiphertextBlob).toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
      keyId: kmsKeyId!,
      algorithm: ALGORITHM,
      version: 1
    };
    
    console.log('✅ Encryption successful');
    console.log(`📊 Encrypted data length: ${encryptedResult.encryptedData.length} chars`);
    
    // DECRYPT with SAME operation ID
    console.log('\n🔓 Decrypting with SAME operation ID...');
    
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedResult.encryptedKey, 'base64'),
      KeyId: encryptedResult.keyId
    });
    
    const { Plaintext: decryptedDataKey } = await kmsClient.send(decryptCommand);
    
    if (!decryptedDataKey) {
      throw new Error("Failed to decrypt data key");
    }
    
    const decipher = crypto.createDecipheriv(ALGORITHM, decryptedDataKey, Buffer.from(encryptedResult.iv, 'base64'));
    decipher.setAAD(Buffer.from(operationId)); // Use SAME operation ID
    decipher.setAuthTag(Buffer.from(encryptedResult.tag, 'base64'));
    
    let decrypted = decipher.update(encryptedResult.encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    console.log(`✅ Decryption successful: "${decrypted}"`);
    console.log(`🎯 Match: ${decrypted === testEmail ? 'YES' : 'NO'}`);
    
    // DECRYPT with DIFFERENT operation ID (this should fail)
    console.log('\n🔓 Decrypting with DIFFERENT operation ID...');
    
    const differentOpId = crypto.randomUUID();
    console.log(`🆔 Different Operation ID: ${differentOpId}`);
    
    try {
      const decipher2 = crypto.createDecipheriv(ALGORITHM, decryptedDataKey, Buffer.from(encryptedResult.iv, 'base64'));
      decipher2.setAAD(Buffer.from(differentOpId)); // Use DIFFERENT operation ID
      decipher2.setAuthTag(Buffer.from(encryptedResult.tag, 'base64'));
      
      let decrypted2 = decipher2.update(encryptedResult.encryptedData, 'base64', 'utf8');
      decrypted2 += decipher2.final('utf8');
      
      console.log(`❌ Unexpected success: "${decrypted2}"`);
    } catch (error) {
      console.log(`✅ Expected failure: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Test the actual database record format
    console.log('\n🔍 Testing database record format...');
    
    const dbFormatTest = {
      encryptedData: "cxb8DhSjTY6e6ur33uvKEUyOi7k=",
      encryptedKey: "AQIDAHjaur8lPVdqsG6nWvZAtdWjp23STn6nxIMGUstrUYUyogG0UzYL0j0qsnUqKeoQ9WnsAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMow4HCS4zNlTYhXIFAgEQgDuokwu8KpM3qyd7+CRUE8GLwRWJtLvM8Xd/QENLCLpiFGE+3elTLE9STdroivd//+T8wmRIecHkD1jHkw==",
      keyId: "885df373-247c-44c6-ad18-1dc495a3230f",
      tag: "I+rZo5pcN3KCnNPkD4AOFQ==",
      iv: "X0+/L6ymwQ9Glz+WZNp6aQ==",
      version: 1,
      algorithm: "aes-256-gcm"
    };
    
    // Try to decrypt the actual database record using the current implementation
    console.log('🧪 Testing current decryption code on database record...');
    
    try {
      const dbDecryptCommand = new DecryptCommand({
        CiphertextBlob: Buffer.from(dbFormatTest.encryptedKey, 'base64'),
        KeyId: dbFormatTest.keyId
      });
      
      const { Plaintext: dbDataKey } = await kmsClient.send(dbDecryptCommand);
      
      if (!dbDataKey) {
        throw new Error("Failed to decrypt database data key");
      }
      
      // Try with a few guessed operation IDs
      const testOperationIds = [
        crypto.randomUUID(), // Random UUID
        'default-operation-id',
        '',
        'email-encryption',
        'pii-encryption'
      ];
      
      for (const testOpId of testOperationIds) {
        try {
          const dbDecipher = crypto.createDecipheriv(ALGORITHM, dbDataKey, Buffer.from(dbFormatTest.iv, 'base64'));
          dbDecipher.setAAD(Buffer.from(testOpId));
          dbDecipher.setAuthTag(Buffer.from(dbFormatTest.tag, 'base64'));
          
          let dbDecrypted = dbDecipher.update(dbFormatTest.encryptedData, 'base64', 'utf8');
          dbDecrypted += dbDecipher.final('utf8');
          
          console.log(`🎉 SUCCESS with operation ID "${testOpId}": "${dbDecrypted}"`);
          break;
        } catch (error) {
          console.log(`❌ Failed with operation ID "${testOpId}": ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Database record test failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testEncryptDecryptCycle().catch(console.error);