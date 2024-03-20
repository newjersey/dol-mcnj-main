import { searchTrainingsFactory } from './searchTrainings';
import mockAxios from 'jest-mock-axios';
import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import { TrainingData } from '../training/TrainingResult';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
jest.mock("@sentry/node");
jest.mock("../../credentialengine/CredentialEngineAPI");

describe('searchTrainingsFactory', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it('should return cached results when available', async () => {
    const searchTrainings = searchTrainingsFactory();
  
    // First call to the API with a mock response
    const ceData: any = {
      data: { data: [], extra: {TotalResults: 0} },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults');
    getResultsSpy.mockResolvedValueOnce(ceData);
  
    await searchTrainings({ searchQuery: 'test', page: 1, limit: 10 }); // Second call to the function to store data in cache
    const expectedData: any = {
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

    // Second call to the function to retrieve data from the cache
    const result2 = await searchTrainings({ searchQuery: 'test', page: 1, limit: 10 });
    expect(result2).toEqual(expectedData);
    expect(getResultsSpy).toHaveBeenCalledTimes(1); // API should only be called once
  });
  

  
  it('should return results from the API when cache is not available', async () => {
    const searchTrainings = searchTrainingsFactory();

    const ceData: AxiosResponse<any, any> = {
      data: { data: [], extra: {TotalResults: 0} },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };
    const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults');
    getResultsSpy.mockResolvedValueOnce(ceData);

    const result = await searchTrainings({ searchQuery: 'test', page: 1, limit: 10 });
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
    expect(result).toEqual(expectedData);
    expect(getResultsSpy).toHaveBeenCalled();
  });

  it('should throw an error when API request fails', async () => {
    const searchTrainings = searchTrainingsFactory();
    const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults');
    getResultsSpy.mockRejectedValueOnce(new Error('API error'));

    try {
      await searchTrainings({ searchQuery: 'test', page: 1, limit: 10 });
    } catch (error:any) {
      expect(error.message).toEqual("Failed to fetch results from Credential Engine API");
    }
    expect(credentialEngineAPI.getResults).toHaveBeenCalled();
  });
});