import { TrainingResult } from "./Training";

export type TrainingId = string;

export interface DataClient {
  findAllTrainings: () => Promise<TrainingResult[]>;
  findTrainingsByIds: (ids: string[]) => Promise<TrainingResult[]>;
  search: (searchQuery: string) => Promise<TrainingId[]>;
}
