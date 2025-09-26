"use strict";
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
jest.mock('axios');
jest.mock('dns', () => ({
    resolveMx: jest.fn()
}));
jest.mock('crypto', () => (Object.assign(Object.assign({}, jest.requireActual('crypto')), { randomUUID: jest.fn(() => 'test-uuid-12345') })));
beforeEach(() => {
    jest.clearAllMocks();
});
