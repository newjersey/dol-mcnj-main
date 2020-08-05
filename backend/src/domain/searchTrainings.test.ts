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

  it("returns trainings", async () => {
    const training = buildTrainingResult({ highlight: "" });
    stubDataClient.search.mockResolvedValue([training.id]);
    stubDataClient.getHighlights.mockResolvedValue(["some highlight"]);
    stubDataClient.findTrainingResultsByIds.mockResolvedValue([training]);

    expect(await searchTrainings("some query")).toEqual([
      {
        ...training,
        highlight: "some highlight",
      },
    ]);
  });

  it("gets matching trainings via keyword search and id lookup", async () => {
    const training1 = buildTrainingResult({ name: "training 1", id: "1" });
    const training2 = buildTrainingResult({ name: "training 2", id: "2" });

    stubDataClient.search.mockResolvedValue(["1", "2"]);
    stubDataClient.findTrainingResultsByIds.mockResolvedValue([training1, training2]);
    stubDataClient.getHighlights.mockResolvedValue([training1.highlight, training2.highlight]);

    const searchResults = await searchTrainings("keyword");
    expect(searchResults).toEqual(expect.arrayContaining([training1, training2]));

    expect(stubDataClient.search).toHaveBeenCalledWith("keyword");
    expect(stubDataClient.findTrainingResultsByIds).toHaveBeenCalledWith(["1", "2"]);
  });

  it("accurately matches highlights when filtering out trainings", async () => {
    const training1 = buildTrainingResult({ name: "training 1", status: Status.SUSPENDED });
    const training2 = buildTrainingResult({ name: "training 2", status: Status.APPROVED });

    stubDataClient.search.mockResolvedValue(["1", "2"]);
    stubDataClient.findTrainingResultsByIds.mockResolvedValue([training1, training2]);
    stubDataClient.getHighlights.mockResolvedValue([
      "training 1 highlight",
      "training 2 highlight",
    ]);

    const searchResults = await searchTrainings("keyword");
    expect(searchResults).toEqual([
      {
        ...training2,
        highlight: "training 2 highlight",
      },
    ]);
  });

  it("gets all trainings when search query is empty/undefined", async () => {
    const allTrainings = [
      buildTrainingResult({ highlight: "" }),
      buildTrainingResult({ highlight: "" }),
    ];
    stubDataClient.findAllTrainingResults.mockResolvedValue(allTrainings);

    let searchResults = await searchTrainings("");
    expect(searchResults).toEqual(expect.arrayContaining(allTrainings));

    expect(stubDataClient.findAllTrainingResults).toHaveBeenCalled();
    expect(stubDataClient.search).not.toHaveBeenCalled();

    jest.resetAllMocks();
    stubDataClient.findAllTrainingResults.mockResolvedValue(allTrainings);

    searchResults = await searchTrainings(undefined);
    expect(searchResults).toEqual(expect.arrayContaining(allTrainings));

    expect(stubDataClient.findAllTrainingResults).toHaveBeenCalled();
    expect(stubDataClient.search).not.toHaveBeenCalled();
  });

  it("filters out results when training is suspended or pending", async () => {
    stubDataClient.search.mockResolvedValue([]);
    stubDataClient.findTrainingResultsByIds.mockResolvedValue([
      buildTrainingResult({ id: "1", status: Status.APPROVED }),
      buildTrainingResult({ id: "2", status: Status.PENDING }),
      buildTrainingResult({ id: "3", status: Status.UNKNOWN }),
      buildTrainingResult({ id: "4", status: Status.SUSPENDED }),
    ]);

    const searchResults = await searchTrainings("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "3"]);
  });

  it("filters out results when provider is suspended or pending", async () => {
    stubDataClient.search.mockResolvedValue([]);
    stubDataClient.findTrainingResultsByIds.mockResolvedValue([
      buildTrainingResult({ id: "1", provider: buildProviderResult({ status: Status.APPROVED }) }),
      buildTrainingResult({ id: "2", provider: buildProviderResult({ status: Status.PENDING }) }),
      buildTrainingResult({ id: "3", provider: buildProviderResult({ status: Status.UNKNOWN }) }),
      buildTrainingResult({ id: "4", provider: buildProviderResult({ status: Status.SUSPENDED }) }),
    ]);

    const searchResults = await searchTrainings("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "3"]);
  });

  it("filters out results when training is suspended or pending and search is empty", async () => {
    stubDataClient.findAllTrainingResults.mockResolvedValue([
      buildTrainingResult({ id: "1", status: Status.APPROVED }),
      buildTrainingResult({ id: "2", status: Status.PENDING }),
      buildTrainingResult({ id: "3", status: Status.UNKNOWN }),
      buildTrainingResult({ id: "4", status: Status.SUSPENDED }),
    ]);

    const searchResults = await searchTrainings("");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "3"]);
  });

  it("filters out results when provider is suspended or pending and search is empty", async () => {
    stubDataClient.findAllTrainingResults.mockResolvedValue([
      buildTrainingResult({ id: "1", provider: buildProviderResult({ status: Status.APPROVED }) }),
      buildTrainingResult({ id: "2", provider: buildProviderResult({ status: Status.PENDING }) }),
      buildTrainingResult({ id: "3", provider: buildProviderResult({ status: Status.UNKNOWN }) }),
      buildTrainingResult({ id: "4", provider: buildProviderResult({ status: Status.SUSPENDED }) }),
    ]);

    const searchResults = await searchTrainings("");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "3"]);
  });

  it("strips surrounding quotation marks from name / provider name of training result", async () => {
    stubDataClient.findAllTrainingResults.mockResolvedValue([
      buildTrainingResult({
        name: '"Some Name with Quotes"',
        provider: buildProviderResult({ name: '"Some Name with Quotes"' }),
      }),
      buildTrainingResult({
        name: "Some Name without Quotes",
        provider: buildProviderResult({ name: "Some Name without Quotes" }),
      }),
      buildTrainingResult({
        name: '"Quotes "in the" middle too"',
        provider: buildProviderResult({ name: '"Quotes "in the" middle too"' }),
      }),
    ]);

    const searchResults = await searchTrainings("");

    expect(searchResults.map((it) => it.name)).toEqual([
      "Some Name with Quotes",
      "Some Name without Quotes",
      'Quotes "in the" middle too',
    ]);

    expect(searchResults.map((it) => it.provider.name)).toEqual([
      "Some Name with Quotes",
      "Some Name without Quotes",
      'Quotes "in the" middle too',
    ]);
  });
});
