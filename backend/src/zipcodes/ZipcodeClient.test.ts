import axios from "axios";
import { GetZipCodesInRadius } from "../domain/types";
import { ZipcodeClient } from "./ZipcodeClient";

jest.mock("axios");

describe("ZipcodeClient", () => {
  let getZipCodesInRadius: GetZipCodesInRadius;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios = axios as jest.Mocked<typeof axios>;
    getZipCodesInRadius = ZipcodeClient("www.test-zips.com", "api_key");
  });

  it("requests for zip code radius and returns as list of strings", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        zip_codes: ["11223", "11214", "11229", "11234"],
      },
    });

    const zipCodes = await getZipCodesInRadius("11225", "5");
    expect(zipCodes).toEqual(["11223", "11214", "11229", "11234"]);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "www.test-zips.com/rest/api_key/radius.json/11225/5/miles?minimal"
    );
  });

  it("rejects when the zipcode lookup fails", (done) => {
    mockedAxios.get.mockRejectedValue({});
    getZipCodesInRadius("11225", "5").catch(() => done());
  });
});
