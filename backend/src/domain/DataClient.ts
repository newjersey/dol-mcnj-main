import {
  LocalException,
  Program,
  SocDefinition,
  CipDefinition,
  EducationText,
  SalaryEstimate,
  NullableOccupation, LocalExceptionCip,
} from "./training/Program";
import { Occupation } from "./occupations/Occupation";
import { Selector } from "./training/Selector";

export interface DataClient {
  findProgramsBy: (selector: Selector, values: string[]) => Promise<Program[]>;
  findOccupationsByCip: (cip: string) => Promise<Occupation[]>;
  findSocDefinitionBySoc: (soc: string) => Promise<SocDefinition>;
  findCipDefinitionBySoc2018: (soc: string) => Promise<CipDefinition[]>;
  find2018OccupationsBySoc2010: (soc2010: string) => Promise<Occupation[]>;
  find2010OccupationsBySoc2018: (soc2018: string) => Promise<Occupation[]>;
  getLocalExceptionsByCip: () => Promise<LocalExceptionCip[]>;
  getLocalExceptionsBySoc: () => Promise<LocalExceptionSoc[]>;
  getOccupationsInDemand: () => Promise<NullableOccupation[]>;
  getEducationTextBySoc: (soc: string) => Promise<EducationText>;
  getSalaryEstimateBySoc: (soc: string) => Promise<SalaryEstimate>;
  getOESOccupationBySoc: (soc: string) => Promise<Occupation>;
  getNeighboringOccupations: (soc: string) => Promise<Occupation[]>;
}
