import { Client, Observer } from "./domain/Client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Training, TrainingData } from "./domain/Training";
import { Error } from "./domain/Error";
import { InDemandOccupation, OccupationDetail } from "./domain/Occupation";
import { Certificates } from "./domain/CredentialEngine";
import {
  FaqPageProps,
  FinancialResourcePageProps,
  TrainingProviderPageProps,
  NavMenuProps,
  CareerPathwaysPageProps,
  JobCountProps,
} from "./types/contentful";
import {
  ClassFormatProps,
  CompleteInProps,
  LanguageProps,
  ServiceProps
} from "./filtering/filterLists";
import { CountyProps } from "./filtering/newJerseyCounties";

export class ApiClient implements Client {
  getTrainingsByQuery(
    query: string,
    observer: Observer<TrainingData>,
    page?: number,
    limit?: number | undefined,
    sort?: "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match",
    classFormat?: ClassFormatProps[],
    completeIn?: CompleteInProps[],
    county?: CountyProps,
    inDemand?: boolean,
    languages?: LanguageProps[],
    maxCost?: string,
    miles?: string,
    services?: ServiceProps[],
    zip?: string,
    cipCode?: string,
    socCode?: string,
  ): void {
    const queryString = `query=${query}&page=${page}&limit=${limit}&sort=${sort}`;
    const classFormatString = classFormat?.length === 1 ? `&classFormat=${classFormat[0]}` : "";
    const completeInString = (completeIn?.length ?? 0) > 0 ? completeIn?.map((ci) => `&completeIn=${ci}`).join("") : "";
    const countyString = county ? `&county=${county}` : "";
    const inDemandString = inDemand ? `&inDemand=${inDemand}` : "";
    const languagesString = (languages?.length ?? 0) > 0 ? languages?.map((lang) => `&languages=${lang}`).join("") : "";
    const maxCostString = maxCost ? `&maxCost=${maxCost}` : "";
    const servicesString = (services?.length ?? 0) > 0 ? services?.map((service) => `&services=${service}`).join("") : "";
    const milesString = miles ? `&miles=${miles}` : "";
    const zipString = zip ? `&zip=${zip}` : "";
    const cipCodeString = cipCode ? `&cipCode=${cipCode}` : "";
    const socCodeString = socCode ? `&socCode=${socCode}` : "";

    const finalString = `/api/trainings/search?${queryString}${classFormatString}${completeInString}${countyString}${inDemandString}${languagesString}${maxCostString}${servicesString}${milesString}${zipString}${cipCodeString}${socCodeString}`;

    console.log({ finalString })

    this.get(
      finalString,
      observer,
    );
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

  getAllCertificates(
    skip: number,
    take: number,
    sort: string,
    cancel: boolean,
    observer: Observer<Certificates>,
  ): void {
    this.get(`/api/ce/getallcredentials/${skip}/${take}/${sort}/${cancel}`, observer);
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
