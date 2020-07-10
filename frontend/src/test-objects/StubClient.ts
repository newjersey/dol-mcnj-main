/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client, Observer } from "../domain/Client";
import { Training, TrainingResult } from "../domain/Training";

export class StubClient implements Client {
  capturedObserver: Observer<any> = {
    onError: () => {},
    onSuccess: () => {},
  };

  capturedQuery: string | undefined = undefined;
  capturedId: string | undefined = undefined;

  getTrainingsByQuery(query: string, observer: Observer<TrainingResult[]>): void {
    this.capturedObserver = observer;
    this.capturedQuery = query;
  }

  getTrainingById(id: string, observer: Observer<Training>): void {
    this.capturedObserver = observer;
    this.capturedId = id;
  }
}
