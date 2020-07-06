import { Program } from "./Program";

export interface DataClient {
  findAllPrograms: () => Promise<Program[]>;
  searchPrograms: (searchQuery: string) => Promise<Program[]>;
  searchCipsBySocKeyword: (searchQuery: string) => Promise<string[]>;
  findProgramsByCips: (cips: string[]) => Promise<Program[]>;
}
