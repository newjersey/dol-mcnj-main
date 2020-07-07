import { Program } from "./Program";

export type ProgramId = string;

export interface DataClient {
  findAllPrograms: () => Promise<Program[]>;
  findProgramsByIds: (ids: string[]) => Promise<Program[]>;
  search: (searchQuery: string) => Promise<ProgramId[]>;
}
