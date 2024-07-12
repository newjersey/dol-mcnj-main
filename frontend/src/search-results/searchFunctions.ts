import { Dispatch, SetStateAction } from "react";

import { Client } from "../domain/Client";
import { TrainingData, TrainingResult } from "../domain/Training";

export const getPageTitle = (
  setPageTitle: Dispatch<SetStateAction<string>>,
  searchQuery?: string | null,
): void => {
  if (!searchQuery || searchQuery === "null") {
    setPageTitle(`Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`);
  } else {
    const query = decodeURIComponent(searchQuery.replace(/\+/g, " ")).toLocaleLowerCase();
    setPageTitle(
      `${query} | Advanced Search | Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
    );
  }
};

export const getTrainingData = (
  client: Client,
  queryToSearch: string,
  setIsError: Dispatch<SetStateAction<boolean>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setMetaData: Dispatch<SetStateAction<TrainingData["meta"] | undefined>>,
  setTrainings: Dispatch<SetStateAction<TrainingResult[]>>,
  cipCode?: string,
  classFormat?: string[],
  completeIn?: number[],
  county?: string,
  inDemand?: boolean,
  itemsPerPage?: number,
  languages?: string[],
  maxCost?: number,
  miles?: number,
  pageNum?: number,
  services?: string[],
  socCode?: string,
  sortBy?: "asc" | "desc" | "price_asc" | "price_desc" | "EMPLOYMENT_RATE" | "best_match",
  zipCode?: string
): void => {
  if (queryToSearch && queryToSearch !== "" && queryToSearch !== "null") {
    client.getTrainingsByQuery(queryToSearch, {
      onSuccess: (data: TrainingData) => {
        setMetaData(data.meta);
        setTrainings(data.data);
        setLoading(false);
      },
      onError: () => {
        setIsError(true);
        setLoading(false);
      },
    },
      cipCode,
      classFormat,
      completeIn,
      county,
      inDemand,
      itemsPerPage,
      languages,
      maxCost,
      miles,
      pageNum,
      services,
      socCode,
      sortBy,
      zipCode);
  } else {
    setLoading(false);
  }
}

export const getSearchQuery = (searchString: string | undefined): string | undefined => {
  const regex = /\?q=([^&]*)/;
  const matches = searchString?.match(regex);
  return matches ? decodeURIComponent(matches[1]) : undefined;
};