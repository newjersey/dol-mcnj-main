import { Training, TrainingResult } from "./Training";

export interface Client {
  getTrainingsByQuery: (query: string, observer: Observer<TrainingResult[]>) => void;
  getTrainingById: (id: string, observer: Observer<Training>) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: () => void;
}
