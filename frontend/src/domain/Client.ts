import { Training, TrainingResult } from "./Training";
import { Error } from "./Error";

export interface Client {
  getTrainingsByQuery: (query: string, observer: Observer<TrainingResult[]>) => void;
  getTrainingById: (id: string, observer: Observer<Training>) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: (error: Error) => void;
}
