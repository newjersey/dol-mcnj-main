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
  JobCountProps,
} from "./types/contentful";

export class ApiClient implements Client {
  getTrainingsByQuery(query: string, observer: Observer<TrainingResult[]>): void {
    const encodedQuery = encodeURIComponent(query);
    this.get(`/api/trainings/search?query=${encodedQuery}`, observer, { treat404AsEmpty: true });
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

  getJobCount(term: string, observer: Observer<JobCountProps>): void {
    this.get(`/api/jobcount/${term}`, observer);
  }

  private get<T>(
      endpoint: string,
      observer: Observer<T>,
      options?: { treat404AsEmpty?: boolean }
  ): void {
    axios
        .get(endpoint)
        .then((response: AxiosResponse<T>) => {
          observer.onSuccess(response.data);
        })
        .catch((errorResponse: AxiosError) => {
          if (errorResponse.response?.status === 404) {
            if (options?.treat404AsEmpty) {
              observer.onSuccess([] as T);  // assume only arrays use treat404AsEmpty
            } else {
              observer.onError(Error.NOT_FOUND);
            }
            return;
          }

          observer.onError(Error.SYSTEM_ERROR);
        });
  }
}
