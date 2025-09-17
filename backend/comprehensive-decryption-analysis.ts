#!/usr/bin/env npx ts-node

/**
 * Comprehensive decryption analysis script
 * This script will analyze the encrypted data structure and attempt various decryption strategies
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

console.log('🔍 Starting comprehensive decryption analysis...');
console.log(`Environment: Region=${region}, Table=${tableName}`);
console.log(`KMS Key ID: ${kmsKeyId ? kmsKeyId.substring(0, 20) + '...' : 'NOT SET'}`);
console.log(`Search Salt: ${searchSalt ? searchSalt.substring(0, 10) + '...' : 'NOT SET'}`);

const dynamoClient = new DynamoDBClient({ region });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const kmsClient = new KMSClient({ region });

interface EncryptedRecord {
  id?: string;
  pk?: string;
  recordId?: string;
  encryptedEmail?: any;
  encryptedFname?: any;
  encryptedLname?: any;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow any additional properties
}

async function analyzeEncryptedData() {
  try {
    console.log('\n📊 Fetching encrypted records...');
    
    const scanCommand = new ScanCommand({
      TableName: tableName,
      Limit: 10
    });
    
    const result = await docClient.send(scanCommand);
    const records = result.Items as EncryptedRecord[];
    
    console.log(`Found ${records.length} records to analyze`);
    
    for (let i = 0; i < Math.min(records.length, 3); i++) {
      const record = records[i];
      const recordId = record.id || record.pk || record.recordId || `record-${i + 1}`;
      console.log(`\n🔍 Analyzing record ${i + 1}: ${recordId}`);
      console.log(`    📊 Record keys: ${Object.keys(record).join(', ')}`);
      
      // Analyze the structure of encrypted data
      if (record.encryptedEmail) {
        await analyzeEncryptedField('email', record.encryptedEmail, recordId);
      }
      if (record.encryptedFname) {
        await analyzeEncryptedField('firstName', record.encryptedFname, recordId);
      }
      if (record.encryptedLname) {
        await analyzeEncryptedField('lastName', record.encryptedLname, recordId);
      }
    }
    
  } catch (error) {
    console.error('❌ Error in analysis:', error);
  }
}

async function analyzeEncryptedField(fieldName: string, encryptedData: any, recordId: string) {
  console.log(`\n  📝 Analyzing ${fieldName} field:`);
  
  try {
    let parsed: any;
    
    // Handle both string and object formats
    if (typeof encryptedData === 'string') {
      parsed = JSON.parse(encryptedData);
    } else if (typeof encryptedData === 'object' && encryptedData !== null) {
      parsed = encryptedData;
    } else {
      console.log(`    ❌ Unexpected data type: ${typeof encryptedData}`);
      console.log(`    Raw data: ${JSON.stringify(encryptedData)}`);
      return;
    }
    
    console.log(`    Structure: ${Object.keys(parsed).join(', ')}`);
    
    if (parsed.encryptedDataKey && parsed.iv && parsed.encryptedData && parsed.authTag) {
      console.log(`    ✅ Valid AES-GCM structure detected`);
      console.log(`    📊 Data key length: ${parsed.encryptedDataKey.length} chars`);
      console.log(`    📊 IV length: ${parsed.iv.length} chars`);
      console.log(`    📊 Encrypted data length: ${parsed.encryptedData.length} chars`);
      console.log(`    📊 Auth tag length: ${parsed.authTag.length} chars`);
      
      // Try to decrypt the data key first
      await tryDecryptDataKey(parsed.encryptedDataKey, recordId);
      
      // Try various AAD approaches
      await comprehensiveAADTest(parsed, fieldName, recordId);
    } else {
      console.log(`    ❌ Unexpected structure: ${JSON.stringify(parsed, null, 2)}`);
    }
    
  } catch (parseError) {
    console.log(`    ❌ Failed to process encrypted data: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    console.log(`    Raw data: ${JSON.stringify(encryptedData, null, 2)}`);
  }
}

async function tryDecryptDataKey(encryptedDataKey: string, recordId: string): Promise<Buffer | null> {
  console.log(`    🔑 Attempting data key decryption...`);
  
  try {
    const decryptCommand = new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedDataKey, 'base64')
    });
    
    const result = await kmsClient.send(decryptCommand);
    if (result.Plaintext) {
      console.log(`    ✅ Data key decrypted successfully! Length: ${result.Plaintext.length} bytes`);
      return Buffer.from(result.Plaintext);
    } else {
      console.log(`    ❌ Data key decryption returned no plaintext`);
      return null;
    }
  } catch (error) {
    console.log(`    ❌ Data key decryption failed: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

async function comprehensiveAADTest(encryptedStruct: any, fieldName: string, recordId: string) {
  console.log(`    🧪 Starting comprehensive AAD testing...`);
  
  const dataKey = await tryDecryptDataKey(encryptedStruct.encryptedDataKey, recordId);
  if (!dataKey) {
    console.log(`    ❌ Cannot test AAD without data key`);
    return;
  }
  
  // Generate all possible AAD values systematically
  const aadCandidates = generateAADCandidates(recordId);
  
  console.log(`    📊 Testing ${aadCandidates.length} AAD candidates...`);
  
  for (let i = 0; i < aadCandidates.length; i++) {
    const { description, aad } = aadCandidates[i];
    
    try {
      const decipher = crypto.createDecipheriv('aes-256-gcm', dataKey, Buffer.from(encryptedStruct.iv, 'base64'));
      decipher.setAAD(Buffer.from(aad, 'utf8'));
      decipher.setAuthTag(Buffer.from(encryptedStruct.authTag, 'base64'));
      
      let decrypted = decipher.update(Buffer.from(encryptedStruct.encryptedData, 'base64'));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      const result = decrypted.toString('utf8');
      console.log(`    🎉 SUCCESS! AAD #${i + 1}: ${description}`);
      console.log(`    📝 AAD value: "${aad}"`);
      console.log(`    📝 Decrypted result: "${result}"`);
      return result;
      
    } catch (error) {
      // Silent failure for systematic testing
      if (i < 10 || i % 10 === 0) {
        console.log(`    ❌ AAD #${i + 1} failed: ${description}`);
      }
    }
  }
  
  console.log(`    ❌ All ${aadCandidates.length} AAD candidates failed`);
}

function generateAADCandidates(recordId: string): Array<{description: string, aad: string}> {
  const candidates = [];
  
  // Basic patterns
  candidates.push({ description: 'Record ID only', aad: recordId });
  candidates.push({ description: 'Empty string', aad: '' });
  candidates.push({ description: 'Static string "pii"', aad: 'pii' });
  candidates.push({ description: 'Static string "email"', aad: 'email' });
  candidates.push({ description: 'Static string "encryption"', aad: 'encryption' });
  
  // Environment-based
  if (searchSalt) {
    candidates.push({ description: 'Search salt', aad: searchSalt });
    candidates.push({ description: 'Record ID + Search salt', aad: recordId + searchSalt });
    candidates.push({ description: 'Search salt + Record ID', aad: searchSalt + recordId });
  }
  
  if (kmsKeyId) {
    candidates.push({ description: 'KMS Key ID', aad: kmsKeyId });
    candidates.push({ description: 'Record ID + KMS Key ID', aad: recordId + kmsKeyId });
  }
  
  // Table name variations
  candidates.push({ description: 'Table name', aad: tableName });
  candidates.push({ description: 'Record ID + Table name', aad: recordId + tableName });
  candidates.push({ description: 'Table name (original)', aad: 'userSignUpEmails-encypted' });
  candidates.push({ description: 'Table name (corrected)', aad: 'userSignUpEmails-encrypted' });
  
  // Timestamp patterns (using record creation times from the export)
  const timestamps = [
    '2025-09-17T04:07:43.907Z',
    '2025-09-17T02:33:52.926Z', 
    '2025-09-17T03:01:28.834Z'
  ];
  
  timestamps.forEach(ts => {
    candidates.push({ description: `Timestamp: ${ts}`, aad: ts });
    candidates.push({ description: `Record ID + Timestamp: ${ts}`, aad: recordId + ts });
  });
  
  // Hash-based AAD (in case AAD was hashed)
  const hashCandidates = [recordId, searchSalt, kmsKeyId, tableName].filter((val): val is string => Boolean(val));
  hashCandidates.forEach(val => {
    const sha256 = crypto.createHash('sha256').update(val).digest('hex');
    const sha1 = crypto.createHash('sha1').update(val).digest('hex');
    candidates.push({ description: `SHA256(${val.substring(0, 20)}...)`, aad: sha256 });
    candidates.push({ description: `SHA1(${val.substring(0, 20)}...)`, aad: sha1 });
  });
  
  // Base64 variations of key values
  if (searchSalt) {
    try {
      const decoded = Buffer.from(searchSalt, 'base64').toString('utf8');
      candidates.push({ description: 'Base64 decoded search salt', aad: decoded });
    } catch (e) {
      // Not base64, skip
    }
  }
  
  // UUID patterns (extract UUID from record ID if possible)
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const uuidMatch = recordId.match(uuidPattern);
  if (uuidMatch) {
    candidates.push({ description: 'Extracted UUID', aad: uuidMatch[1] });
  }
  
  return candidates;
}

// Run the analysis
analyzeEncryptedData().catch(console.error);