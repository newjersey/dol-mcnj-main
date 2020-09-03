import axios, { AxiosResponse } from "axios";
import { GetOccupationDetail } from "../domain/types";
import { OccupationDetail } from "../domain/occupations/Occupation";
import { Error } from "../domain/Error";

interface OnetResponse {
  code: string;
  title: string;
  description: string;
}

interface OnetAuth {
  username: string;
  password: string;
}

export const OnetClient = (baseUrl: string, auth: OnetAuth): GetOccupationDetail => {
  return async (soc: string): Promise<OccupationDetail> => {
    return axios
      .get(`${baseUrl}/ws/online/occupations/${soc}.00`, {
        auth: auth,
        headers: {
          "User-Agent": "nodejs-OnetWebService/1.00 (bot)",
          Accept: "application/json",
        },
        timeout: 10000,
        maxRedirects: 0,
      })
      .then((response: AxiosResponse<OnetResponse>) => {
        const formattedCode = response.data.code.split(".")[0];

        return {
          soc: formattedCode,
          title: response.data.title,
          description: response.data.description,
        };
      })
      .catch(() => {
        return Promise.reject(Error.SYSTEM_ERROR);
      });
  };
};
