import { searchTrainingsFactory } from './searchTrainings';
import { DataClient } from '../DataClient';
import { DeliveryType } from '../DeliveryType';
import { CalendarLength } from '../CalendarLength';
import { TrainingResult, TrainingData } from '../training/TrainingResult';
import { jest } from '@jest/globals';

// Mock the external dependencies
jest.mock('../../credentialengine/CredentialEngineAPI', () => ({
  credentialEngineAPI: {
    searchLearningOpportunities: jest.fn(),
  },
}));

jest.mock('../../infrastructure/redis/redisClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

// Import the mocked modules
import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import redis from '../../infrastructure/redis/redisClient';

describe('searchTrainings - Integration Testing', () => {
  let mockDataClient: jest.Mocked<DataClient>;
  let searchTrainings: ReturnType<typeof searchTrainingsFactory>;
  let mockCredentialEngineAPI: jest.Mocked<typeof credentialEngineAPI>;
  let mockRedis: jest.Mocked<typeof redis>;

  beforeEach(() => {
    mockDataClient = {
      findOccupationsByCip: jest.fn(),
      findSocDefinitionBySoc: jest.fn(),
      findCipDefinitionBySoc2018: jest.fn(),
      findCipDefinitionByCip: jest.fn(),
      findOutcomeDefinition: jest.fn(),
      find2018OccupationsBySoc2010: jest.fn(),
      find2010OccupationsBySoc2018: jest.fn(),
      findLocalExceptionsBySoc: jest.fn(),
      getLocalExceptionsByCip: jest.fn(),
      getLocalExceptionsBySoc: jest.fn(),
      getOccupationsInDemand: jest.fn(),
      getCIPsInDemand: jest.fn(),
      getEducationTextBySoc: jest.fn(),
      getSalaryEstimateBySoc: jest.fn(),
      getOESOccupationBySoc: jest.fn(),
      getNeighboringOccupations: jest.fn(),
    } as jest.Mocked<DataClient>;

    searchTrainings = searchTrainingsFactory(mockDataClient);
    mockCredentialEngineAPI = credentialEngineAPI as jest.Mocked<typeof credentialEngineAPI>;
    mockRedis = redis as jest.Mocked<typeof redis>;

    jest.clearAllMocks();
  });

  describe('End-to-End Search Workflow', () => {
    it('should handle complete search workflow with caching', async () => {
      // Mock Redis cache miss
      mockRedis.get.mockResolvedValue(null);

      // Mock successful API response
      const mockApiResponse = {
        '@graph': [
          {
            '@id': 'test-1',
            'ceterms:name': { en: 'Advanced Nursing Program' },
            'ceterms:ownedBy': [{ 'ceterms:name': { en: 'Healthcare Institute' } }],
            'ceterms:deliveryType': [
              { '@id': 'deliveryType:OnlineOnly' }
            ],
            'ceterms:estimatedDuration': [
              { 'ceterms:exactDuration': 'P6M' }
            ],
            'ceterms:totalCost': [
              { 'ceterms:price': 15000 }
            ],
          }
        ],
        '@context': {},
        'ceterms:totalResults': 1
      };

      mockCredentialEngineAPI.searchLearningOpportunities.mockResolvedValue(mockApiResponse);

      // Mock DataClient methods
      mockDataClient.getCIPsInDemand.mockResolvedValue([]);
      mockDataClient.findCipDefinitionByCip.mockResolvedValue([]);
      mockDataClient.findOutcomeDefinition.mockResolvedValue({} as any);

      // Execute search
      const result = await searchTrainings({
        searchQuery: 'nursing',
        page: 1,
        limit: 10,
        sort: 'best_match',
        cip_code: '51.3801',
        format: ['online'],
        complete_in: [CalendarLength.SIX_TO_TWELVE_MONTHS],
        county: 'Bergen',
        in_demand: true,
        max_cost: 20000,
        languages: ['en'],
        miles: 25,
        services: ['placement'],
        soc_code: '29-1141',
        zipcode: '07630'
      });

      // Verify API was called
      expect(mockCredentialEngineAPI.searchLearningOpportunities).toHaveBeenCalled();

      // Verify caching behavior
      expect(mockRedis.get).toHaveBeenCalled();
      expect(mockRedis.set).toHaveBeenCalled();

      // Verify result structure
      expect(result).toHaveProperty('trainings');
      expect(result).toHaveProperty('meta');
      expect(Array.isArray(result.trainings)).toBe(true);
    });

    it('should return cached results when available', async () => {
      // Mock Redis cache hit
      const cachedResult = {
        trainings: [{ id: 'cached-1', name: 'Cached Program' }],
        meta: { totalItems: 1, currentPage: 1, totalPages: 1 }
      };
      
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedResult));

      const result = await searchTrainings({
        searchQuery: 'nursing',
        page: 1,
        limit: 10,
        sort: 'best_match'
      });

      // Should not call API when cache hit
      expect(mockCredentialEngineAPI.searchLearningOpportunities).not.toHaveBeenCalled();
      
      // Should return cached result
      expect(result).toEqual(cachedResult);
    });

    it('should fallback gracefully when Redis fails', async () => {
      // Mock Redis failure
      mockRedis.get.mockRejectedValue(new Error('Redis connection failed'));

      const mockApiResponse = {
        '@graph': [
          {
            '@id': 'test-1',
            'ceterms:name': { en: 'Test Program' },
          }
        ],
        '@context': {},
        'ceterms:totalResults': 1
      };

      mockCredentialEngineAPI.searchLearningOpportunities.mockResolvedValue(mockApiResponse);
      mockDataClient.getCIPsInDemand.mockResolvedValue([]);

      const result = await searchTrainings({
        searchQuery: 'nursing',
        page: 1,
        limit: 10,
        sort: 'best_match'
      });

      // Should still call API
      expect(mockCredentialEngineAPI.searchLearningOpportunities).toHaveBeenCalled();
      
      // Should return API result
      expect(result).toHaveProperty('trainings');
      expect(result).toHaveProperty('meta');
    });
  });

  describe('Complex Filter Combinations', () => {
    it('should handle all filter types simultaneously', async () => {
      mockRedis.get.mockResolvedValue(null);

      const complexFilters = {
        searchQuery: 'healthcare',
        page: 1,
        limit: 10,
        sort: 'best_match',
        cip_code: '51.3801',
        format: ['online', 'blended'],
        complete_in: [
          CalendarLength.THREE_TO_FIVE_MONTHS,
          CalendarLength.SIX_TO_TWELVE_MONTHS
        ],
        county: 'Bergen',
        in_demand: true,
        max_cost: 25000,
        languages: ['en', 'es'],
        miles: 50,
        services: ['placement', 'childcare'],
        soc_code: '29-1141',
        zipcode: '07630'
      };

      mockCredentialEngineAPI.searchLearningOpportunities.mockResolvedValue({
        '@graph': [],
        '@context': {},
        'ceterms:totalResults': 0
      });

      mockDataClient.getCIPsInDemand.mockResolvedValue([]);

      await searchTrainings(complexFilters);

      expect(mockCredentialEngineAPI.searchLearningOpportunities).toHaveBeenCalled();
    });

    it('should handle boundary values correctly', async () => {
      mockRedis.get.mockResolvedValue(null);

      const boundaryFilters = {
        searchQuery: 'test',
        page: 1,
        limit: 1,
        sort: 'best_match',
        max_cost: 0,
        miles: 1,
      };

      mockCredentialEngineAPI.searchLearningOpportunities.mockResolvedValue({
        '@graph': [],
        '@context': {},
        'ceterms:totalResults': 0
      });

      mockDataClient.getCIPsInDemand.mockResolvedValue([]);

      await searchTrainings(boundaryFilters);

      expect(mockCredentialEngineAPI.searchLearningOpportunities).toHaveBeenCalled();
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle API timeouts gracefully', async () => {
      mockRedis.get.mockResolvedValue(null);

      // Mock API timeout
      mockCredentialEngineAPI.searchLearningOpportunities.mockRejectedValue(
        new Error('Request timeout')
      );

      await expect(
        searchTrainings({
          searchQuery: 'nursing',
          page: 1,
          limit: 10,
          sort: 'best_match'
        })
      ).rejects.toThrow('Request timeout');

      // Should not cache error results
      expect(mockRedis.set).not.toHaveBeenCalled();
    });

    it('should handle malformed API responses', async () => {
      mockRedis.get.mockResolvedValue(null);

      // Mock malformed response
      mockCredentialEngineAPI.searchLearningOpportunities.mockResolvedValue(null as any);

      await expect(
        searchTrainings({
          searchQuery: 'nursing',
          page: 1,
          limit: 10,
          sort: 'best_match'
        })
      ).rejects.toThrow();
    });

    it('should handle partial API failures', async () => {
      mockRedis.get.mockResolvedValue(null);

      // Mock response with some valid data
      const partialResponse = {
        '@graph': [
          {
            '@id': 'valid-1',
            'ceterms:name': { en: 'Valid Program' },
          },
          {
            '@id': 'valid-2',
            'ceterms:name': { en: 'Another Valid Program' },
          }
        ],
        '@context': {},
        'ceterms:totalResults': 2
      };

      mockCredentialEngineAPI.searchLearningOpportunities.mockResolvedValue(partialResponse);
      mockDataClient.getCIPsInDemand.mockResolvedValue([]);

      const result = await searchTrainings({
        searchQuery: 'nursing',
        page: 1,
        limit: 10,
        sort: 'best_match'
      });

      // Should process valid entries
      expect(result.trainings).toBeDefined();
      expect(result.trainings.every((item: TrainingResult) => item && item.id)).toBe(true);
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large result sets efficiently', async () => {
      mockRedis.get.mockResolvedValue(null);

      // Mock large dataset
      const largeDataset = {
        '@graph': Array.from({ length: 1000 }, (_, i) => ({
          '@id': `program-${i}`,
          'ceterms:name': { en: `Program ${i}` },
        })),
        '@context': {},
        'ceterms:totalResults': 10000
      };

      mockCredentialEngineAPI.searchLearningOpportunities.mockResolvedValue(largeDataset);
      mockDataClient.getCIPsInDemand.mockResolvedValue([]);

      const startTime = Date.now();
      const result = await searchTrainings({
        searchQuery: 'popular',
        page: 1,
        limit: 1000,
        sort: 'best_match'
      });
      const endTime = Date.now();

      // Should complete within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(5000);
      expect(result.trainings).toBeDefined();
    });

    it('should handle concurrent requests correctly', async () => {
      mockRedis.get.mockResolvedValue(null);

      const mockResponse = {
        '@graph': [{ '@id': 'test-1', 'ceterms:name': { en: 'Test Program' } }],
        '@context': {},
        'ceterms:totalResults': 1
      };

      mockCredentialEngineAPI.searchLearningOpportunities.mockResolvedValue(mockResponse);
      mockDataClient.getCIPsInDemand.mockResolvedValue([]);

      // Execute multiple concurrent searches
      const promises = Array.from({ length: 5 }, (_, i) =>
        searchTrainings({
          searchQuery: `query-${i}`,
          page: 1,
          limit: 10,
          sort: 'best_match'
        })
      );

      const results = await Promise.all(promises);

      // All should complete successfully
      expect(results).toHaveLength(5);
      results.forEach((result: TrainingData) => {
        expect(result).toHaveProperty('trainings');
        expect(result).toHaveProperty('meta');
      });

      // API should be called for each unique query
      expect(mockCredentialEngineAPI.searchLearningOpportunities).toHaveBeenCalledTimes(5);
    });
  });
});
