import { searchTrainingsFactory } from "./searchTrainings";
import { buildTraining, buildProvider } from "../test-helpers/factories";
import { Status } from "./Training";
import { SearchTrainings } from "./types";

describe("searchTrainings", () => {
  let stubFindTrainingsByIds: jest.Mock;
  let stubSearch: jest.Mock;
  let searchTrainings: SearchTrainings;

  beforeEach(() => {
    stubFindTrainingsByIds = jest.fn();
    stubSearch = jest.fn();

    searchTrainings = searchTrainingsFactory({
      findAllTrainings: jest.fn(),
      search: stubSearch,
      findTrainingsByIds: stubFindTrainingsByIds,
    });
  });

  it("gets matching trainings via keyword search and id lookup", async () => {
    const training1 = buildTraining({ name: "training 1", id: "1" });
    const training2 = buildTraining({ name: "training 2", id: "2" });

    stubSearch.mockImplementationOnce(() => Promise.resolve(["1", "2"]));
    stubFindTrainingsByIds.mockImplementationOnce(() => Promise.resolve([training1, training2]));

    const searchResults = await searchTrainings("keyword");
    expect(searchResults).toEqual(expect.arrayContaining([training1, training2]));

    expect(stubSearch).toHaveBeenCalledWith("keyword");
    expect(stubFindTrainingsByIds).toHaveBeenCalledWith(["1", "2"]);
  });

  it("filters out results when training is suspended", async () => {
    stubFindTrainingsByIds.mockImplementationOnce(() =>
      Promise.resolve([
        buildTraining({ id: "1", status: Status.APPROVED }),
        buildTraining({ id: "2", status: Status.PENDING }),
        buildTraining({ id: "3", status: Status.UNKNOWN }),
        buildTraining({ id: "4", status: Status.SUSPENDED }),
      ])
    );

    const searchResults = await searchTrainings("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "2", "3"]);
  });

  it("filters out results when provider is suspended", async () => {
    stubFindTrainingsByIds.mockImplementationOnce(() =>
      Promise.resolve([
        buildTraining({ id: "1", provider: buildProvider({ status: Status.APPROVED }) }),
        buildTraining({ id: "2", provider: buildProvider({ status: Status.PENDING }) }),
        buildTraining({ id: "3", provider: buildProvider({ status: Status.UNKNOWN }) }),
        buildTraining({ id: "4", provider: buildProvider({ status: Status.SUSPENDED }) }),
      ])
    );

    const searchResults = await searchTrainings("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "2", "3"]);
  });
});
