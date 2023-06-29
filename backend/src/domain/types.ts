import { TrainingResult } from "./training/TrainingResult";
import { Training } from "./training/Training";
import { Selector } from "./training/Selector";
import {
  InDemandOccupation,
  OccupationDetail,
  OccupationDetailPartial,
  Occupation,
} from "./occupations/Occupation";
import {
  FaqPageProps,
  FinancialResourcePageProps,
  TrainingProviderPageProps,
  NavMenuProps,
  CareerPathwaysPageProps,
} from "./contentful/types";

export type SearchTrainings = (searchQuery: string) => Promise<TrainingResult[]>;
export type FindTrainingsBy = (selector: Selector, values: string[]) => Promise<Training[]>;
export type GetInDemandOccupations = () => Promise<InDemandOccupation[]>;
export type GetOccupationDetail = (soc: string) => Promise<OccupationDetail>;
export type GetOccupationDetailPartial = (soc: string) => Promise<OccupationDetailPartial>;
export type GetEducationText = (soc: string) => Promise<string>;
export type GetSalaryEstimate = (soc: string) => Promise<number | null>;
export type GetOpenJobsCount = (soc: string) => Promise<number | null>;
export type Convert2010SocTo2018Occupations = (soc2010: string) => Promise<Occupation[]>;
export type GetContentfulCPW = (query: string) => Promise<CareerPathwaysPageProps>;
export type GetContentfulFAQ = (query: string) => Promise<FaqPageProps>;
export type GetContentfulTPR = (query: string) => Promise<TrainingProviderPageProps>;
export type GetContentfulFRP = (query: string) => Promise<FinancialResourcePageProps>;
export type GetContentfulGNav = (query: string) => Promise<NavMenuProps>;
export type GetContentfulMNav = (query: string) => Promise<NavMenuProps>;
export type GetContentfulFootNav = (query: string) => Promise<NavMenuProps>;
export type GetContentfulFootNav2 = (query: string) => Promise<NavMenuProps>;
