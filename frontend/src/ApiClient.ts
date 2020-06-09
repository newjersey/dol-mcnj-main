import { Observer, Client } from "./Client";
import axios, { AxiosResponse } from "axios";

export class ApiClient implements Client {
  getPrograms(observer: Observer<string[]>): void {
    axios
      .get("/api/programs")
      .then((response: AxiosResponse<string[]>) => {
        observer.onSuccess(response.data);
      })
      .catch(() => observer.onError());
  }
}
