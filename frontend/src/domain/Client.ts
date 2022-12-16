import { Training, TrainingResult } from "./Training";
import { Error } from "./Error";
import { InDemandOccupation, OccupationDetail } from "./Occupation";
import { AxiosResponse } from "axios";

export interface Client {
  getTrainingsByQuery: (query: string, observer: Observer<TrainingResult[]>) => void;
  getTrainingById: (id: string, observer: Observer<Training>) => void;
  getInDemandOccupations: (observer: Observer<InDemandOccupation[]>) => void;
  getOccupationDetailBySoc: (soc: string, observer: Observer<OccupationDetail>) => void;
  getAllCertificates: (query: object, skip: number, take: number, sort: string, cancel: boolean, observer: Observer<AxiosResponse>) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: (error: Error) => void;
}
