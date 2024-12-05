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

export class ApiClient implements Client {
  getTrainingsByQuery(
    query: string,
    observer: Observer<TrainingData>,
    cipCode?: string,
    classFormat?: string[],
    completeIn?: number[],
    county?: string,
    inDemand?: boolean,
    limit?: number,
    languages?: string[],
    maxCost?: number,
    miles?: number,
    page?: number,
    services?: string[],
    socCode?: string,
    sort?: "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match",
    zipCode?: string
  ): void {
    const cipCodeQuery = cipCode ? `&cip_code=${cipCode}` : "";
    const classFormatQuery = classFormat && classFormat.length > 0 ? `&format=${classFormat.join(",")}` : "";
    const completeInQuery = completeIn && completeIn.length > 0 ? `&complete_in=${completeIn.join(",")}` : "";
    const countyQuery = county ? `&county=${county}` : "";
    const inDemandQuery = inDemand ? `&in_demand=${inDemand}` : "";
    const limitQuery = `&limit=${limit || 10}`;
    const languagesQuery = languages && languages.length > 0 ? `&languages=${languages.join(",")}` : "";
    const maxCostQuery = maxCost ? `&max_cost=${maxCost}` : "";
    const pageQuery = `&page=${page || 1}`;
    const servicesQuery = services && services.length > 0 ? `&services=${services.join(",")}` : "";
    const socCodeQuery = socCode ? `&soc_code=${socCode}` : "";
    const sortQuery = `&sort=${sort || 'best_match'}`;
    const milesZipCodeQuery = miles && zipCode ? `&miles=${miles}&zip_code=${zipCode}` : "";

    const encodedQuery = encodeURIComponent(query);
    const url = `/api/trainings/search?query=${encodedQuery}${pageQuery}${limitQuery}${sortQuery}${cipCodeQuery}${classFormatQuery}${completeInQuery}${countyQuery}${inDemandQuery}${languagesQuery}${maxCostQuery}${servicesQuery}${socCodeQuery}${milesZipCodeQuery}`;

    this.get(
      url,
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
