import { Certificates } from "./credentialengine/CredentialEngineInterface";
import { TrainingData } from "./training/TrainingResult";
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
  county?: string,
  maxCost?: number,
  miles?: number,
  zipcode?: string
}) => Promise<TrainingData>;
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
