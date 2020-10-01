import axios, { AxiosResponse } from "axios";
import { Convert2010SocTo2018Occupations, GetOccupationDetailPartial } from "../domain/types";
import { Occupation, OccupationDetailPartial } from "../domain/occupations/Occupation";
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

interface OnetRelatedOccupationsResponse {
  occupation: OnetOccupation[];
}

interface OnetOccupation {
  code: string;
}

interface OnetAuth {
  username: string;
  password: string;
}

export const OnetClient = (
  baseUrl: string,
  auth: OnetAuth,
  convert2010SocTo2018Occupations: Convert2010SocTo2018Occupations
): GetOccupationDetailPartial => {
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

  const getRelatedOccupations = (soc: string): Promise<Occupation[]> => {
    return axios
      .get(
        `${baseUrl}/ws/online/occupations/${soc}.00/details/related_occupations?display=long`,
        onetConfig
      )
      .then(
        async (response: AxiosResponse<OnetRelatedOccupationsResponse>): Promise<Occupation[]> => {
          const socs2010: string[] = response.data.occupation
            .filter((occupation: OnetOccupation): boolean => occupation.code.split(".")[1] === "00")
            .map((occupation: OnetOccupation): string => occupation.code.split(".")[0]);

          const occupations2018Promises: Promise<Occupation[]>[] = socs2010.map((soc2010) =>
            convert2010SocTo2018Occupations(soc2010)
          );
          const occupations2018Arrays: Occupation[][] = await Promise.all(occupations2018Promises);
          return occupations2018Arrays.reduce(
            (prev: Occupation[], cur: Occupation[]) => prev.concat(cur),
            []
          );
        }
      )
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
          relatedOccupations: await getRelatedOccupations(soc),
        };
      })
      .catch(() => {
        return Promise.reject(Error.SYSTEM_ERROR);
      });
  };
};
