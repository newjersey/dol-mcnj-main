import { TrainingResult } from "./search/TrainingResult";
import { Training } from "./training/Training";
import { Occupation } from "./occupations/Occupation";

export type SearchTrainings = (searchQuery?: string) => Promise<TrainingResult[]>;
export type FindTrainingById = (id?: string) => Promise<Training>;
export type GetInDemandOccupations = () => Promise<Occupation[]>;
