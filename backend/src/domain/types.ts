import { Training, TrainingResult } from "./Training";

export type SearchTrainings = (searchQuery?: string) => Promise<TrainingResult[]>;
export type FindTrainingById = (id?: string) => Promise<Training>;
