import { StubDataClient } from "../test-objects/StubDataClient";
import { GetSalaryEstimate } from "../types";
import { getSalaryEstimateFactory } from "./getSalaryEstimate";

describe("getSalaryEstimate", () => {
  let getSalaryEstimate: GetSalaryEstimate;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    stubDataClient = StubDataClient();
    getSalaryEstimate = getSalaryEstimateFactory(stubDataClient);
  });

  it("should return value as a number type", async () => {
    const dirtyText = "38,260";

    stubDataClient.getSalaryEstimateBySoc.mockResolvedValue({ mediansalary: dirtyText });

    const medianSalary = await getSalaryEstimate("15-1134");

    expect(medianSalary).toBe(38260);
  });

  it("should return null if data is unavailable", async () => {
    stubDataClient.getSalaryEstimateBySoc.mockRejectedValue({});

    const medianSalary = await getSalaryEstimate("15-1134");

    expect(medianSalary).toBe(null);
  });
});
