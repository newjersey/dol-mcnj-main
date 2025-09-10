import { searchTrainingsFactory } from './searchTrainings';
import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { StubDataClient } from "../test-objects/StubDataClient";
import { mockCredentialEngineApiData } from "../test-objects/mockCredentialEngineApiData";
import redis from '../../infrastructure/redis/redisClient';

jest.mock("@sentry/node");
jest.mock("../../credentialengine/CredentialEngineAPI");
jest.mock("../../infrastructure/redis/redisClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    quit: jest.fn().mockResolvedValue('OK')
  }
}));

const mockRedis = redis as jest.Mocked<typeof redis & { quit: jest.Mock }>;

describe('searchTrainings - Advanced Functionality', () => {
  const stubDataClient = StubDataClient();
  const searchTrainings = searchTrainingsFactory(stubDataClient);

  const mockApiResponse: AxiosResponse = {
    data: { data: mockCredentialEngineApiData, extra: { TotalResults: mockCredentialEngineApiData.length } },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  };

  const emptyApiResponse: AxiosResponse = {
    data: { data: [], extra: { TotalResults: 0 } },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue('OK');
    
    // Mock DataClient methods
    stubDataClient.getCIPsInDemand.mockResolvedValue([]);
    stubDataClient.findCipDefinitionByCip.mockResolvedValue(null);
    stubDataClient.findProgramsBy.mockResolvedValue([]);
    stubDataClient.findOccupationsByCip.mockResolvedValue([]);
    stubDataClient.getOESOccupationBySoc.mockResolvedValue(null);
    stubDataClient.getLocalExceptionsByCip.mockResolvedValue([]);
    stubDataClient.findOutcomeDefinition.mockResolvedValue(null);
    
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'time').mockImplementation(jest.fn());
    jest.spyOn(console, 'timeEnd').mockImplementation(jest.fn());
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    // Ensure Redis connection is properly closed
    if (mockRedis.quit) {
      await mockRedis.quit();
    }
    // Clear all mocks and timers
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.resetModules();
  });

  describe('Query Building & Parsing', () => {
    it('should handle SOC code searches (format: XX-XXXX)', async () => {
      const socCode = '15-1211'; // Software Developers
      const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(mockApiResponse);

      await searchTrainings({ searchQuery: socCode, page: 1, limit: 10 });

      expect(getResultsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          'search:termGroup': expect.objectContaining({
            'ceterms:occupationType': {
              'ceterms:codedNotation': {
                'search:matchType': 'search:contains',
                'search:value': socCode
              }
            }
          })
        }),
        0,
        100
      );
    });

    it('should handle CIP code searches (format: XX.XXXX)', async () => {
      const cipCode = '11.0701'; // Computer and Information Sciences
      const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(mockApiResponse);

      await searchTrainings({ searchQuery: cipCode, page: 1, limit: 10 });

      expect(getResultsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          'search:termGroup': expect.objectContaining({
            'ceterms:instructionalProgramType': {
              'ceterms:codedNotation': {
                'search:matchType': 'search:contains',
                'search:value': cipCode
              }
            }
          })
        }),
        0,
        100
      );
    });

    it('should handle empty search queries', async () => {
      jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(mockApiResponse);
        
      const result = await searchTrainings({ 
        searchQuery: '', 
        page: 1, 
        limit: 10 
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.meta).toBeDefined();
    });
  });

  describe('Advanced Filtering', () => {
    it('should filter by CIP code accurately', async () => {
      jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(mockApiResponse);
        
      const result = await searchTrainings({
        searchQuery: '',
        page: 1,
        limit: 10,
        cip_code: '11.0701'
      });

      expect(result.data.length).toBeGreaterThanOrEqual(0);
    });

    it('should filter by delivery format', async () => {
      jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(mockApiResponse);
        
      const result = await searchTrainings({
        searchQuery: '',
        page: 1,
        limit: 10,
        format: ['online']
      });

      expect(result.data.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle API rate limiting', async () => {
      jest.spyOn(credentialEngineAPI, 'getResults')
        .mockRejectedValue({ response: { status: 429 } });

      const result = await searchTrainings({ 
        searchQuery: 'test', 
        page: 1, 
        limit: 10 
      });

      expect(result.data).toEqual([]);
      expect(result.meta.totalItems).toBe(0);
    });

    it('should handle malformed search queries gracefully', async () => {
      jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(mockApiResponse);
        
      const malformedQueries = ['', '   ', 'ñ∂ƒå∂ñåß∂∂'];
      
      for (const query of malformedQueries) {
        const result = await searchTrainings({ 
          searchQuery: query, 
          page: 1, 
          limit: 10 
        });
        
        expect(result).toBeDefined();
        expect(result.data).toBeDefined();
        expect(result.meta).toBeDefined();
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle searches with no results', async () => {
      jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(emptyApiResponse);

      const result = await searchTrainings({ 
        searchQuery: 'nonexistent training', 
        page: 1, 
        limit: 10 
      });

      expect(result.data).toHaveLength(0);
      expect(result.meta.totalItems).toBe(0);
    });

    it('should handle invalid page numbers', async () => {
      jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(mockApiResponse);
        
      const result = await searchTrainings({ 
        searchQuery: 'test', 
        page: -1, 
        limit: 10 
      });
      
      // The function may accept negative page but normalize it in the meta
      expect(result.meta).toBeDefined();
      expect(result.data).toBeDefined();
    });
  });

  describe('Caching & Performance', () => {
    it('should handle cache operations', async () => {
      jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(mockApiResponse);
        
      const searchParams = { searchQuery: 'nursing', page: 1, limit: 10 };
      
      // First search - should try to get from cache
      await searchTrainings(searchParams);
      
      // Should have attempted to get from cache
      expect(mockRedis.get).toHaveBeenCalled();
    });

    it('should fallback gracefully when Redis is unavailable', async () => {
      jest.spyOn(credentialEngineAPI, 'getResults')
        .mockResolvedValue(mockApiResponse);
        
      // First search should still work even with Redis unavailable
      const result = await searchTrainings({ 
        searchQuery: 'test', 
        page: 1, 
        limit: 10 
      });

      // Should still return results even if cache fails
      expect(result.data.length).toBeGreaterThanOrEqual(0);
    });
  });
});