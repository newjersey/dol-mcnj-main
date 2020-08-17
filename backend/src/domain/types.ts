import { Training, TrainingResult } from "./Training";
import { Occupation } from "./Occupation";

export type SearchTrainings = (searchQuery?: string) => Promise<TrainingResult[]>;
export type FindTrainingById = (id?: string) => Promise<Training>;
export type GetInDemandOccupations = () => Promise<Occupation[]>;
