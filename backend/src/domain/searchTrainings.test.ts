import { searchTrainingsFactory } from "./searchTrainings";
import { buildTrainingResult, buildProviderResult } from "../test-helpers/factories";
import { Status } from "./Training";
import { SearchTrainings } from "./types";

describe("searchTrainings", () => {
  let stubFindTrainingsByIds: jest.Mock;
  let stubSearch: jest.Mock;
  let stubFindAllTrainings: jest.Mock;
  let searchTrainings: SearchTrainings;

  beforeEach(() => {
    stubFindTrainingsByIds = jest.fn();
    stubSearch = jest.fn();
    stubFindAllTrainings = jest.fn();

    searchTrainings = searchTrainingsFactory({
      findAllTrainings: stubFindAllTrainings,
      search: stubSearch,
      findTrainingsByIds: stubFindTrainingsByIds,
    });
  });

  it("gets matching trainings via keyword search and id lookup", async () => {
    const training1 = buildTrainingResult({ name: "training 1", id: "1" });
    const training2 = buildTrainingResult({ name: "training 2", id: "2" });

    stubSearch.mockImplementationOnce(() => Promise.resolve(["1", "2"]));
    stubFindTrainingsByIds.mockImplementationOnce(() => Promise.resolve([training1, training2]));

    const searchResults = await searchTrainings("keyword");
    expect(searchResults).toEqual(expect.arrayContaining([training1, training2]));

    expect(stubSearch).toHaveBeenCalledWith("keyword");
    expect(stubFindTrainingsByIds).toHaveBeenCalledWith(["1", "2"]);
  });

  it("gets all trainings when search query is empty/undefined", async () => {
    const allTrainings = [buildTrainingResult({}), buildTrainingResult({})];
    stubFindAllTrainings.mockImplementationOnce(() => Promise.resolve(allTrainings));

    let searchResults = await searchTrainings("");
    expect(searchResults).toEqual(expect.arrayContaining(allTrainings));

    expect(stubFindAllTrainings).toHaveBeenCalled();
    expect(stubSearch).not.toHaveBeenCalled();

    jest.resetAllMocks();
    stubFindAllTrainings.mockImplementationOnce(() => Promise.resolve(allTrainings));

    searchResults = await searchTrainings(undefined);
    expect(searchResults).toEqual(expect.arrayContaining(allTrainings));

    expect(stubFindAllTrainings).toHaveBeenCalled();
    expect(stubSearch).not.toHaveBeenCalled();
  });

  it("filters out results when training is suspended", async () => {
    stubFindTrainingsByIds.mockImplementationOnce(() =>
      Promise.resolve([
        buildTrainingResult({ id: "1", status: Status.APPROVED }),
        buildTrainingResult({ id: "2", status: Status.PENDING }),
        buildTrainingResult({ id: "3", status: Status.UNKNOWN }),
        buildTrainingResult({ id: "4", status: Status.SUSPENDED }),
      ])
    );

    const searchResults = await searchTrainings("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "2", "3"]);
  });

  it("filters out results when provider is suspended", async () => {
    stubFindTrainingsByIds.mockImplementationOnce(() =>
      Promise.resolve([
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
      ])
    );

    const searchResults = await searchTrainings("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "2", "3"]);
  });
});
