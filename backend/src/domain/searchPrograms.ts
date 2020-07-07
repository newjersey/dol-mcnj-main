import { Program } from "./Program";
import { DataClient } from "./DataClient";
import { searchPrograms } from "./types";

export const searchProgramsFactory = (dataClient: DataClient): searchPrograms => {
  return async (searchQuery: string): Promise<Program[]> => {
    const matchingIds = await dataClient.search(searchQuery);
    return dataClient.findProgramsByIds(matchingIds);
  };
};
