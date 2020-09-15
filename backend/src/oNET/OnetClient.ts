import axios, { AxiosResponse } from "axios";
import { GetOccupationDetailPartial } from "../domain/types";
import { OccupationDetailPartial } from "../domain/occupations/Occupation";
import { Error } from "../domain/Error";

interface OnetResponse {
  code: string;
  title: string;
  description: string;
}

interface OnetTaskResponse {
  task: OnetTask[];
}

interface OnetTask {
  name: string;
}

interface OnetAuth {
  username: string;
  password: string;
}

export const OnetClient = (baseUrl: string, auth: OnetAuth): GetOccupationDetailPartial => {
  const onetConfig = {
    auth: auth,
    headers: {
      "User-Agent": "nodejs-OnetWebService/1.00 (bot)",
      Accept: "application/json",
    },
    timeout: 10000,
    maxRedirects: 0,
  };

  const getTasks = (soc: string): Promise<string[]> => {
    return axios
      .get(`${baseUrl}/ws/online/occupations/${soc}.00/summary/tasks?display=long`, onetConfig)
      .then((response: AxiosResponse<OnetTaskResponse>): string[] => {
        return response.data.task.map((task: OnetTask): string => task.name);
      })
      .catch(() => {
        return Promise.resolve([]);
      });
  };

  return async (soc: string): Promise<OccupationDetailPartial> => {
    return axios
      .get(`${baseUrl}/ws/online/occupations/${soc}.00`, onetConfig)
      .then(async (response: AxiosResponse<OnetResponse>) => {
        const formattedCode = response.data.code.split(".")[0];

        return {
          soc: formattedCode,
          title: response.data.title,
          description: response.data.description,
          tasks: await getTasks(soc),
        };
      })
      .catch(() => {
        return Promise.reject(Error.SYSTEM_ERROR);
      });
  };
};
