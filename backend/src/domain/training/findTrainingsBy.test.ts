import { findTrainingsByFactory } from './findTrainingsBy';
import mockAxios from 'jest-mock-axios';
import { credentialEngineAPI } from '../../credentialengine/CredentialEngineAPI';
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { StubDataClient } from '../test-objects/StubDataClient';
import ceRecords from '../test-objects/ceTestData.json';
import expectedResult from './findTrainigsByExpectedTestData.json';
import {AxiosResponse, InternalAxiosRequestConfig} from "axios";

jest.mock("../../credentialengine/CredentialEngineAPI");

describe('findTrainingsByFactory', () => {
  afterEach(() => {
    mockAxios.reset();
  });


  beforeEach(() => {
    jest.resetAllMocks(); // ✅ Reset mocks between tests to prevent conflicts

    // ✅ Mock getCtidFromURL to extract CTID correctly
    jest.spyOn(credentialEngineUtils, 'getCtidFromURL').mockImplementation(async (url) => {
      const lastSlashIndex = url.lastIndexOf("/");
      return url.substring(lastSlashIndex + 1);
    });

    // ✅ Mock getResourceByCTID to return a CE record
    jest.spyOn(credentialEngineAPI, 'getResourceByCTID').mockImplementation(async (ctid) => {
      const record = ceRecords.find(rec => rec['ceterms:ctid'] === ctid);
      if (!record) {
        console.error(`CTID not found in mock data: ${ctid}`);
        return null; // Simulate API returning null for missing records
      }
      return record; // Directly return the record
    });

    // ✅ Fix `getResults` to return the correct AxiosResponse format
    jest.spyOn(credentialEngineAPI, 'getResults').mockImplementation(
      async (
        query: object, // ✅ Ensures compatibility with expected function signature
      ): Promise<AxiosResponse<{ data: typeof ceRecords }>> => {
        // Type assertion to ensure query has the expected key
        const ctidQuery = query as { "ceterms:ctid"?: string };

        if (!ctidQuery["ceterms:ctid"]) {
          throw new Error("Query object is missing 'ceterms:ctid'");
        }

        const result = ceRecords.filter(
          (record) => record["ceterms:ctid"] === ctidQuery["ceterms:ctid"]
        );

        return {
          data: { data: result }, // ✅ Ensures API response structure matches expectations
          status: 200,
          statusText: "OK",
          headers: {}, // ✅ Matches AxiosResponse type
          config: {} as InternalAxiosRequestConfig, // ✅ Ensures correct Axios typing
        };
      }
    );


    // ✅ Mock additional dependencies if needed
  });



  it('should return the correct trainings for selector "ID"', async () => {
    const dataClient = StubDataClient();
    dataClient.getCIPsInDemand = jest.fn().mockResolvedValue([
      {
        cip: '11.1003',
        cipcode: '111003',
        ciptitle: 'Computer and Information Systems Security/Auditing/Information Assurance.',
      },
    ]);
    dataClient.getLocalExceptionsByCip = jest.fn().mockResolvedValue([]);
    dataClient.findOccupationsByCip = jest.fn().mockResolvedValue([{ title: 'test', soc: '123' }]);

    const findTrainingsBy = findTrainingsByFactory(dataClient);
    const testCTID = 'ce-73263b7f-07fd-4c4a-8caa-f31bab4b3de5';

    // Ensure the test CTID exists in mock data
    const existsInMockData = ceRecords.some((record) => record['ceterms:ctid'] === testCTID);
    expect(existsInMockData).toBe(true);

    // Execute function
    const trainings = await findTrainingsBy(1, [testCTID]);

    // Validate expected vs actual results
    expect(trainings).toEqual(expectedResult);
  });
});
