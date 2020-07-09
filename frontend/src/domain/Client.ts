import { Training } from "./Training";

export interface Client {
  getTrainingsByQuery: (query: string, observer: Observer<Training[]>) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: () => void;
}
