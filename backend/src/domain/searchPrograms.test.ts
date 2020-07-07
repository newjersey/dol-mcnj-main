import { searchProgramsFactory } from "./searchPrograms";
import { buildProgram } from "../test-helpers/factories";

describe("searchPrograms", () => {
  it("gets matching programs via keyword search and id lookup", async () => {
    const stubFindProgramsByIds = jest.fn();
    const stubSearch = jest.fn();

    const searchPrograms = searchProgramsFactory({
      findAllPrograms: jest.fn(),
      search: stubSearch,
      findProgramsByIds: stubFindProgramsByIds,
    });

    const program1 = buildProgram({ name: "program 1", id: "1" });
    const program2 = buildProgram({ name: "program 2", id: "2" });

    stubSearch.mockImplementationOnce(() => Promise.resolve(["1", "2"]));
    stubFindProgramsByIds.mockImplementationOnce(() => Promise.resolve([program1, program2]));

    const searchResults = await searchPrograms("keyword");
    expect(searchResults).toEqual(expect.arrayContaining([program1, program2]));

    expect(stubSearch).toHaveBeenCalledWith("keyword");
    expect(stubFindProgramsByIds).toHaveBeenCalledWith(["1", "2"]);
  });
});
