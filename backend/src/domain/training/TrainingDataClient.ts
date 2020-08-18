import {Occupation} from "../occupations/Occupation";
import {LocalException, OccupationTitle, Program} from "./Program";

export interface TrainingDataClient {
  findProgramsByIds: (ids: string[]) => Promise<Program[]>;
  findOccupationTitlesByCip: (cip: string) => Promise<OccupationTitle[]>;
  getLocalExceptions: () => Promise<LocalException[]>;
  getInDemandOccupations: () => Promise<Occupation[]>;
}
