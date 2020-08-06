import { Training, TrainingResult } from "./Training";

export type TrainingId = string;

export interface DataClient {
  findAllTrainingResults: () => Promise<TrainingResult[]>;
  findTrainingResultsByIds: (ids: string[]) => Promise<TrainingResult[]>;
  search: (searchQuery: string) => Promise<TrainingId[]>;
  findTrainingById: (id: string) => Promise<Training>;
  getHighlight: (id: string, searchQuery: string) => Promise<string>;
}
