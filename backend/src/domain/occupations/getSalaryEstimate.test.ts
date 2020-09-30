import { StubDataClient } from "../test-objects/StubDataClient";
import { GetSalaryEstimate } from "../types";
import { getSalaryEstimateFactory } from "./getSalaryEstimate";
import { buildOccupation } from "../test-objects/factories";

describe("getSalaryEstimate", () => {
  let getSalaryEstimate: GetSalaryEstimate;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    stubDataClient = StubDataClient();
    getSalaryEstimate = getSalaryEstimateFactory(stubDataClient);
  });

  it("uses the oes hybrid soc to get salary estimate", async () => {
    stubDataClient.getOESOccupationBySoc.mockResolvedValue(
      buildOccupation({ soc: "some-oes-soc" })
    );
    stubDataClient.getSalaryEstimateBySoc.mockResolvedValue({ mediansalary: "" });

    await getSalaryEstimate("2018-soc");

    expect(stubDataClient.getOESOccupationBySoc).toHaveBeenCalledWith("2018-soc");
    expect(stubDataClient.getSalaryEstimateBySoc).toHaveBeenCalledWith("some-oes-soc");
  });

  it("should return value as a number type", async () => {
    const dirtyText = "38,260";

    stubDataClient.getOESOccupationBySoc.mockResolvedValue(buildOccupation({}));
    stubDataClient.getSalaryEstimateBySoc.mockResolvedValue({ mediansalary: dirtyText });

    const medianSalary = await getSalaryEstimate("15-1134");

    expect(medianSalary).toBe(38260);
  });

  it("should return null if data is unavailable", async () => {
    stubDataClient.getOESOccupationBySoc.mockResolvedValue(buildOccupation({}));
    stubDataClient.getSalaryEstimateBySoc.mockRejectedValue({});

    const medianSalary = await getSalaryEstimate("15-1134");

    expect(medianSalary).toBe(null);
  });
});
