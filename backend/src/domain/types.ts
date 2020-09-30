import { TrainingResult } from "./search/TrainingResult";
import { Training } from "./training/Training";
import {
  InDemandOccupation,
  OccupationDetail,
  OccupationDetailPartial,
} from "./occupations/Occupation";

export type SearchTrainings = (searchQuery: string) => Promise<TrainingResult[]>;
export type FindTrainingsByIds = (ids: string[]) => Promise<Training[]>;
export type GetInDemandOccupations = () => Promise<InDemandOccupation[]>;
export type GetZipCodesInRadius = (zipCode: string, distance: string) => Promise<string[]>;
export type GetOccupationDetail = (soc: string) => Promise<OccupationDetail>;
export type GetOccupationDetailPartial = (soc: string) => Promise<OccupationDetailPartial>;
export type GetEducationText = (soc: string) => Promise<string>;
export type GetSalaryEstimate = (soc: string) => Promise<number | null>;
export type GetOpenJobsCount = (soc: string) => Promise<number | null>;
