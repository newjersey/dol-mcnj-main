/**
 * Test setup for handling AWS SDK and module mocking
 */

// Mock AWS SDK modules before they are imported
jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: jest.fn()
  }))
}));

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockImplementation(() => ({
      send: jest.fn()
    }))
  },
  ScanCommand: jest.fn(),
  QueryCommand: jest.fn()
}));

jest.mock('@aws-sdk/client-kms', () => ({
  KMSClient: jest.fn().mockImplementation(() => ({
    send: jest.fn()
  })),
  DecryptCommand: jest.fn(),
  GenerateDataKeyCommand: jest.fn()
}));

jest.mock('@aws-sdk/client-ses', () => ({
  SES: jest.fn().mockImplementation(() => ({
    send: jest.fn()
  })),
  SendEmailCommand: jest.fn()
}));

jest.mock('@aws-sdk/client-s3', () => ({
  S3: jest.fn().mockImplementation(() => ({
    send: jest.fn()
  })),
  PutObjectCommand: jest.fn()
}));

// Mock external API libraries
jest.mock('axios');

// Mock Node.js built-in modules
jest.mock('dns', () => ({
  resolveMx: jest.fn()
}));

// Mock crypto module
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(() => 'test-uuid-12345')
}));

// Set up global beforeEach for all tests
beforeEach(() => {
  jest.clearAllMocks();
});