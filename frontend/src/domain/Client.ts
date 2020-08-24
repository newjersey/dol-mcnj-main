import { Training, TrainingResult } from "./Training";
import { Error } from "./Error";
import { Occupation } from "./Occupation";
import { SearchArea } from "../filtering/LocationFilter";

export interface Client {
  getTrainingsByQuery: (query: string, observer: Observer<TrainingResult[]>) => void;
  getTrainingById: (id: string, observer: Observer<Training>) => void;
  getOccupations: (observer: Observer<Occupation[]>) => void;
  getZipcodesInRadius: (searchArea: SearchArea, observer: Observer<string[]>) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: (error: Error) => void;
}
