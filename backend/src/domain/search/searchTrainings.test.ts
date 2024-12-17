import { searchTrainingsFactory } from './searchTrainings';
import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import { TrainingData } from '../training/TrainingResult';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {StubDataClient} from "../test-objects/StubDataClient";
import {mockCredentialEngineApiData} from "../test-objects/mockCredentialEngineApiData";

jest.mock("@sentry/node");
jest.mock("../../credentialengine/CredentialEngineAPI");

describe('searchTrainingsFactory', () => {
  const stubDataClient = StubDataClient();
  const searchTrainings = searchTrainingsFactory(stubDataClient);
  const mockTrainingResults = mockCredentialEngineApiData;
  const mockTrainingResult = mockTrainingResults[0];

  const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults').mockResolvedValueOnce({
    data: { data: mockTrainingResult, extra: { TotalResults: 1 } },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  } as AxiosResponse);


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

  it('should fetch results from the Credential Engine API and match test data', async () => {
    const query = 'data science';

    // Step 1: Mock the API response with complete config
    const mockedApiResponse: AxiosResponse = {
      data: { data: mockTrainingResult, extra: { TotalResults: 1 } },
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
      },
      config: {
        url: `https://sandbox.credentialengine.org/assistant/search/ctdl?q=${query}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${process.env.CE_AUTH_TOKEN}`,
        },
      } as InternalAxiosRequestConfig,
    };

    jest.spyOn(credentialEngineAPI, 'getResults').mockResolvedValueOnce(mockedApiResponse);

    // Step 2: Call the searchTrainings function
    const searchResults = await searchTrainings({ searchQuery: query, page: 1, limit: 10 });

    // Step 3: Perform assertions
    expect(searchResults.data).toEqual(mockTrainingResult);
    expect(searchResults.meta.totalItems).toEqual(1);

    // Ensure the API was called with the correct parameters
    expect(credentialEngineAPI.getResults).toHaveBeenCalledWith(query, 1, 10);
  });

  it('should handle API errors gracefully', async () => {
    const query = 'invalid query';

    // Step 1: Mock the API to reject with an error
    jest.spyOn(credentialEngineAPI, 'getResults').mockRejectedValueOnce(new Error('API request failed'));

    // Step 2: Call the searchTrainings function and expect it to throw
    await expect(searchTrainings({ searchQuery: query, page: 1, limit: 10 })).rejects.toThrow(
      'API request failed'
    );

    // Ensure the API was called
    expect(credentialEngineAPI.getResults).toHaveBeenCalledWith(query, 1, 10);
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
    getResultsSpy.mockRejectedValueOnce(new Error('Failed to fetch results from Credential Engine API.'));
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
      if (String(call).includes("ceterms:name")) {
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
      if (String(call).includes("ceterms:name")) {
        desc = true;
      }
    });
    expect(desc).toBe(true);
  });

  it('should handle default sorting correctly', async () => {
    // Test default sort
    getResultsSpy.mockResolvedValueOnce(ceData);
    await searchTrainings({ searchQuery: 'test_default_sorting', page: 1, limit: 10 });
    let defaultSort = false;
    getResultsSpy.mock.calls.forEach(call => {
      if (String(call).includes("^search:relevance")) {
        defaultSort = true;
      }
    });
    expect(defaultSort).toBe(true);
  });

});
