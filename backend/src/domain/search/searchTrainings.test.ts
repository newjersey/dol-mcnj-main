import { searchTrainingsFactory } from './searchTrainings';
import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import { TrainingData } from '../training/TrainingResult';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {StubDataClient} from "../test-objects/StubDataClient";
import {mockCredentialEngineApiData} from "../test-objects/mockCredentialEngineApiData";
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

describe('searchTrainingsFactory', () => {
  const stubDataClient = StubDataClient();
  const searchTrainings = searchTrainingsFactory(stubDataClient);
  const mockTrainingResults = mockCredentialEngineApiData;
  const mockTrainingResult = mockTrainingResults[0];

  const mockApiResponse: AxiosResponse = {
    data: { data: [mockTrainingResult], extra: { TotalResults: 1 } },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  };

  const emptyApiResponse: AxiosResponse = {
    data: { data: [], extra: {TotalResults: 0} },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  };

  const expectedEmptyData: TrainingData = {
    data: [],
    meta: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      previousPage: null
    }
  };

  beforeEach(() => {
    // Mock Redis to return cache miss by default
    mockRedis.get.mockResolvedValue(null);
    mockRedis.set.mockResolvedValue('OK');
    
    // Mock DataClient methods
    stubDataClient.getCIPsInDemand.mockResolvedValue([]);
    stubDataClient.findCipDefinitionByCip.mockResolvedValue(null);
    stubDataClient.findOutcomeDefinition.mockResolvedValue(null);
    stubDataClient.getLocalExceptionsByCip.mockResolvedValue([]);
    
    // Mock console methods to avoid log spam in tests
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
    // Close Redis connection to prevent Jest warning
    if (mockRedis.quit) {
      await mockRedis.quit();
    }
  });

  it('should fetch results from the Credential Engine API and transform data correctly', async () => {
    const query = 'data science';
    
    // Mock API to return successful response
    const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults')
      .mockResolvedValue(mockApiResponse);

    // Call the searchTrainings function
    const searchResults = await searchTrainings({ 
      searchQuery: query, 
      page: 1, 
      limit: 10 
    });

    // Assertions based on the actual implementation behavior
    expect(searchResults).toHaveProperty('data');
    expect(searchResults).toHaveProperty('meta');
    expect(searchResults.meta).toHaveProperty('currentPage', 1);
    expect(searchResults.meta).toHaveProperty('itemsPerPage', 10);
    expect(Array.isArray(searchResults.data)).toBe(true);
    
    // Verify API was called
    expect(getResultsSpy).toHaveBeenCalled();
    
    // Verify Redis caching was attempted
    expect(mockRedis.get).toHaveBeenCalled();
    expect(mockRedis.set).toHaveBeenCalled();
  });

  it('should handle API errors gracefully', async () => {
    const query = 'invalid query';
    
    // Mock API to throw an error
    const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults')
      .mockRejectedValue(new Error('API request failed'));

    // Call should not throw, but handle errors gracefully
    const searchResults = await searchTrainings({ 
      searchQuery: query, 
      page: 1, 
      limit: 10 
    });

    // Should return empty results when API fails
    expect(searchResults.data).toEqual([]);
    expect(searchResults.meta.totalItems).toBe(0);
    expect(getResultsSpy).toHaveBeenCalled();
  });

  it('should return cached results when available', async () => {
    const cachedData = {
      results: [],
      totalResults: 0
    };
    
    // Mock Redis to return cached data
    mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));
    
    const result = await searchTrainings({ 
      searchQuery: 'test', 
      page: 1, 
      limit: 10 
    });
    
    expect(result).toEqual(expectedEmptyData);
    expect(mockRedis.get).toHaveBeenCalled();
    // Should not call API when cache hit
    expect(credentialEngineAPI.getResults).not.toHaveBeenCalled();
  });

  it('should return results from the API when cache is not available', async () => {
    // Mock cache miss
    mockRedis.get.mockResolvedValue(null);
    
    const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults')
      .mockResolvedValue(emptyApiResponse);
    
    const result = await searchTrainings({ 
      searchQuery: 'test_no_cache', 
      page: 1, 
      limit: 10 
    });
    
    expect(result.data).toEqual([]);
    expect(result.meta.totalItems).toBe(0);
    expect(getResultsSpy).toHaveBeenCalled();
    expect(mockRedis.set).toHaveBeenCalled(); // Should cache the result
  });

  it('should handle API request failures gracefully with fallback', async () => {
    // Mock cache miss
    mockRedis.get.mockResolvedValue(null);
    
    const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults')
      .mockRejectedValue(new Error('Failed to fetch results from Credential Engine API.'));
    
    const result = await searchTrainings({ 
      searchQuery: 'test error', 
      page: 1, 
      limit: 10 
    });
    
    // Should handle errors gracefully and return empty results
    expect(result.data).toEqual([]);
    expect(result.meta.totalItems).toBe(0);
    expect(getResultsSpy).toHaveBeenCalled();
  });

  it('should handle pagination correctly', async () => {
    // Mock cache miss
    mockRedis.get.mockResolvedValue(null);
    
    const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults')
      .mockResolvedValue(emptyApiResponse);
    
    const result = await searchTrainings({ 
      searchQuery: 'test', 
      page: 2, 
      limit: 5 
    });
    
    // When no results are found, pagination logic clamps to page 1
    // This is defensive behavior to prevent invalid page numbers
    expect(result.meta.currentPage).toBe(1);
    expect(result.meta.itemsPerPage).toBe(5);
    expect(result.meta.totalPages).toBe(1);
    expect(result.meta.totalItems).toBe(0);
    expect(getResultsSpy).toHaveBeenCalled();
  });

  it('should handle sorting parameters', async () => {
    // Mock cache miss
    mockRedis.get.mockResolvedValue(null);
    
    const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults')
      .mockResolvedValue(emptyApiResponse);
    
    // Test different sort options
    await searchTrainings({ 
      searchQuery: 'test', 
      page: 1, 
      limit: 10, 
      sort: 'asc' 
    });
    
    await searchTrainings({ 
      searchQuery: 'test', 
      page: 1, 
      limit: 10, 
      sort: 'desc' 
    });
    
    await searchTrainings({ 
      searchQuery: 'test', 
      page: 1, 
      limit: 10, 
      sort: 'best_match' 
    });
    
    expect(getResultsSpy).toHaveBeenCalledTimes(3);
  });

});
