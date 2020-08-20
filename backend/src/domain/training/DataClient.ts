import {LocalException, NullableOccupationTitle, OccupationTitle, Program} from "./Program";

export interface DataClient {
  findProgramsByIds: (ids: string[]) => Promise<Program[]>;
  findOccupationTitlesByCip: (cip: string) => Promise<OccupationTitle[]>;
  findOccupationTitleBySoc: (soc: string) => Promise<OccupationTitle>;
  find2018OccupationTitlesBySoc2010: (soc2010: string) => Promise<OccupationTitle[]>
  getLocalExceptions: () => Promise<LocalException[]>;
  getInDemandOccupationTitles: () => Promise<NullableOccupationTitle[]>;
}
