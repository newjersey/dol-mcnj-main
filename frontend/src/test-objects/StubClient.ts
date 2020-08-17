/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client, Observer } from "../domain/Client";
import { Training, TrainingResult } from "../domain/Training";
import { Occupation } from "../domain/Occupation";

export class StubClient implements Client {
  capturedObserver: Observer<any> = {
    onError: () => {},
    onSuccess: () => {},
  };

  capturedQuery: string | undefined = undefined;
  capturedId: string | undefined = undefined;
  getOccupationsWasCalled = false;

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
}
