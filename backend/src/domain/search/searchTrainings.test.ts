import { searchTrainingsFactory } from './searchTrainings';
import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import { TrainingData } from '../training/TrainingResult';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {StubDataClient} from "../test-objects/StubDataClient";

jest.mock("@sentry/node");
jest.mock("../../credentialengine/CredentialEngineAPI");

describe('searchTrainingsFactory', () => {
  const stubDataClient = StubDataClient();

  const searchTrainings = searchTrainingsFactory(stubDataClient);
  const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults');
  const ceData: AxiosResponse = {
    data: { data: [], extra: {TotalResults: 0} },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  };

  const expectedData: TrainingData = {
    data: [],
    meta: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      previousPage: null
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  });

  it('should return cached results when available', async () => {
    getResultsSpy.mockResolvedValueOnce(ceData);
    await searchTrainings({ searchQuery: 'test', page: 1, limit: 10 });
    // Second call to the function to retrieve data from the cache
    const result2 = await searchTrainings({ searchQuery: 'test', page: 1, limit: 10 });
    expect(result2).toEqual(expectedData);
    expect(getResultsSpy).toHaveBeenCalledTimes(1); // API should only be called once
  });
  
  it('should return results from the API when cache is not available', async () => {
    getResultsSpy.mockResolvedValueOnce(ceData);
    const result = await searchTrainings({ searchQuery: 'test_no_cache', page: 1, limit: 10 });
    expect(result).toEqual(expectedData);
    expect(getResultsSpy).toHaveBeenCalled();
  });

  it('should throw an error when API request fails', async () => {
    getResultsSpy.mockRejectedValueOnce(new Error('API error'));
    try {
      await searchTrainings({ searchQuery: 'test_error', page: 1, limit: 10 });
    } catch (error:unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual("Failed to fetch results from Credential Engine API.");
      }
    }
    expect(credentialEngineAPI.getResults).toHaveBeenCalled();
  });

  it('should handle asc sorting correctly', async () => {
    // Test ascending sort
    getResultsSpy.mockResolvedValueOnce(ceData);
    await searchTrainings({ searchQuery: 'test', page: 1, limit: 10, sort: 'asc' });
    let asc = false;
    getResultsSpy.mock.calls.forEach(call => {
      if (call.includes("ceterms:name")) {
        asc = true;
      }
    });
    expect(asc).toBe(true);
  });

  it('should handle desc sorting correctly', async () => {
    // Test descending sort
    getResultsSpy.mockResolvedValueOnce(ceData);
    await searchTrainings({ searchQuery: 'test', page: 1, limit: 10, sort: 'desc' });
    let desc = false;
    getResultsSpy.mock.calls.forEach(call => {
      if (call.includes("^ceterms:name")) {
        desc = true;
      }
    });
    expect(desc).toBe(true);
  });

  it('should handle default sorting correctly', async () => {
    // Test default sort
    getResultsSpy.mockResolvedValueOnce(ceData);
    await searchTrainings({ searchQuery: 'test_default_sorting', page: 1, limit: 10 });
    let deafultSort = false;
    getResultsSpy.mock.calls.forEach(call => {
      if (call.includes("^search:relevance")) {
        deafultSort = true;
      }
    });
    expect(deafultSort).toBe(true);
  });

});
