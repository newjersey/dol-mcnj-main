import { Training, TrainingResult } from "./Training";
import { Error } from "./Error";
import { InDemandOccupation, OccupationDetail } from "./Occupation";
import { FaqPageProps, TrainingProviderPageProps } from "../types/contentful";
import { Certificates } from "./CredentialEngine";

export interface Client {
  getTrainingsByQuery: (query: string, observer: Observer<TrainingResult[]>) => void;
  getTrainingById: (id: string, observer: Observer<Training>) => void;
  getInDemandOccupations: (observer: Observer<InDemandOccupation[]>) => void;
  getOccupationDetailBySoc: (soc: string, observer: Observer<OccupationDetail>) => void;
  getContentfulFAQ: (query: string, observer: Observer<FaqPageProps>) => void;
  getContentfulTPR: (query: string, observer: Observer<TrainingProviderPageProps>) => void;
  getAllCertificates: (
    skip: number,
    take: number,
    sort: string,
    cancel: boolean,
    observer: Observer<Certificates>
  ) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: (error: Error) => void;
}
