import { GetOpenJobsCount } from "../domain/types";
import axios from "axios";
import careerOneStopTestData from "./careerOneStopTestData.json";
import { CareerOneStopClient } from "./CareerOneStopClient";

jest.mock("axios");

describe("CareerOneStopClient", () => {
  let getOpenJobsCount: GetOpenJobsCount;
  let mockedAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockedAxios = axios as jest.Mocked<typeof axios>;
    getOpenJobsCount = CareerOneStopClient(
        "wwww.some-cool-url.com",
        "FAKE-USERID",
        "FAKE-AUTH-TOKEN"
    );
  });

  it("returns the jobcount for the queried soc", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: careerOneStopTestData });

    const jobsCount = await getOpenJobsCount("15-1134");
    expect(jobsCount).toEqual(1710);

    expect(mockedAxios.get).toHaveBeenCalledWith(
        "wwww.some-cool-url.com/v1/jobsearch/FAKE-USERID/15-1134/NJ/1000/0/0/0/10/0?source=NLx&showFilters=false",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer FAKE-AUTH-TOKEN",
          },
        }
    );
  });

  it("returns null if the call to career one stop fails", async () => {
    mockedAxios.get.mockRejectedValue({});
    const jobsCount = await getOpenJobsCount("15-1134");
    expect(jobsCount).toEqual(null);
  });
});
