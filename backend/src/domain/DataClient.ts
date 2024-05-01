import {
  LocalException,
  SocDefinition,
  CipDefinition,
  EducationText,
  SalaryEstimate,
  NullableOccupation,
} from "./training/Program";
import { Occupation } from "./occupations/Occupation";

export interface DataClient {
  findOccupationsByCip: (cip: string) => Promise<Occupation[]>;
  findSocDefinitionBySoc: (soc: string) => Promise<SocDefinition>;
  findCipDefinitionBySoc2018: (soc: string) => Promise<CipDefinition[]>;
  findCipDefinitionByCip: (cip: string) => Promise<CipDefinition[]>;
  find2018OccupationsBySoc2010: (soc2010: string) => Promise<Occupation[]>;
  find2010OccupationsBySoc2018: (soc2018: string) => Promise<Occupation[]>;
  findLocalExceptionsBySoc: (soc: string) => Promise<LocalException[]>;
  getLocalExceptionsByCip: () => Promise<LocalException[]>;
  getLocalExceptionsBySoc: () => Promise<LocalException[]>;
  getOccupationsInDemand: () => Promise<NullableOccupation[]>;
  getCIPsInDemand: () => Promise<CipDefinition[]>;
  getEducationTextBySoc: (soc: string) => Promise<EducationText>;
  getSalaryEstimateBySoc: (soc: string) => Promise<SalaryEstimate>;
  getOESOccupationBySoc: (soc: string) => Promise<Occupation>;
  getNeighboringOccupations: (soc: string) => Promise<Occupation[]>;
}
