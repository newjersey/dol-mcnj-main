import { TrainingResult } from "./search/TrainingResult";
import { Training } from "./training/Training";
import { Occupation } from "./occupations/Occupation";

export type SearchTrainings = (searchQuery: string) => Promise<TrainingResult[]>;
export type FindTrainingsByIds = (ids: string[]) => Promise<Training[]>;
export type GetInDemandOccupations = () => Promise<Occupation[]>;
export type GetZipCodesInRadius = (zipCode: string, distance: string) => Promise<string[]>;
