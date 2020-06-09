import { Observer, Client } from "./domain/Client";
import axios, { AxiosResponse } from "axios";
import {Program} from "./domain/Program";

export class ApiClient implements Client {
  getPrograms(observer: Observer<Program[]>): void {
    axios
      .get("/api/programs")
      .then((response: AxiosResponse<Program[]>) => {
        observer.onSuccess(response.data);
      })
      .catch(() => observer.onError());
  }
}
