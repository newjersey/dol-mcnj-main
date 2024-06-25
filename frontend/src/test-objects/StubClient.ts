/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client, Observer } from "../domain/Client";
import { Training, TrainingData } from "../domain/Training";
import { InDemandOccupation, OccupationDetail } from "../domain/Occupation";
import { Certificates } from "../domain/CredentialEngine";
import {
  FaqPageProps,
  FinancialResourcePageProps,
  TrainingProviderPageProps,
  NavMenuProps,
  CareerPathwaysPageProps,
  JobCountProps,
} from "../types/contentful";

export class StubClient implements Client {
  capturedObserver: Observer<any> = {
    onError: () => {},
    onSuccess: () => {},
  };

  capturedQuery: string | undefined = undefined;
  capturedId: string | undefined = undefined;
  getOccupationsWasCalled = false;

  getTrainingsByQuery(query: string, observer: Observer<TrainingData>): void {
    this.capturedObserver = observer;
    this.capturedQuery = query;
  }

  getTrainingById(id: string, observer: Observer<Training>): void {
    this.capturedObserver = observer;
    this.capturedId = id;
  }

  getInDemandOccupations(observer: Observer<InDemandOccupation[]>): void {
    this.capturedObserver = observer;
    this.getOccupationsWasCalled = true;
  }

  getOccupationDetailBySoc(soc: string, observer: Observer<OccupationDetail>): void {
    this.capturedObserver = observer;
  }

  getAllCertificates(
    skip: number,
    take: number,
    sort: string,
    cancel: boolean,
    observer: Observer<Certificates>,
  ): void {
    this.capturedObserver = observer;
  }

  getContentfulCPW(query: string, observer: Observer<CareerPathwaysPageProps>): void {
    this.capturedObserver = observer;
  }

  getContentfulFAQ(query: string, observer: Observer<FaqPageProps>): void {
    this.capturedObserver = observer;
  }

  getContentfulTPR(query: string, observer: Observer<TrainingProviderPageProps>): void {
    this.capturedObserver = observer;
  }

  getContentfulFRP(query: string, observer: Observer<FinancialResourcePageProps>): void {
    this.capturedObserver = observer;
  }

  getContentfulGNav(query: string, observer: Observer<NavMenuProps>): void {
    this.capturedObserver = observer;
  }

  getContentfulMNav(query: string, observer: Observer<NavMenuProps>): void {
    this.capturedObserver = observer;
  }

  getContentfulFootNav1(query: string, observer: Observer<NavMenuProps>): void {
    this.capturedObserver = observer;
  }

  getContentfulFootNav2(query: string, observer: Observer<NavMenuProps>): void {
    this.capturedObserver = observer;
  }

  getJobCount(term: string, observer: Observer<JobCountProps>): void {
    this.capturedObserver = observer;
  }
}
