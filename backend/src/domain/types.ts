import { Certificates } from "./credentialengine/CredentialEngineInterface";
import { AllTrainingsResult, TrainingData } from "./training/TrainingResult";
import { Training } from "./training/Training";
import { Selector } from "./training/Selector";
import {
  InDemandOccupation,
  OccupationDetail,
  OccupationDetailPartial,
  Occupation,
} from "./occupations/Occupation";

export type SearchTrainings = (params: {
  searchQuery: string,
  page?: number,
  limit?: number,
  sort?: string,
  cip_code?: string,
  class_format?: string[],
  complete_in?: number[],
  county?: string,
  in_demand?: boolean,
  languages?: string[],
  max_cost?: number,
  services?: string[],
  soc_code?: string,
  miles?: number,
  zip_code?: string
}) => Promise<TrainingData>;
export type AllTrainings = () => Promise<AllTrainingsResult[]>
export type FindTrainingsBy = (selector: Selector, values: string[]) => Promise<Training[]>;
export type GetInDemandOccupations = () => Promise<InDemandOccupation[]>;
export type GetOccupationDetail = (soc: string) => Promise<OccupationDetail>;
export type GetOccupationDetailByCIP = (cip: string) => Promise<OccupationDetail[]>;
export type GetOccupationDetailPartial = (soc: string) => Promise<OccupationDetailPartial>;
export type GetEducationText = (soc: string) => Promise<string>;
export type GetSalaryEstimate = (soc: string) => Promise<number | null>;
export type GetOpenJobsCount = (soc: string) => Promise<number | null>;
export type Convert2010SocTo2018Occupations = (soc2010: string) => Promise<Occupation[]>;

export type GetAllCertificates = (
  skip: number,
  take: number,
  sort: string,
  cancel: boolean
) => Promise<Certificates>;
