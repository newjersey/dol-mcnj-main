import { GetOpenJobsCount } from "../domain/types";
import axios, { AxiosResponse } from "axios";

interface CareerOneStopJobsResponse {
  Jobcount: string;
}

/**
 * CareerOneStop API Client for fetching job counts
 *
 * IMPORTANT NOTE ON API VS WEBSITE DISCREPANCIES:
 * ================================================
 * The job count returned by the CareerOneStop API may differ slightly from
 * the count shown on their public website (careeronestop.org) for the same
 * SOC code and search parameters. This is a known behavior of CareerOneStop's
 * infrastructure and is NOT a bug in our code.
 *
 * Possible reasons for discrepancies:
 * - Real-time job postings/removals between API call and website page load
 * - Different caching strategies between API and website
 * - Website UI may apply additional client-side filters
 * - API and website may pull from slightly different data sources/indexes
 *
 * We use `source=NLX` (uppercase) to match the website's public job search
 * as closely as possible. Minor differences (typically <3%) are expected and
 * acceptable.
 *
 * @see https://www.careeronestop.org/Developers/WebAPI/web-api.aspx
 */
export const CareerOneStopClient = (
  baseUrl: string,
  userId: string,
  authToken: string,
): GetOpenJobsCount => {
  return async (soc: string): Promise<number | null> => {
    return axios
      .get(
        `${baseUrl}/v1/jobsearch/${userId}/${soc}/NJ/1000/0/0/0/10/0?source=NLX`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      .then((response: AxiosResponse<CareerOneStopJobsResponse>) => {
        return parseInt(response.data.Jobcount);
      })
      .catch(() => {
        return null;
      });
  };
};
