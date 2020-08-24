import { SearchTrainings } from "../types";
import { searchTrainingsFactory } from "./searchTrainings";
import { buildTraining } from "../test-objects/factories";
import { StubSearchClient } from "../test-objects/StubDataClient";

describe("searchTrainings", () => {
  let searchTrainings: SearchTrainings;
  let stubFindTrainingsByIds: jest.Mock;
  let stubSearchClient: StubSearchClient;

  beforeEach(() => {
    jest.resetAllMocks();
    stubFindTrainingsByIds = jest.fn();
    stubSearchClient = StubSearchClient();

    searchTrainings = searchTrainingsFactory(stubFindTrainingsByIds, stubSearchClient);
  });

  it("returns matching trainings with highlights and ranks", async () => {
    const training1 = buildTraining({ id: "1" });
    const training2 = buildTraining({ id: "2" });
    stubSearchClient.search.mockResolvedValue([
      { id: "1", rank: 1 },
      { id: "2", rank: 2 },
    ]);
    stubSearchClient.getHighlight
      .mockResolvedValueOnce("some highlight 1")
      .mockResolvedValueOnce("some highlight 2");
    stubFindTrainingsByIds.mockResolvedValue([training1, training2]);

    expect(await searchTrainings("some query")).toEqual([
      {
        id: training1.id,
        name: training1.name,
        totalCost: training1.totalCost,
        percentEmployed: training1.percentEmployed,
        calendarLength: training1.calendarLength,
        inDemand: training1.inDemand,
        localExceptionCounty: training1.localExceptionCounty,
        online: training1.online,
        providerId: training1.provider.id,
        providerName: training1.provider.name,
        city: training1.provider.address.city,
        zipCode: training1.provider.address.zipCode,
        rank: 1,
        highlight: "some highlight 1",
      },
      {
        id: training2.id,
        name: training2.name,
        totalCost: training2.totalCost,
        percentEmployed: training2.percentEmployed,
        calendarLength: training2.calendarLength,
        inDemand: training2.inDemand,
        localExceptionCounty: training2.localExceptionCounty,
        online: training2.online,
        city: training2.provider.address.city,
        zipCode: training2.provider.address.zipCode,
        providerId: training2.provider.id,
        providerName: training2.provider.name,
        rank: 2,
        highlight: "some highlight 2",
      },
    ]);

    expect(stubSearchClient.search).toHaveBeenCalledWith("some query");
    expect(stubFindTrainingsByIds).toHaveBeenCalledWith(["1", "2"]);
  });

  it("returns empty when search query is empty", async () => {
    stubFindTrainingsByIds.mockResolvedValue([]);
    stubSearchClient.search.mockResolvedValue([]);
    const searchResults = await searchTrainings("");
    expect(searchResults).toEqual([]);
  });

  describe("error handling", () => {
    it("rejects when search is broken", (done) => {
      stubSearchClient.search.mockRejectedValue({});
      searchTrainings("query").catch(() => done());
    });

    it("rejects when find by ids is broken", (done) => {
      stubSearchClient.search.mockResolvedValue(["id"]);
      stubFindTrainingsByIds.mockRejectedValue({});

      searchTrainings("query").catch(() => done());
    });

    it("rejects when get highlights is broken", (done) => {
      stubSearchClient.search.mockResolvedValue(["id"]);
      stubFindTrainingsByIds.mockResolvedValue([buildTraining({})]);
      stubSearchClient.getHighlight.mockRejectedValue({});

      searchTrainings("query").catch(() => done());
    });
  });
});
