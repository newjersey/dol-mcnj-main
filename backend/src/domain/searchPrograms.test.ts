import { searchProgramsFactory } from "./searchPrograms";
import { buildProgram, buildProvider } from "../test-helpers/factories";
import { Status } from "./Program";
import { SearchPrograms } from "./types";

describe("searchPrograms", () => {
  let stubFindProgramsByIds: jest.Mock;
  let stubSearch: jest.Mock;
  let searchPrograms: SearchPrograms;

  beforeEach(() => {
    stubFindProgramsByIds = jest.fn();
    stubSearch = jest.fn();

    searchPrograms = searchProgramsFactory({
      findAllPrograms: jest.fn(),
      search: stubSearch,
      findProgramsByIds: stubFindProgramsByIds,
    });
  });

  it("gets matching programs via keyword search and id lookup", async () => {
    const program1 = buildProgram({ name: "program 1", id: "1" });
    const program2 = buildProgram({ name: "program 2", id: "2" });

    stubSearch.mockImplementationOnce(() => Promise.resolve(["1", "2"]));
    stubFindProgramsByIds.mockImplementationOnce(() => Promise.resolve([program1, program2]));

    const searchResults = await searchPrograms("keyword");
    expect(searchResults).toEqual(expect.arrayContaining([program1, program2]));

    expect(stubSearch).toHaveBeenCalledWith("keyword");
    expect(stubFindProgramsByIds).toHaveBeenCalledWith(["1", "2"]);
  });

  it("filters out results when program is suspended", async () => {
    stubFindProgramsByIds.mockImplementationOnce(() =>
      Promise.resolve([
        buildProgram({ id: "1", status: Status.APPROVED }),
        buildProgram({ id: "2", status: Status.PENDING }),
        buildProgram({ id: "3", status: Status.UNKNOWN }),
        buildProgram({ id: "4", status: Status.SUSPENDED }),
      ])
    );

    const searchResults = await searchPrograms("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "2", "3"]);
  });

  it("filters out results when provider is suspended", async () => {
    stubFindProgramsByIds.mockImplementationOnce(() =>
      Promise.resolve([
        buildProgram({ id: "1", provider: buildProvider({ status: Status.APPROVED }) }),
        buildProgram({ id: "2", provider: buildProvider({ status: Status.PENDING }) }),
        buildProgram({ id: "3", provider: buildProvider({ status: Status.UNKNOWN }) }),
        buildProgram({ id: "4", provider: buildProvider({ status: Status.SUSPENDED }) }),
      ])
    );

    const searchResults = await searchPrograms("keyword");

    expect(searchResults.map((it) => it.id)).toEqual(["1", "2", "3"]);
  });
});
