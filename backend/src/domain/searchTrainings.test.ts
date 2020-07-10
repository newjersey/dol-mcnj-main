import { searchTrainingsFactory } from "./searchTrainings";
import { buildProviderResult, buildTrainingResult } from "../test-objects/factories";
import { Status } from "./Training";
import { SearchTrainings } from "./types";
import { StubDataClient } from "../test-objects/StubDataClient";

describe("searchTrainings", () => {
  let searchTrainings: SearchTrainings;
  let stubDataClient: StubDataClient;

  beforeEach(() => {
    jest.resetAllMocks();
    stubDataClient = StubDataClient();

    searchTrainings = searchTrainingsFactory(stubDataClient);
  });

  it("gets matching trainings via keyword search and id lookup", async () => {
    const training1 = buildTrainingResult({ name: "training 1", id: "1" });
    const training2 = buildTrainingResult({ name: "training 2", id: "2" });

    stubDataClient.search.mockResolvedValue(["1", "2"]);
    stubDataClient.findTrainingsByIds.mockResolvedValue([training1, training2]);

    const searchResults = await searchTrainings("keyword");
    expect(searchResults).toEqual(expect.arrayContaining([training1, training2]));

    expect(stubDataClient.search).toHaveBeenCalledWith("keyword");
    expect(stubDataClient.findTrainingsByIds).toHaveBeenCalledWith(["1", "2"]);
  });

  it("gets all trainings when search query is empty/undefined", async () => {
    const allTrainings = [buildTrainingResult({}), buildTrainingResult({})];
    stubDataClient.findAllTrainings.mockResolvedValue(allTrainings);

    let searchResults = await searchTrainings("");
    expect(searchResults).toEqual(expect.arrayContaining(allTrainings));

    expect(stubDataClient.findAllTrainings).toHaveBeenCalled();
    expect(stubDataClient.search).not.toHaveBeenCalled();

    jest.resetAllMocks();
    stubDataClient.findAllTrainings.mockResolvedValue(allTrainings);

    searchResults = await searchTrainings(undefined);
    expect(searchResults).toEqual(expect.arrayContaining(allTrainings));

    expect(stubDataClient.findAllTrainings).toHaveBeenCalled();
    expect(stubDataClient.search).not.toHaveBeenCalled();
  });

  it("filters out results when training is suspended", async () => {
    stubDataClient.findTrainingsByIds.mockResolvedValue([
      buildTrainingResult({ id: "1", status: Status.APPROVED }),
      buildTrainingResult({ id: "2", status: Status.PENDING }),
      buildTrainingResult({ id: "3", status: Status.UNKNOWN }),
      buildTrainingResult({ id: "4", status: Status.SUSPENDED }),
    ]);

    const searchResults = await searchTrainings("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "2", "3"]);
  });

  it("filters out results when provider is suspended", async () => {
    stubDataClient.findTrainingsByIds.mockResolvedValue([
      buildTrainingResult({
        id: "1",
        provider: buildProviderResult({ status: Status.APPROVED }),
      }),
      buildTrainingResult({ id: "2", provider: buildProviderResult({ status: Status.PENDING }) }),
      buildTrainingResult({ id: "3", provider: buildProviderResult({ status: Status.UNKNOWN }) }),
      buildTrainingResult({
        id: "4",
        provider: buildProviderResult({ status: Status.SUSPENDED }),
      }),
    ]);

    const searchResults = await searchTrainings("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "2", "3"]);
  });
});
