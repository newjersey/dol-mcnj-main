import { Client, Observer } from "./domain/Client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Training, TrainingResult } from "./domain/Training";
import { Error } from "./domain/Error";

export class ApiClient implements Client {
  getTrainingsByQuery(query: string, observer: Observer<TrainingResult[]>): void {
    this.get(`/api/trainings/search?query=${query}`, observer);
  }

  getTrainingById(id: string, observer: Observer<Training>): void {
    this.get(`/api/trainings/${id}`, observer);
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
