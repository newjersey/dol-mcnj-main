import * as crypto from "crypto";

// Simple mock implementations to avoid AWS SDK type conflicts
const mockKMSSend = jest.fn();
const mockGenerateDataKeyCommand = jest.fn();
const mockDecryptCommand = jest.fn();
const mockLogger = { info: jest.fn(), error: jest.fn() };
const mockAuditPIIOperation = jest.fn();

jest.mock("@aws-sdk/client-kms", () => ({
  KMSClient: jest.fn().mockImplementation(() => ({ send: mockKMSSend })),
  GenerateDataKeyCommand: mockGenerateDataKeyCommand,
  DecryptCommand: mockDecryptCommand
}));

jest.mock("./piiSafety", () => ({
  createSafeLogger: jest.fn(() => mockLogger),
  auditPIIOperation: mockAuditPIIOperation
}));

// Use crypto for test data generation
const testIV = crypto.randomBytes(16);
const testTag = crypto.randomBytes(16);

jest.mock("@aws-sdk/client-kms", () => ({
  KMSClient: jest.fn().mockImplementation(() => ({ send: mockKMSSend })),
  GenerateDataKeyCommand: mockGenerateDataKeyCommand,
  DecryptCommand: mockDecryptCommand
}));

jest.mock("./piiSafety", () => ({
  createSafeLogger: jest.fn(() => mockLogger),
  auditPIIOperation: mockAuditPIIOperation
}));

import { 
  generateSearchHash, 
  encryptPII, 
  decryptPII,
  validateKMSKey,
  EncryptedData 
} from "./piiEncryption";

describe("PII Encryption Utilities", () => {
  const mockKmsKeyId = "arn:aws:kms:us-east-1:123456789012:key/test-key";
  const testPlaintext = "test@example.com";

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup simple successful KMS responses
    mockKMSSend.mockResolvedValue({
      Plaintext: Buffer.from("mock32bytekey1234567890123456789012"),
      CiphertextBlob: Buffer.from("mockEncryptedKey")
    });
    
    mockGenerateDataKeyCommand.mockImplementation((input) => ({ input }));
    mockDecryptCommand.mockImplementation((input) => ({ input }));
  });

  describe("generateSearchHash", () => {
    it("should generate consistent hashes for the same input", () => {
      const hash1 = generateSearchHash("test@example.com");
      const hash2 = generateSearchHash("test@example.com");
      
      expect(hash1).toBe(hash2);
      expect(hash1).toBeTruthy();
      expect(typeof hash1).toBe('string');
    });

    it("should generate different hashes for different inputs", () => {
      const hash1 = generateSearchHash("test1@example.com");
      const hash2 = generateSearchHash("test2@example.com");
      
      expect(hash1).not.toBe(hash2);
    });

    it("should be case-insensitive and normalize input", () => {
      const hash1 = generateSearchHash("TEST@EXAMPLE.COM");
      const hash2 = generateSearchHash("test@example.com");
      const hash3 = generateSearchHash("  Test@Example.Com  ");
      
      expect(hash1).toBe(hash2);
      expect(hash2).toBe(hash3);
    });

    it("should return base64 encoded string", () => {
      const hash = generateSearchHash("test@example.com");
      
      expect(() => Buffer.from(hash, 'base64')).not.toThrow();
      expect(Buffer.from(hash, 'base64').toString('base64')).toBe(hash);
    });

    it("should handle edge cases", () => {
      expect(() => generateSearchHash("")).not.toThrow();
      expect(() => generateSearchHash("   ")).not.toThrow();
      expect(() => generateSearchHash("a")).not.toThrow();
      expect(() => generateSearchHash("user+tag@sub-domain.example.com")).not.toThrow();
    });
  });

  describe("encryptPII - validation only", () => {
    it("should validate required inputs", async () => {
      await expect(encryptPII("", mockKmsKeyId)).rejects.toThrow("Invalid plaintext data");
      await expect(encryptPII(testPlaintext, "")).rejects.toThrow("KMS Key ID is required");
      await expect(encryptPII(null as unknown as string, mockKmsKeyId)).rejects.toThrow("Invalid plaintext data");
    });

    it("should validate input types properly", async () => {
      await expect(encryptPII(123 as unknown as string, mockKmsKeyId)).rejects.toThrow("Invalid plaintext data");
      await expect(encryptPII(undefined as unknown as string, mockKmsKeyId)).rejects.toThrow("Invalid plaintext data");
      await expect(encryptPII({} as unknown as string, mockKmsKeyId)).rejects.toThrow("Invalid plaintext data");
    });
  });

  describe("decryptPII - validation only", () => {
    const sampleEncryptedData: EncryptedData = {
      encryptedData: "mockEncryptedData",
      encryptedKey: "mockEncryptedKey",
      iv: testIV.toString('base64'),
      tag: testTag.toString('base64'),
      keyId: mockKmsKeyId,
      algorithm: "aes-256-gcm",
      version: 1
    };

    it("should validate encrypted data structure", async () => {
      await expect(decryptPII(null as unknown as EncryptedData)).rejects.toThrow("Invalid encrypted data structure");
      await expect(decryptPII({} as EncryptedData)).rejects.toThrow("Missing required encryption components");
      
      const incompleteData = { ...sampleEncryptedData };
      delete (incompleteData as Partial<EncryptedData>).encryptedKey;
      await expect(decryptPII(incompleteData as EncryptedData)).rejects.toThrow("Missing required encryption components");
    });

    it("should validate encryption algorithm and version", async () => {
      const wrongAlgorithm = { ...sampleEncryptedData, algorithm: "aes-128-cbc" };
      await expect(decryptPII(wrongAlgorithm)).rejects.toThrow("Unsupported encryption algorithm");

      const wrongVersion = { ...sampleEncryptedData, version: 2 };
      await expect(decryptPII(wrongVersion)).rejects.toThrow("Unsupported encryption version");
    });
  });

  describe("validateKMSKey", () => {
    it("should return true for valid KMS key", async () => {
      mockKMSSend.mockResolvedValueOnce({
        CiphertextBlob: Buffer.from("validResponse")
      });

      const result = await validateKMSKey(mockKmsKeyId);
      expect(result).toBe(true);
    });

    it("should return false for invalid KMS key", async () => {
      mockKMSSend.mockRejectedValueOnce(new Error("Key not found"));

      const result = await validateKMSKey("invalid-key-id");
      expect(result).toBe(false);
    });

    it("should return false if no CiphertextBlob returned", async () => {
      mockKMSSend.mockResolvedValueOnce({});

      const result = await validateKMSKey(mockKmsKeyId);
      expect(result).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should handle KMS failures gracefully in encryptPII", async () => {
      mockKMSSend.mockRejectedValueOnce(new Error("KMS service unavailable"));

      await expect(encryptPII(testPlaintext, mockKmsKeyId)).rejects.toThrow("Encryption operation failed");
      
      expect(mockAuditPIIOperation).toHaveBeenCalledWith(
        'CREATE',
        'EMAIL',
        false,
        undefined,
        expect.objectContaining({
          error: "KMS service unavailable"
        })
      );
    });

    it("should not expose sensitive data in error messages", async () => {
      mockKMSSend.mockRejectedValueOnce(new Error("Detailed AWS error with key info"));
      
      await expect(encryptPII(testPlaintext, mockKmsKeyId)).rejects.toThrow("Encryption operation failed");
      // Should not throw the original detailed error
    });
  });
});
