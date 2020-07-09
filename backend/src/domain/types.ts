import { TrainingResult } from "./Training";

export type SearchTrainings = (searchQuery?: string) => Promise<TrainingResult[]>;
