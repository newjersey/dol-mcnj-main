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
    page?: number,
    limit?: number | undefined,
    sort?: "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match",
    completeIn?: number[] | undefined,
    county?: string | undefined,
    inDemand?: string | undefined,
    languages?: string[] | undefined,
    maxCost?: number | undefined,
    miles?: number | undefined,
    zipcode?: string | undefined,
  ): void {
    const completeInValue = completeIn && completeIn.length > 0 ? `&completeIn=${completeIn.join(",")}` : '';
    const countyValue = county ? `&county=${county}` : '';
    const inDemanValue = inDemand && inDemand === "true" ? "&inDemand=true" : "";
    const languagesValue = languages && languages.length > 0 ? `&languages=${languages.join(",")}` : '';
    const maxCostValue = maxCost && maxCost > 0 ? `&maxCost=${maxCost}` : '';
    const zipcodeAndMiles = miles && miles > 0 && zipcode ? `&miles=${miles}&zipcode=${zipcode}` : '';

    const url = `/api/trainings/search?query=${query}&page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}${zipcodeAndMiles}${maxCostValue}${countyValue}${inDemanValue}${completeInValue}${languagesValue}`;

    console.log(url)

    this.get(url, observer);
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
