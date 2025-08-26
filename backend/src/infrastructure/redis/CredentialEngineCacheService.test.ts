import { CredentialEngineCacheService } from './CredentialEngineCacheService';
import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import { redisClient } from './redisClient';

// Mock the dependencies
jest.mock('../../credentialengine/CredentialEngineAPI');
jest.mock('./redisClient');
jest.mock('@sentry/node');

const mockCredentialEngineAPI = credentialEngineAPI as jest.Mocked<typeof credentialEngineAPI>;
const mockRedisClient = redisClient as jest.Mocked<typeof redisClient>;

describe('CredentialEngineCacheService', () => {
  let cacheService: CredentialEngineCacheService;

  beforeEach(() => {
    jest.clearAllMocks();
    cacheService = new CredentialEngineCacheService();
  });

  describe('getResults', () => {
    const mockQuery = { test: 'query' };
    const mockResponse = { 
      data: { 
        data: [{ id: 1, name: 'Test Program' }], 
        extra: { TotalResults: 1 } 
      } 
    };

    it('should return cached result when cache hit', async () => {
      // Arrange
      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockResponse));

      // Act
      const result = await cacheService.getResults(mockQuery, 0, 10);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockRedisClient.get).toHaveBeenCalledWith(expect.stringContaining('ce_api:search:'));
      expect(mockCredentialEngineAPI.getResults).not.toHaveBeenCalled();
    });

    it('should fetch from API and cache when cache miss', async () => {
      // Arrange
      mockRedisClient.get.mockResolvedValue(null);
      mockCredentialEngineAPI.getResults.mockResolvedValue(mockResponse);
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      const result = await cacheService.getResults(mockQuery, 0, 10);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockCredentialEngineAPI.getResults).toHaveBeenCalledWith(mockQuery, 0, 10);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        expect.stringContaining('ce_api:search:'),
        JSON.stringify(mockResponse),
        'EX',
        1800 // SEARCH_RESULTS_TTL
      );
    });

    it('should fallback to direct API call when caching fails', async () => {
      // Arrange
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'));
      mockCredentialEngineAPI.getResults.mockResolvedValue(mockResponse);

      // Act
      const result = await cacheService.getResults(mockQuery, 0, 10);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockCredentialEngineAPI.getResults).toHaveBeenCalledWith(mockQuery, 0, 10);
    });
  });

  describe('getResourceByCTID', () => {
    const mockCTID = 'ce-12345';
    const mockResource = { id: mockCTID, name: 'Test Resource' };

    it('should return cached result when cache hit', async () => {
      // Arrange
      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockResource));

      // Act
      const result = await cacheService.getResourceByCTID(mockCTID);

      // Assert
      expect(result).toEqual(mockResource);
      expect(mockRedisClient.get).toHaveBeenCalledWith(`ce_api:resource:${mockCTID}`);
      expect(mockCredentialEngineAPI.getResourceByCTID).not.toHaveBeenCalled();
    });

    it('should fetch from API and cache when cache miss', async () => {
      // Arrange
      mockRedisClient.get.mockResolvedValue(null);
      mockCredentialEngineAPI.getResourceByCTID.mockResolvedValue(mockResource);
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      const result = await cacheService.getResourceByCTID(mockCTID);

      // Assert
      expect(result).toEqual(mockResource);
      expect(mockCredentialEngineAPI.getResourceByCTID).toHaveBeenCalledWith(mockCTID);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `ce_api:resource:${mockCTID}`,
        JSON.stringify(mockResource),
        'EX',
        7200 // RESOURCE_DATA_TTL
      );
    });
  });

  describe('getEnvelopeByCTID', () => {
    const mockCTID = 'ce-12345';
    const mockEnvelope = { ctid: mockCTID, published_by: 'test-publisher' };

    it('should return cached result when cache hit', async () => {
      // Arrange
      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockEnvelope));

      // Act
      const result = await cacheService.getEnvelopeByCTID(mockCTID);

      // Assert
      expect(result).toEqual(mockEnvelope);
      expect(mockRedisClient.get).toHaveBeenCalledWith(`ce_api:envelope:${mockCTID}`);
      expect(mockCredentialEngineAPI.getEnvelopeByCTID).not.toHaveBeenCalled();
    });

    it('should fetch from API and cache when cache miss', async () => {
      // Arrange
      mockRedisClient.get.mockResolvedValue(null);
      mockCredentialEngineAPI.getEnvelopeByCTID.mockResolvedValue(mockEnvelope);
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      const result = await cacheService.getEnvelopeByCTID(mockCTID);

      // Assert
      expect(result).toEqual(mockEnvelope);
      expect(mockCredentialEngineAPI.getEnvelopeByCTID).toHaveBeenCalledWith(mockCTID);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        `ce_api:envelope:${mockCTID}`,
        JSON.stringify(mockEnvelope),
        'EX',
        7200 // ENVELOPE_DATA_TTL
      );
    });
  });

  describe('warmCache', () => {
    it('should warm cache for provided CTIDs', async () => {
      // Arrange
      const ctids = ['ce-1', 'ce-2', 'ce-3'];
      const mockResource = { id: 'test' };
      const mockEnvelope = { ctid: 'test' };
      
      mockRedisClient.get.mockResolvedValue(null); // Cache miss
      mockCredentialEngineAPI.getResourceByCTID.mockResolvedValue(mockResource);
      mockCredentialEngineAPI.getEnvelopeByCTID.mockResolvedValue(mockEnvelope);
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      await cacheService.warmCache(ctids);

      // Assert
      expect(mockCredentialEngineAPI.getResourceByCTID).toHaveBeenCalledTimes(3);
      expect(mockCredentialEngineAPI.getEnvelopeByCTID).toHaveBeenCalledTimes(3);
      ctids.forEach(ctid => {
        expect(mockCredentialEngineAPI.getResourceByCTID).toHaveBeenCalledWith(ctid);
        expect(mockCredentialEngineAPI.getEnvelopeByCTID).toHaveBeenCalledWith(ctid);
      });
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      // Arrange
      const mockKeys = {
        keys: jest.fn()
      };
      mockRedisClient.getClient.mockReturnValue(mockKeys as any);
      
      mockKeys.keys
        .mockResolvedValueOnce(['ce_api:total1', 'ce_api:total2']) // total keys
        .mockResolvedValueOnce(['ce_api:search:1']) // search keys
        .mockResolvedValueOnce(['ce_api:resource:1', 'ce_api:resource:2']) // resource keys
        .mockResolvedValueOnce(['ce_api:graph:1']) // graph keys
        .mockResolvedValueOnce([]); // envelope keys

      // Act
      const stats = await cacheService.getCacheStats();

      // Assert
      expect(stats).toEqual({
        totalKeys: 2,
        searchKeys: 1,
        resourceKeys: 2,
        graphKeys: 1,
        envelopeKeys: 0
      });
    });
  });

  describe('clearCache', () => {
    it('should clear all credential engine cache entries', async () => {
      // Arrange
      const mockKeys = ['ce_api:key1', 'ce_api:key2'];
      const mockRedisCommands = {
        keys: jest.fn().mockResolvedValue(mockKeys),
        del: jest.fn().mockResolvedValue(2)
      };
      mockRedisClient.getClient.mockReturnValue(mockRedisCommands as any);

      // Act
      await cacheService.clearCache();

      // Assert
      expect(mockRedisCommands.keys).toHaveBeenCalledWith('ce_api:*');
      expect(mockRedisCommands.del).toHaveBeenCalledWith(...mockKeys);
    });
  });
});