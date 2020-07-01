import { Observer, Client } from "./domain/Client";
import axios, { AxiosResponse } from "axios";
import {Program} from "./domain/Program";

export class ApiClient implements Client {

  getProgramsByQuery(query: string, observer: Observer<Program[]>): void {
    this.get(`/api/programs/search?query=${query}`, observer);
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
