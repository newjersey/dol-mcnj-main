import {
  LocalException,
  Program,
  SocDefinition,
  EducationText,
  SalaryEstimate,
  NullableOccupation,
} from "./training/Program";
import { Occupation } from "./occupations/Occupation";

export interface DataClient {
  findProgramsByIds: (ids: string[]) => Promise<Program[]>;
  findOccupationsByCip: (cip: string) => Promise<Occupation[]>;
  findSocDefinitionBySoc: (soc: string) => Promise<SocDefinition>;
  find2018OccupationsBySoc2010: (soc2010: string) => Promise<Occupation[]>;
  find2010OccupationsBySoc2018: (soc2018: string) => Promise<Occupation[]>;
  getLocalExceptions: () => Promise<LocalException[]>;
  getOccupationsInDemand: () => Promise<NullableOccupation[]>;
  getEducationTextBySoc: (soc: string) => Promise<EducationText>;
  getSalaryEstimateBySoc: (soc: string) => Promise<SalaryEstimate>;
  getOESOccupationBySoc: (soc: string) => Promise<Occupation>;
  getNeighboringOccupations: (soc: string) => Promise<Occupation[]>;
}
