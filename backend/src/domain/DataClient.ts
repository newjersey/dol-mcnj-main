import { Training } from "./Training";

export type TrainingId = string;

export interface DataClient {
  findAllTrainings: () => Promise<Training[]>;
  findTrainingsByIds: (ids: string[]) => Promise<Training[]>;
  search: (searchQuery: string) => Promise<TrainingId[]>;
}
