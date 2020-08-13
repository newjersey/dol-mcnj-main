import { searchTrainingsFactory } from "./searchTrainings";
import { buildProviderResult, buildTrainingResult } from "../test-objects/factories";
import { Status } from "./Training";
import { SearchTrainings } from "./types";
import { StubDataClient, StubSearchClient } from "../test-objects/StubDataClient";

describe("searchTrainings", () => {
  let searchTrainings: SearchTrainings;
  let stubDataClient: StubDataClient;
  let stubSearchClient: StubSearchClient;

  beforeEach(() => {
    jest.resetAllMocks();
    stubDataClient = StubDataClient();
    stubSearchClient = StubSearchClient();

    searchTrainings = searchTrainingsFactory(stubDataClient, stubSearchClient);
  });

  it("returns matching trainings with highlights and ranks", async () => {
    const training1 = buildTrainingResult({ id: "1", highlight: "", rank: undefined });
    const training2 = buildTrainingResult({ id: "2", highlight: "", rank: undefined });
    stubSearchClient.search.mockResolvedValue([
      { id: training1.id, rank: 1 },
      { id: training2.id, rank: 2 },
    ]);
    stubSearchClient.getHighlight.mockResolvedValue("some highlight");
    stubDataClient.findTrainingResultsByIds.mockResolvedValue([training1, training2]);

    expect(await searchTrainings("some query")).toEqual([
      {
        ...training1,
        rank: 1,
        highlight: "some highlight",
      },
      {
        ...training2,
        rank: 2,
        highlight: "some highlight",
      },
    ]);

    expect(stubSearchClient.search).toHaveBeenCalledWith("some query");
    expect(stubDataClient.findTrainingResultsByIds).toHaveBeenCalledWith(["1", "2"]);
  });

  it("gets all trainings when search query is empty/undefined", async () => {
    const result1 = buildTrainingResult({});
    const result2 = buildTrainingResult({});
    const allTrainings = [result1, result2];
    const expectedResults = [
      {
        ...result1,
        highlight: "",
        rank: 0,
      },
      {
        ...result2,
        highlight: "",
        rank: 0,
      },
    ];

    stubDataClient.findAllTrainingResults.mockResolvedValue(allTrainings);

    let searchResults = await searchTrainings("");
    expect(searchResults).toEqual(expect.arrayContaining(expectedResults));

    expect(stubDataClient.findAllTrainingResults).toHaveBeenCalled();
    expect(stubSearchClient.search).not.toHaveBeenCalled();

    jest.resetAllMocks();
    stubDataClient.findAllTrainingResults.mockResolvedValue(allTrainings);

    searchResults = await searchTrainings(undefined);
    expect(searchResults).toEqual(expect.arrayContaining(expectedResults));

    expect(stubDataClient.findAllTrainingResults).toHaveBeenCalled();
    expect(stubSearchClient.search).not.toHaveBeenCalled();
  });

  it("filters out results when training is suspended or pending", async () => {
    stubSearchClient.search.mockResolvedValue([]);
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
    stubSearchClient.search.mockResolvedValue([]);
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
        name: '"Quote at beginning',
        provider: buildProviderResult({ name: 'Quote at end"' }),
      }),
      buildTrainingResult({
        name: "Some Name without Quotes",
        provider: buildProviderResult({ name: "Some Name without Quotes" }),
      }),
      buildTrainingResult({
        name: '"Quotes "in the" middle too"',
        provider: buildProviderResult({ name: '"Quotes "in the" middle too"' }),
      }),
      buildTrainingResult({
        name: '"""Lots of Quotes"""',
        provider: buildProviderResult({ name: '"""Lots of Quotes"""' }),
      }),
    ]);

    const searchResults = await searchTrainings("");

    expect(searchResults.map((it) => it.name)).toEqual([
      "Some Name with Quotes",
      "Quote at beginning",
      "Some Name without Quotes",
      'Quotes "in the" middle too',
      "Lots of Quotes",
    ]);

    expect(searchResults.map((it) => it.provider.name)).toEqual([
      "Some Name with Quotes",
      "Quote at end",
      "Some Name without Quotes",
      'Quotes "in the" middle too',
      "Lots of Quotes",
    ]);
  });

  it("title cases the local exception county", async () => {
    stubDataClient.findAllTrainingResults.mockResolvedValue([
      buildTrainingResult({
        localExceptionCounty: ["ATLANTIC"],
      }),
      buildTrainingResult({
        localExceptionCounty: ["ATLANTIC COUNTY"],
      }),

      buildTrainingResult({
        localExceptionCounty: ["ATLANTIC", "MIDDLESEX"],
      }),
      buildTrainingResult({
        localExceptionCounty: [],
      }),
    ]);

    const searchResults = await searchTrainings("");

    expect(searchResults.map((it) => it.localExceptionCounty)).toEqual([
      ["Atlantic"],
      ["Atlantic County"],
      ["Atlantic", "Middlesex"],
      [],
    ]);
  });

  it("strips unicode inverted question marks from highlights", async () => {
    stubSearchClient.search.mockResolvedValue(["id"]);
    stubDataClient.findTrainingResultsByIds.mockResolvedValue([buildTrainingResult({})]);
    stubSearchClient.getHighlight.mockResolvedValue("some ¿weird¿ character");

    const searchResults = await searchTrainings("query");

    expect(searchResults.map((it) => it.highlight)).toEqual(["some weird character"]);
  });

  describe("error handling", () => {
    it("rejects when search is broken", (done) => {
      stubSearchClient.search.mockRejectedValue({});

      searchTrainings("query").catch(() => done());
    });

    it("rejects when find by ids is broken", (done) => {
      stubSearchClient.search.mockResolvedValue(["id"]);
      stubDataClient.findTrainingResultsByIds.mockRejectedValue({});

      searchTrainings("query").catch(() => done());
    });

    it("rejects when get highlights is broken", (done) => {
      stubSearchClient.search.mockResolvedValue(["id"]);
      stubDataClient.findTrainingResultsByIds.mockResolvedValue([buildTrainingResult({})]);
      stubSearchClient.getHighlight.mockRejectedValue({});

      searchTrainings("query").catch(() => done());
    });

    it("rejects when find all is broken", (done) => {
      stubDataClient.findAllTrainingResults.mockRejectedValue({});
      searchTrainings("").catch(() => done());
    });
  });
});
