import { searchProgramsFactory } from "./searchPrograms";
import { buildProgram } from "../test-helpers/factories";

describe("searchPrograms", () => {
  it("gets matching programs via program and via soc keywords", async () => {
    const stubFindProgramsByCips = jest.fn();
    const stubSearchPrograms = jest.fn();
    const stubSearchCipsBySocKeyword = jest.fn();

    const searchPrograms = searchProgramsFactory({
      findAllPrograms: jest.fn(),
      searchPrograms: stubSearchPrograms,
      findProgramsByCips: stubFindProgramsByCips,
      searchCipsBySocKeyword: stubSearchCipsBySocKeyword,
    });

    const program1 = buildProgram({ name: "program 1" });
    const program2 = buildProgram({ name: "program 2" });

    stubSearchPrograms.mockImplementationOnce(() => Promise.resolve([program1]));
    stubSearchCipsBySocKeyword.mockImplementationOnce(() => Promise.resolve(["cip1"]));
    stubFindProgramsByCips.mockImplementationOnce(() => Promise.resolve([program1, program2]));

    const searchResults = await searchPrograms("keyword");
    expect(searchResults).toEqual(expect.arrayContaining([program1, program2]));
    expect(stubSearchPrograms).toHaveBeenCalledWith("keyword");
    expect(stubSearchCipsBySocKeyword).toHaveBeenCalledWith("keyword");
    expect(stubFindProgramsByCips).toHaveBeenCalledWith(["cip1"]);
  });
});
