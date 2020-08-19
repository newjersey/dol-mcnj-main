import {LocalException, OccupationTitle, Program} from "./Program";

export interface DataClient {
  findProgramsByIds: (ids: string[]) => Promise<Program[]>;
  findOccupationTitlesByCip: (cip: string) => Promise<OccupationTitle[]>;
  findOccupationTitleBySoc: (soc: string) => Promise<OccupationTitle>;
  getLocalExceptions: () => Promise<LocalException[]>;
  getInDemandOccupationTitles: () => Promise<OccupationTitle[]>;
}
