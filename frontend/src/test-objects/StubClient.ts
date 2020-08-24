/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client, Observer } from "../domain/Client";
import { Training, TrainingResult } from "../domain/Training";
import { Occupation } from "../domain/Occupation";
import { SearchArea } from "../filtering/LocationFilter";

export class StubClient implements Client {
  capturedObserver: Observer<any> = {
    onError: () => {},
    onSuccess: () => {},
  };

  capturedQuery: string | undefined = undefined;
  capturedId: string | undefined = undefined;
  capturedSearchArea: SearchArea | undefined = undefined;
  getOccupationsWasCalled = false;
  getZipcodesInRadiusWasCalled = false;

  getTrainingsByQuery(query: string, observer: Observer<TrainingResult[]>): void {
    this.capturedObserver = observer;
    this.capturedQuery = query;
  }

  getTrainingById(id: string, observer: Observer<Training>): void {
    this.capturedObserver = observer;
    this.capturedId = id;
  }

  getOccupations(observer: Observer<Occupation[]>): void {
    this.capturedObserver = observer;
    this.getOccupationsWasCalled = true;
  }

  getZipcodesInRadius(searchArea: SearchArea, observer: Observer<string[]>): void {
    this.capturedObserver = observer;
    this.capturedSearchArea = searchArea;
    this.getZipcodesInRadiusWasCalled = true;
  }
}
