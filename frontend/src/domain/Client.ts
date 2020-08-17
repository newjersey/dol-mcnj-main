import { Training, TrainingResult } from "./Training";
import { Error } from "./Error";
import { Occupation } from "./Occupation";

export interface Client {
  getTrainingsByQuery: (query: string, observer: Observer<TrainingResult[]>) => void;
  getTrainingById: (id: string, observer: Observer<Training>) => void;
  getOccupations: (observer: Observer<Occupation[]>) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: (error: Error) => void;
}
