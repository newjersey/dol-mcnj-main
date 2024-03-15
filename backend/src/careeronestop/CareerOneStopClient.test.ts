import { GetOpenJobsCount } from "../domain/types";
import axios from "axios";
import { CareerOneStopClient } from "./CareerOneStopClient";
import careerOneStopTestData from "./careerOneStopTestData.json"

describe("CareerOneStopClient", () => {
  let getOpenJobsCount: GetOpenJobsCount;

  beforeEach(() => {
    getOpenJobsCount = CareerOneStopClient(
      "https://example.com",
      "user-id",
      "auth-token"
    );
  });

  it("returns the job count for the given SOC code", async () => {
    const mockResponse: any = {
      data: careerOneStopTestData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };

    jest.spyOn(axios, "get").mockResolvedValue(mockResponse);

    const result = await getOpenJobsCount("12-3456");

    expect(result).toEqual(1710);
    expect(axios.get).toHaveBeenCalledWith(
      "https://example.com/v1/jobsearch/user-id/12-3456/NJ/1000/0/0/0/10/0?source=NLx&showFilters=false",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer auth-token`,
        },
      }
    );
  })

  it("returns null if the call to career one stop fails", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error('API error'));
    const jobsCount = await getOpenJobsCount("15-1134");
    expect(jobsCount).toEqual(null);
  });
})