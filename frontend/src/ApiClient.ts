import { Observer, Client } from "./domain/Client";
import axios, { AxiosResponse } from "axios";
import {TrainingResult} from "./domain/Training";

export class ApiClient implements Client {

  getTrainingsByQuery(query: string, observer: Observer<TrainingResult[]>): void {
    this.get(`/api/trainings/search?query=${query}`, observer);
  };

  private get<T>(endpoint: string, observer: Observer<T>): void {
    axios
      .get(endpoint)
      .then((response: AxiosResponse<T>) => {
        observer.onSuccess(response.data);
      })
      .catch(() => observer.onError());
  }
}
