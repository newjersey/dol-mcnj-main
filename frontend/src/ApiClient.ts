import { Client, Observer } from "./domain/Client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Training, TrainingResult } from "./domain/Training";
import { Error } from "./domain/Error";
import { InDemandOccupation, OccupationDetail } from "./domain/Occupation";
import {
  FaqPageProps,
  FinancialResourcePageProps,
  TrainingProviderPageProps,
  NavMenuProps,
  CareerPathwaysPageProps,
} from "./types/contentful";

export class ApiClient implements Client {
  getTrainingsByQuery(query: string, observer: Observer<TrainingResult[]>): void {
    this.get(`/api/trainings/search?query=${query}`, observer);
  }

  getTrainingById(id: string, observer: Observer<Training>): void {
    this.get(`/api/trainings/${id}`, observer);
  }

  getInDemandOccupations(observer: Observer<InDemandOccupation[]>): void {
    this.get("/api/occupations", observer);
  }

  getOccupationDetailBySoc(soc: string, observer: Observer<OccupationDetail>): void {
    this.get(`/api/occupations/${soc}`, observer);
  }

  getContentfulCPW(query: string, observer: Observer<CareerPathwaysPageProps>): void {
    this.get(`/api/contentful/${query}`, observer);
  }

  getContentfulFAQ(query: string, observer: Observer<FaqPageProps>): void {
    this.get(`/api/contentful/${query}`, observer);
  }

  getContentfulTPR(query: string, observer: Observer<TrainingProviderPageProps>): void {
    this.get(`/api/contentful/${query}`, observer);
  }

  getContentfulFRP(query: string, observer: Observer<FinancialResourcePageProps>): void {
    this.get(`/api/contentful/${query}`, observer);
  }

  getContentfulGNav(query: string, observer: Observer<NavMenuProps>): void {
    this.get(`/api/contentful/${query}`, observer);
  }

  getContentfulMNav(query: string, observer: Observer<NavMenuProps>): void {
    this.get(`/api/contentful/${query}`, observer);
  }

  getContentfulFootNav1(query: string, observer: Observer<NavMenuProps>): void {
    this.get(`/api/contentful/${query}`, observer);
  }

  getContentfulFootNav2(query: string, observer: Observer<NavMenuProps>): void {
    this.get(`/api/contentful/${query}`, observer);
  }

  private get<T>(endpoint: string, observer: Observer<T>): void {
    axios
      .get(endpoint)
      .then((response: AxiosResponse<T>) => {
        observer.onSuccess(response.data);
      })
      .catch((errorResponse: AxiosError<T>) => {
        if (errorResponse.response?.status === 404) {
          return observer.onError(Error.NOT_FOUND);
        }

        return observer.onError(Error.SYSTEM_ERROR);
      });
  }
}
