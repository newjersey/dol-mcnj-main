import { RedisClient } from './redisClient';

// Mock ioredis
jest.mock('ioredis', () => {
  const mockRedis = {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    ping: jest.fn().mockResolvedValue('PONG'),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    keys: jest.fn(),
    on: jest.fn(),
    dbsize: jest.fn().mockResolvedValue(0),
    info: jest.fn().mockResolvedValue(''),
  };

  return {
    __esModule: true,
    default: jest.fn(() => mockRedis),
    Cluster: jest.fn(() => mockRedis),
  };
});

describe('RedisClient', () => {
  let redisClient: RedisClient;

  beforeEach(() => {
    jest.clearAllMocks();
    redisClient = new RedisClient({
      host: 'localhost',
      port: 6379,
      keyPrefix: 'test:',
    });
  });

  afterEach(async () => {
    await redisClient.disconnect();
  });

  describe('Connection Management', () => {
    it('should initialize with provided config', () => {
      expect(redisClient).toBeDefined();
    });

    it('should connect successfully', async () => {
      await expect(redisClient.connect()).resolves.not.toThrow();
    });

    it('should disconnect successfully', async () => {
      await expect(redisClient.disconnect()).resolves.not.toThrow();
    });

    it('should perform health check', async () => {
      const isHealthy = await redisClient.healthCheck();
      expect(isHealthy).toBe(true);
    });
  });

  describe('Basic Operations', () => {
    beforeEach(async () => {
      await redisClient.connect();
    });

    it('should set and get values', async () => {
      const mockClient = redisClient.getClient() as any;
      mockClient.get.mockResolvedValue('test-value');
      mockClient.set.mockResolvedValue('OK');

      await redisClient.set('test-key', 'test-value');
      const value = await redisClient.get('test-key');

      expect(mockClient.set).toHaveBeenCalledWith('test-key', 'test-value');
      expect(value).toBe('test-value');
    });

    it('should set values with expiration', async () => {
      const mockClient = redisClient.getClient() as any;
      mockClient.set.mockResolvedValue('OK');

      await redisClient.set('test-key', 'test-value', 'EX', 3600);

      expect(mockClient.set).toHaveBeenCalledWith('test-key', 'test-value', 'EX', 3600);
    });

    it('should delete keys', async () => {
      const mockClient = redisClient.getClient() as any;
      mockClient.del.mockResolvedValue(1);

      const result = await redisClient.del('test-key');

      expect(mockClient.del).toHaveBeenCalledWith('test-key');
      expect(result).toBe(1);
    });

    it('should check key existence', async () => {
      const mockClient = redisClient.getClient() as any;
      mockClient.exists.mockResolvedValue(1);

      const exists = await redisClient.exists('test-key');

      expect(mockClient.exists).toHaveBeenCalledWith('test-key');
      expect(exists).toBe(1);
    });

    it('should set key expiration', async () => {
      const mockClient = redisClient.getClient() as any;
      mockClient.expire.mockResolvedValue(1);

      const result = await redisClient.expire('test-key', 3600);

      expect(mockClient.expire).toHaveBeenCalledWith('test-key', 3600);
      expect(result).toBe(1);
    });

    it('should find keys by pattern', async () => {
      const mockClient = redisClient.getClient() as any;
      mockClient.keys.mockResolvedValue(['test:key1', 'test:key2']);

      const keys = await redisClient.keys('test:*');

      expect(mockClient.keys).toHaveBeenCalledWith('test:*');
      expect(keys).toEqual(['test:key1', 'test:key2']);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      const mockClient = redisClient.getClient() as any;
      mockClient.ping.mockRejectedValue(new Error('Connection failed'));

      const isHealthy = await redisClient.healthCheck();
      expect(isHealthy).toBe(false);
    });

    it('should handle get operation errors', async () => {
      const mockClient = redisClient.getClient() as any;
      mockClient.get.mockRejectedValue(new Error('Redis error'));

      const value = await redisClient.get('test-key');
      expect(value).toBeNull();
    });

    it('should handle set operation errors', async () => {
      const mockClient = redisClient.getClient() as any;
      mockClient.set.mockRejectedValue(new Error('Redis error'));

      const result = await redisClient.set('test-key', 'test-value');
      expect(result).toBeNull();
    });
  });

  describe('Status Monitoring', () => {
    it('should return connection status', () => {
      const status = redisClient.getStatus();
      expect(status).toHaveProperty('isHealthy');
      expect(status).toHaveProperty('connectionAttempts');
    });
  });
});