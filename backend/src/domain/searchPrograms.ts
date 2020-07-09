import { Program, Status } from "./Program";
import { DataClient } from "./DataClient";
import { SearchPrograms } from "./types";

export const searchProgramsFactory = (dataClient: DataClient): SearchPrograms => {
  return async (searchQuery: string): Promise<Program[]> => {
    const matchingIds = await dataClient.search(searchQuery);
    return dataClient.findProgramsByIds(matchingIds).then((programs: Program[]): Program[] => {
      return programs.filter(
        (program) =>
          program.status !== Status.SUSPENDED && program.provider.status !== Status.SUSPENDED
      );
    });
  };
};
