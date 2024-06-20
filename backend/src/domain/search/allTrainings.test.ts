import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { allTrainings } from "./allTrainings";
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import ceTestData from "../test-objects/ceTestData.json"
import expectedData from "../test-objects/allTrainingsTestData.json"

jest.mock("@sentry/node");
jest.mock("../../credentialengine/CredentialEngineAPI");

describe('allTrainings', () => {
  const getAllTrainings = allTrainings()
  const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults');
  const getAddressSpy = jest.spyOn(credentialEngineUtils, 'getAvailableAtAddresses')
  const ceData: AxiosResponse = {
    data: { data: ceTestData, extra: {TotalResults: 2} },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
   };

  afterEach(() => {
    jest.clearAllMocks()
  });

  it('should return all trainings', async () => {
    getResultsSpy.mockResolvedValue(ceData);
    getAddressSpy.mockResolvedValue([{city: 'Newark'}])
    const result = await getAllTrainings();
    expect(result).toEqual(expectedData);
    expect(getResultsSpy).toHaveBeenCalledTimes(2);
  });
});
