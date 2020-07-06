import { Program } from "./Program";
import { DataClient } from "./DataClient";
import { searchPrograms } from "./types";

export const searchProgramsFactory = (dataClient: DataClient): searchPrograms => {
  return async (searchQuery: string): Promise<Program[]> => {
    const matchingPrograms = await dataClient.searchPrograms(searchQuery);
    const matchingCips = await dataClient.searchCipsBySocKeyword(searchQuery);
    const programsWithMatchingCips = await dataClient.findProgramsByCips(matchingCips);

    return [...new Set([...matchingPrograms, ...programsWithMatchingCips])];
  };
};
