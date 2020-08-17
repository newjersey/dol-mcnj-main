import {TrainingResult} from "../search/TrainingResult";
import {Training} from "./Training";
import {Occupation} from "../occupations/Occupation";

export interface TrainingDataClient {
  findAllTrainingResults: () => Promise<TrainingResult[]>;
  findTrainingResultsByIds: (ids: string[]) => Promise<TrainingResult[]>;
  findTrainingById: (id: string) => Promise<Training>;
  getInDemandOccupations: () => Promise<Occupation[]>;
}
