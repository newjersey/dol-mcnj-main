import { Training, TrainingResult } from "./Training";

export interface DataClient {
  findAllTrainingResults: () => Promise<TrainingResult[]>;
  findTrainingResultsByIds: (ids: string[]) => Promise<TrainingResult[]>;
  findTrainingById: (id: string) => Promise<Training>;
}
