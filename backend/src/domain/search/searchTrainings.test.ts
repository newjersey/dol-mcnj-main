import { SearchTrainings } from "../types";
import { searchTrainingsFactory } from "./searchTrainings";
import { buildTraining } from "../test-objects/factories";
import { StubSearchClient } from "../test-objects/StubDataClient";
import { Selector } from "../training/Selector";

describe("searchTrainings", () => {
  let searchTrainings: SearchTrainings;
  let stubFindTrainingsBy: jest.Mock;
  let stubSearchClient: StubSearchClient;

  beforeEach(() => {
    jest.resetAllMocks();
    stubFindTrainingsBy = jest.fn();
    stubSearchClient = StubSearchClient();

    searchTrainings = searchTrainingsFactory(stubFindTrainingsBy, stubSearchClient);
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
    stubFindTrainingsBy.mockResolvedValue([training1, training2]);

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
        county: training1.provider.county,
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
        providerId: training2.provider.id,
        providerName: training2.provider.name,
        city: training2.provider.address.city,
        zipCode: training2.provider.address.zipCode,
        county: training2.provider.county,
        rank: 2,
        highlight: "some highlight 2",
      },
    ]);

    expect(stubSearchClient.search).toHaveBeenCalledWith("some query");
    expect(stubFindTrainingsBy).toHaveBeenCalledWith(Selector.ID, ["1", "2"]);
  });

  it("returns empty when search query is empty", async () => {
    stubFindTrainingsBy.mockResolvedValue([]);
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
      stubFindTrainingsBy.mockRejectedValue({});

      searchTrainings("query").catch(() => done());
    });

    it("rejects when get highlights is broken", (done) => {
      stubSearchClient.search.mockResolvedValue(["id"]);
      stubFindTrainingsBy.mockResolvedValue([buildTraining({})]);
      stubSearchClient.getHighlight.mockRejectedValue({});

      searchTrainings("query").catch(() => done());
    });
  });
});
