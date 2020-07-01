import { Program } from "./Program";

export interface Client {
  getProgramsByQuery: (query: string, observer: Observer<Program[]>) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: () => void;
}
