import axios, { AxiosResponse } from "axios";
import { GetZipCodesInRadius } from "../domain/types";
import { Error } from "../domain/Error";

interface ZipcodeResponse {
  zip_codes: string[];
}

export const ZipcodeClient = (baseUrl: string, apiKey: string): GetZipCodesInRadius => {
  return async (zipCode: string, distance: string): Promise<string[]> => {
    return axios
      .get(`${baseUrl}/rest/${apiKey}/radius.json/${zipCode}/${distance}/miles?minimal`)
      .then((response: AxiosResponse<ZipcodeResponse>) => {
        return response.data.zip_codes;
      })
      .catch(() => {
        return Promise.reject(Error.SYSTEM_ERROR);
      });
  };
};
