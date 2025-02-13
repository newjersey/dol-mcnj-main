import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { allTrainings } from "./allTrainings";
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import ceTestData from "../test-objects/ceTestData.json"
import expectedData from "../test-objects/allTrainingsTestData.json"
import {ContactPoint} from "../training/Training";

jest.mock("@sentry/node");
jest.mock("../../credentialengine/CredentialEngineAPI");

describe('allTrainings', () => {
  const getAllTrainings = allTrainings()
  const getResultsSpy = jest.spyOn(credentialEngineAPI, 'getResults');
  const getAddressSpy = jest.spyOn(credentialEngineUtils, 'getAvailableAtAddresses')

  afterEach(() => {
    jest.clearAllMocks()
  });

  it("should return all trainings", async () => {
    const ceData: AxiosResponse = {
      data: { data: ceTestData, extra: { TotalResults: ceTestData.length } },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    getResultsSpy.mockResolvedValue(ceData);
    getAddressSpy.mockImplementation(async (certificate) =>
      Promise.resolve(
        (certificate["ceterms:availableAt"] || []).flat().map(place => ({
          "@type": "ceterms:Place",
          street_address: place["ceterms:streetAddress"]?.["en-US"] || "",
          city: place["ceterms:addressLocality"]?.["en-US"] || "",
          state: place["ceterms:addressRegion"]?.["en-US"] || "",
          zipCode: place["ceterms:postalCode"] || "",
          county: "",
          targetContactPoints: (place["ceterms:targetContactPoint"] || []) as ContactPoint[]
        }))
      )
    );

    const result = await getAllTrainings();
    expect(result).toEqual(expectedData);
    expect(getResultsSpy).toHaveBeenCalledTimes(1);
    expect(getAddressSpy).toHaveBeenCalledTimes(ceTestData.length);
  });});
