import { Training, TrainingResult } from "./Training";
import { Error } from "./Error";
import { InDemandOccupation, OccupationDetail } from "./Occupation";
import { Certificates } from "./CredentialEngine";
import {
  FaqPageProps,
  FinancialResourcePageProps,
  TrainingProviderPageProps,
  NavMenuProps,
  CareerPathwaysPageProps,
} from "../types/contentful";

export interface Client {
  getTrainingsByQuery: (query: string, observer: Observer<TrainingResult[]>) => void;
  getTrainingById: (id: string, observer: Observer<Training>) => void;
  getInDemandOccupations: (observer: Observer<InDemandOccupation[]>) => void;
  getOccupationDetailBySoc: (soc: string, observer: Observer<OccupationDetail>) => void;
  getAllCertificates: (
    skip: number,
    take: number,
    sort: string,
    cancel: boolean,
    observer: Observer<Certificates>
  ) => void;  
  getContentfulCPW: (query: string, observer: Observer<CareerPathwaysPageProps>) => void;
  getContentfulFAQ: (query: string, observer: Observer<FaqPageProps>) => void;
  getContentfulTPR: (query: string, observer: Observer<TrainingProviderPageProps>) => void;
  getContentfulFRP: (query: string, observer: Observer<FinancialResourcePageProps>) => void;
  getContentfulGNav: (query: string, observer: Observer<NavMenuProps>) => void;
  getContentfulMNav: (query: string, observer: Observer<NavMenuProps>) => void;
  getContentfulFootNav1: (query: string, observer: Observer<NavMenuProps>) => void;
  getContentfulFootNav2: (query: string, observer: Observer<NavMenuProps>) => void;
}

export interface Observer<T> {
  onSuccess: (result: T) => void;
  onError: (error: Error) => void;
}
