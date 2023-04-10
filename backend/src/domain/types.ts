import { Certificates } from "./credentialengine/CredentialEngineInterface";
import { TrainingResult } from "./training/TrainingResult";
import { Training } from "./training/Training";
import { Selector } from "./training/Selector";
import {
  InDemandOccupation,
  OccupationDetail,
  OccupationDetailPartial,
  Occupation,
} from "./occupations/Occupation";
import { FaqPageProps, TrainingProviderPageProps } from "./contentful/types";

export type SearchTrainings = (searchQuery: string) => Promise<TrainingResult[]>;
export type FindTrainingsBy = (selector: Selector, values: string[]) => Promise<Training[]>;
export type GetInDemandOccupations = () => Promise<InDemandOccupation[]>;
export type GetOccupationDetail = (soc: string) => Promise<OccupationDetail>;
export type GetOccupationDetailPartial = (soc: string) => Promise<OccupationDetailPartial>;
export type GetEducationText = (soc: string) => Promise<string>;
export type GetSalaryEstimate = (soc: string) => Promise<number | null>;
export type GetOpenJobsCount = (soc: string) => Promise<number | null>;
export type Convert2010SocTo2018Occupations = (soc2010: string) => Promise<Occupation[]>;
export type GetContentfulFAQ = (query: string) => Promise<FaqPageProps>;
export type GetContentfulTPR = (query: string) => Promise<TrainingProviderPageProps>;

export type GetAllCertificates = (
  skip: number,
  take: number,
  sort: string,
  cancel: boolean
) => Promise<Certificates>;
