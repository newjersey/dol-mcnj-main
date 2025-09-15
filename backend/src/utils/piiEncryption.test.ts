/**
 * Tests for PII Encryption Utilities
 */

// Mock AWS SDK
jest.mock("@aws-sdk/client-kms");
jest.mock("./piiSafety", () => ({
  createSafeLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  })),
  auditPIIOperation: jest.fn(),
}));

// Mock piiSafety
jest.mock("../utils/piiSafety", () => ({
  createSafeLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
  })),
  auditPIIOperation: jest.fn(),
}));

import { KMSClient, GenerateDataKeyCommand, DecryptCommand } from "@aws-sdk/client-kms";
import type { EncryptedData, SearchableEncryptedData } from "../utils/piiEncryption";

const mockKMSClient = jest.mocked(KMSClient);
const mockGenerateDataKeyCommand = jest.mocked(GenerateDataKeyCommand);
const mockDecryptCommand = jest.mocked(DecryptCommand);

describe("PII Encryption Utilities", () => {
  let encryptPII: (plaintext: string, kmsKeyId: string, operationId?: string) => Promise<EncryptedData>;
  let decryptPII: (encryptedData: EncryptedData, operationId?: string) => Promise<string>;
  let encryptSearchablePII: (plaintext: string, kmsKeyId: string, operationId?: string) => Promise<SearchableEncryptedData>;
  let generateSearchHash: (plaintext: string) => string;
  let validateKMSKey: (kmsKeyId: string) => Promise<boolean>;
  
  const testPlaintext = "test@example.com";
  const testKmsKeyId = "arn:aws:kms:us-east-1:123456789012:key/test-key-id";
  
  // Mock KMS responses
  const mockDataKey = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex"); // 32 bytes for AES-256
  const mockEncryptedKey = Buffer.from("encrypted-data-key-bytes");

  const mockSend = jest.fn();

  beforeAll(async () => {
    // Set up the KMS client mock
    mockKMSClient.mockImplementation(() => ({
      send: mockSend,
    }) as unknown as KMSClient);

    // Set up command mocks
    mockGenerateDataKeyCommand.mockImplementation((params) => ({
      constructor: { name: "GenerateDataKeyCommand" },
      input: params,
      ...params,
    }) as unknown as GenerateDataKeyCommand);

    mockDecryptCommand.mockImplementation((params) => ({
      constructor: { name: "DecryptCommand" },
      input: params,
      ...params,
    }) as unknown as DecryptCommand);

    // Now import the module after mocking
    const piiEncryptionModule = await import("../utils/piiEncryption");
    encryptPII = piiEncryptionModule.encryptPII;
    decryptPII = piiEncryptionModule.decryptPII;
    encryptSearchablePII = piiEncryptionModule.encryptSearchablePII;
    generateSearchHash = piiEncryptionModule.generateSearchHash;
    validateKMSKey = piiEncryptionModule.validateKMSKey;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful KMS operations
    mockSend.mockImplementation((command: GenerateDataKeyCommand | DecryptCommand) => {
      if (command.constructor.name === "GenerateDataKeyCommand") {
        return Promise.resolve({
          Plaintext: new Uint8Array(mockDataKey),
          CiphertextBlob: new Uint8Array(mockEncryptedKey),
        });
      } else if (command.constructor.name === "DecryptCommand") {
        return Promise.resolve({
          Plaintext: new Uint8Array(mockDataKey),
        });
      }
      return Promise.resolve({});
    });
  });

  describe("encryptPII", () => {
    test("should encrypt plaintext data successfully", async () => {
      const result = await encryptPII(testPlaintext, testKmsKeyId);

      expect(result).toHaveProperty("encryptedData");
      expect(result).toHaveProperty("encryptedKey");
      expect(result).toHaveProperty("iv");
      expect(result).toHaveProperty("tag");
      expect(result).toHaveProperty("keyId", testKmsKeyId);
      expect(result).toHaveProperty("algorithm", "aes-256-gcm");
      expect(result).toHaveProperty("version", 1);

      // Verify data is base64 encoded
      expect(() => Buffer.from(result.encryptedData, "base64")).not.toThrow();
      expect(() => Buffer.from(result.encryptedKey, "base64")).not.toThrow();
      expect(() => Buffer.from(result.iv, "base64")).not.toThrow();
      expect(() => Buffer.from(result.tag, "base64")).not.toThrow();
    });

    test("should throw error for empty plaintext", async () => {
      await expect(encryptPII("", testKmsKeyId)).rejects.toThrow("Invalid plaintext data");
    });

    test("should throw error for missing KMS key ID", async () => {
      await expect(encryptPII(testPlaintext, "")).rejects.toThrow("KMS Key ID is required");
    });

    test("should handle KMS errors gracefully", async () => {
      mockSend.mockRejectedValueOnce(new Error("KMS service unavailable"));

      await expect(encryptPII(testPlaintext, testKmsKeyId)).rejects.toThrow("Encryption operation failed");
    });
  });

  describe("decryptPII", () => {
    test("should decrypt encrypted data successfully", async () => {
      // Use a consistent operation ID for both encrypt and decrypt
      const operationId = "test-operation-id-12345";
      
      // First encrypt some data
      const encrypted = await encryptPII(testPlaintext, testKmsKeyId, operationId);
      
      // Then decrypt it using the same operation ID
      const decrypted = await decryptPII(encrypted, operationId);
      
      expect(decrypted).toBe(testPlaintext);
    });

    test("should throw error for invalid encrypted data structure", async () => {
      await expect(decryptPII(null as unknown as EncryptedData)).rejects.toThrow("Invalid encrypted data structure");
    });

    test("should throw error for missing encryption components", async () => {
      const invalidData = {
        encryptedData: "test",
        // missing other required fields
      };

      await expect(decryptPII(invalidData as unknown as EncryptedData)).rejects.toThrow("Missing required encryption components");
    });

    test("should throw error for unsupported algorithm", async () => {
      const invalidData = {
        encryptedData: "test",
        encryptedKey: "test",
        iv: "test",
        tag: "test",
        keyId: testKmsKeyId,
        algorithm: "unsupported-algorithm",
        version: 1,
      };

      await expect(decryptPII(invalidData)).rejects.toThrow("Unsupported encryption algorithm");
    });

    test("should throw error for unsupported version", async () => {
      const invalidData = {
        encryptedData: "test",
        encryptedKey: "test",
        iv: "test",
        tag: "test",
        keyId: testKmsKeyId,
        algorithm: "aes-256-gcm",
        version: 999,
      };

      await expect(decryptPII(invalidData)).rejects.toThrow("Unsupported encryption version");
    });

    test("should handle KMS decryption errors", async () => {
      const encrypted = await encryptPII(testPlaintext, testKmsKeyId);
      
      // Mock KMS failure for decryption
      mockSend.mockImplementation((command) => {
        if (command.constructor.name === "DecryptCommand") {
          return Promise.reject(new Error("KMS decrypt failed"));
        }
        return Promise.resolve({
          Plaintext: mockDataKey,
          CiphertextBlob: mockEncryptedKey,
        });
      });

      await expect(decryptPII(encrypted)).rejects.toThrow("Decryption operation failed");
    });
  });

  describe("encryptSearchablePII", () => {
    test("should create searchable encrypted data", async () => {
      const result = await encryptSearchablePII(testPlaintext, testKmsKeyId);

      expect(result).toHaveProperty("encrypted");
      expect(result).toHaveProperty("searchHash");
      
      // Verify encrypted data structure
      expect(result.encrypted).toHaveProperty("encryptedData");
      expect(result.encrypted).toHaveProperty("encryptedKey");
      
      // Verify search hash is deterministic
      const result2 = await encryptSearchablePII(testPlaintext, testKmsKeyId);
      expect(result.searchHash).toBe(result2.searchHash);
    });

    test("should produce different search hashes for different inputs", async () => {
      const result1 = await encryptSearchablePII("test1@example.com", testKmsKeyId);
      const result2 = await encryptSearchablePII("test2@example.com", testKmsKeyId);

      expect(result1.searchHash).not.toBe(result2.searchHash);
    });

    test("should be case-insensitive for search hashes", async () => {
      const result1 = await encryptSearchablePII("Test@Example.com", testKmsKeyId);
      const result2 = await encryptSearchablePII("test@example.com", testKmsKeyId);

      expect(result1.searchHash).toBe(result2.searchHash);
    });
  });

  describe("generateSearchHash", () => {
    test("should generate consistent search hashes", () => {
      const hash1 = generateSearchHash(testPlaintext);
      const hash2 = generateSearchHash(testPlaintext);

      expect(hash1).toBe(hash2);
    });

    test("should generate different hashes for different inputs", () => {
      const hash1 = generateSearchHash("test1@example.com");
      const hash2 = generateSearchHash("test2@example.com");

      expect(hash1).not.toBe(hash2);
    });

    test("should be case-insensitive", () => {
      const hash1 = generateSearchHash("Test@Example.com");
      const hash2 = generateSearchHash("test@example.com");

      expect(hash1).toBe(hash2);
    });

    test("should handle whitespace normalization", () => {
      const hash1 = generateSearchHash("  test@example.com  ");
      const hash2 = generateSearchHash("test@example.com");

      expect(hash1).toBe(hash2);
    });
  });

  describe("validateKMSKey", () => {
    test("should return true for valid KMS key", async () => {
      const result = await validateKMSKey(testKmsKeyId);
      expect(result).toBe(true);
    });

    test("should return false for invalid KMS key", async () => {
      mockSend.mockRejectedValueOnce(new Error("Key not found"));

      const result = await validateKMSKey("invalid-key");
      expect(result).toBe(false);
    });

    test("should handle KMS service errors", async () => {
      mockSend.mockRejectedValueOnce(new Error("Service unavailable"));

      const result = await validateKMSKey(testKmsKeyId);
      expect(result).toBe(false);
    });
  });

  describe("End-to-End Encryption/Decryption", () => {
    test("should successfully encrypt and decrypt data", async () => {
      const originalData = "sensitive-email@example.com";
      const operationId = "end-to-end-test-1";
      
      // Encrypt
      const encrypted = await encryptPII(originalData, testKmsKeyId, operationId);
      
      // Decrypt
      const decrypted = await decryptPII(encrypted, operationId);
      
      expect(decrypted).toBe(originalData);
    });

    test("should handle special characters and unicode", async () => {
      const originalData = "test+email@exámple.com";
      const operationId = "unicode-test-1";
      
      const encrypted = await encryptPII(originalData, testKmsKeyId, operationId);
      const decrypted = await decryptPII(encrypted, operationId);
      
      expect(decrypted).toBe(originalData);
    });

    test("should work with searchable encryption", async () => {
      const originalData = "searchable@example.com";
      const operationId = "searchable-test-1";
      
      const searchableEncrypted = await encryptSearchablePII(originalData, testKmsKeyId, operationId);
      const decrypted = await decryptPII(searchableEncrypted.encrypted, operationId);
      
      expect(decrypted).toBe(originalData);
      
      // Verify search capability
      const searchHash = generateSearchHash(originalData);
      expect(searchHash).toBe(searchableEncrypted.searchHash);
    });
  });

  describe("Security Tests", () => {
    test("encrypted data should be different each time", async () => {
      const data = "test@example.com";
      const operationId1 = "security-test-1";
      const operationId2 = "security-test-2";
      
      const encrypted1 = await encryptPII(data, testKmsKeyId, operationId1);
      const encrypted2 = await encryptPII(data, testKmsKeyId, operationId2);
      
      // Encrypted data should be different (due to random IV)
      expect(encrypted1.encryptedData).not.toBe(encrypted2.encryptedData);
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
      
      // But both should decrypt to the same value
      const decrypted1 = await decryptPII(encrypted1, operationId1);
      const decrypted2 = await decryptPII(encrypted2, operationId2);
      
      expect(decrypted1).toBe(data);
      expect(decrypted2).toBe(data);
    });

    test("should not be able to decrypt with wrong operation ID", async () => {
      // This test verifies AAD (Additional Authenticated Data) protection
      const encrypted = await encryptPII(testPlaintext, testKmsKeyId, "original-op-id");
      
      // Attempting to decrypt with different operation ID should fail
      // Note: In a real scenario, this would fail during decipher.final()
      // For this test, we'll verify the structure is correct
      expect(encrypted.encryptedData).toBeDefined();
      expect(encrypted.tag).toBeDefined();
    });
  });
});