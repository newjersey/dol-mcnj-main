import { GetOpenJobsCount } from "../domain/types";
import axios, { AxiosResponse } from "axios";

interface CareerOneStopJobsResponse {
  Jobcount: string;
}

export const CareerOneStopClient = (
  baseUrl: string,
  userId: string,
  authToken: string
): GetOpenJobsCount => {
  return async (soc: string): Promise<number | null> => {
    return axios
      .get(
        `${baseUrl}/v1/jobsearch/${userId}/${soc}/NJ/1000/0/0/0/10/0?source=NLx&showFilters=false`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      .then((response: AxiosResponse<CareerOneStopJobsResponse>) => {
        return parseInt(response.data.Jobcount);
      })
      .catch(() => {
        return null;
      });
  };
};
