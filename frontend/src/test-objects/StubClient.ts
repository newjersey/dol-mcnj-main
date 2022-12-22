/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { Client, Observer } from "../domain/Client";
import { Training, TrainingResult } from "../domain/Training";
import { InDemandOccupation, OccupationDetail } from "../domain/Occupation";
import { SearchArea } from "../filtering/LocationFilter";
import { Certificate, Certificates } from "../domain/CredentialEngine";

export class StubClient implements Client {
  capturedObserver: Observer<any> = {
    onError: () => {},
    onSuccess: () => {},
  };

  capturedQuery: string | undefined = undefined;
  capturedId: string | undefined = undefined;
  capturedSearchArea: SearchArea | undefined = undefined;
  getOccupationsWasCalled = false;

  getTrainingsByQuery(query: string, observer: Observer<TrainingResult[]>): void {
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
  
  getAllCertificates(skip: number, take: number, sort: string, cancel: boolean, observer: Observer<Certificates>): void {
    this.capturedObserver = observer;
  }
}
