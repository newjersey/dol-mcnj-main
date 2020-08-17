import { Training, TrainingResult } from "./Training";
import { Occupation } from "./Occupation";

export interface DataClient {
  findAllTrainingResults: () => Promise<TrainingResult[]>;
  findTrainingResultsByIds: (ids: string[]) => Promise<TrainingResult[]>;
  findTrainingById: (id: string) => Promise<Training>;
  getInDemandOccupations: () => Promise<Occupation[]>;
}
