import NodeCache = require("node-cache");
import * as Sentry from "@sentry/node";
import { SearchTrainings,  } from "../types";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import { DataClient } from "../DataClient";
import {TrainingData, TrainingResult} from "../training/TrainingResult";

import { buildQuery } from "./buildQuery";
import { transformCertificateToTraining } from "./transformCertificateToTraining";

// Ensure TrainingData is exported in ../types
// types.ts:
// export interface TrainingData { ... }

// Initializing a simple in-memory cache
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

const paginateCerts = (certs: TrainingResult[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return certs.slice(start, end);
};

const hasAllCerts = (certNum: number, totalResults: number) => certNum === totalResults;

const fetchAllCerts = async (query: object, sort: string) => {
  console.log("FETCHING CERTS")
  const firstBatch = await credentialEngineAPI.getResults(query, 0, 100, sort);
  const totalResults = firstBatch.data.extra.TotalResults;

  let allCerts;
  if (hasAllCerts(firstBatch.data.data.length, totalResults)) {
    allCerts = firstBatch.data.data;
  } else {
    // How many fetches need to be made
    const remainingCerts = totalResults - 100;
    const numOfFetches = parseInt(Math.ceil(remainingCerts / 100).toString().split(".")[0], 10);

    allCerts = firstBatch.data.data;

    for (let i = 1; i <= numOfFetches; i++) {
      const nextBatch = await credentialEngineAPI.getResults(query, i * 100, 100, sort);
      allCerts = allCerts.concat(nextBatch.data.data);
    }
  }

  return { allCerts, totalResults };
}

const filterResults = async (
  results: TrainingResult[],
  maxCost?: number,
  inDemand?: boolean,
  completeIn?: number[],
  languages?: string[]
) => {
  console.log("FILTERING RESULTS")
  let filteredResults = results;

  // Filter by maxCost
  if (maxCost && maxCost > 0) {
    console.log("FILTER BY MAX COST")
    filteredResults = filteredResults.filter(result => {
      return result.totalCost !== null && result.totalCost !== undefined && result.totalCost <= maxCost;
    });
  }

  if (inDemand) {
    console.log("FILTER BY IN DEMAND")
    filteredResults = filteredResults.filter(result => !!result.inDemand);
  }

  if (completeIn && completeIn.length > 0) {
    console.log("FILTER BY CALENDAR LENGTH")
    filteredResults = filteredResults.filter(result => !!completeIn.includes(result.calendarLength as number));
  }

  if (languages && languages.length > 0) {
    console.log("FILTER BY LANGUAGES")
    filteredResults = filteredResults.filter(result => languages.some(lang => result.languages?.includes(lang)));
  }

  return filteredResults;
};

export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (params: {
    searchQuery: string,
    page?: number,
    limit?: number,
    sort?: string,
    completeIn?: number[],
    county?: string,
    inDemand?: boolean,
    languages?: string[],
    maxCost?: number
  }): Promise<TrainingData> => {
    console.log(params)
    const { page, limit, sort, cacheKey } = prepareSearchParameters(params);

    const cachedResults = cache.get<TrainingData>(cacheKey);
    if (cachedResults) {
      console.log("Returning cached results for key:", cacheKey);
      return cachedResults;
    }

    const query = buildQuery(params);
    console.log("Executing search with query:", JSON.stringify(query));

    let ceRecordsResponse;
    try {
      ceRecordsResponse = await fetchAllCerts(query, sort);
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error fetching results from Credential Engine API:", error);
      throw new Error("Failed to fetch results from Credential Engine API.");
    }

    const certificates = ceRecordsResponse.allCerts as CTDLResource[];

    // Added null check
    const results = await Promise.all(certificates.map(certificate => transformCertificateToTraining(dataClient, certificate, params.searchQuery)));

    const filteredResults = await filterResults(results,
                                                params.maxCost,
                                                params.inDemand,
                                                params.completeIn,
                                                params.languages)

    const paginatedResults = paginateCerts(filteredResults, page, limit);

    console.log(paginatedResults)

    const totalResults = filteredResults.length;

    const data = packageResults(page, limit, paginatedResults, totalResults);

    cache.set(cacheKey, data);
    return data;
  };
};

function prepareSearchParameters(params: {
  searchQuery: string,
  page?: number,
  limit?: number,
  sort?: string,
  completeIn?: number[],
  county?: string,
  inDemand?: boolean,
  maxCost?: number,
  miles?: number,
  zipcode?: string
}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const hasCompleteIn = params.completeIn && params.completeIn.length > 0;
  const completeInValue = hasCompleteIn ? params.completeIn?.join(",") : "";

  const sort = determineSortOption(params.sort);
  const cacheKey = `searchQuery-${params.searchQuery}-${page}-${limit}-${sort}-${params.county}-${params.maxCost}-${params.miles}-${params.zipcode}${params.inDemand ? "-inDemand" : ""}${hasCompleteIn ? `-${completeInValue}` : ""}`;

  return { page, limit, sort, cacheKey };
}

function determineSortOption(sortOption?: string) {
  switch (sortOption) {
    case "asc": return "ceterms:name";
    case "desc": return "^ceterms:name";
    case "price_asc":
    case "price_desc":
    case "EMPLOYMENT_RATE": return sortOption;
    case "best_match":
    default: return "^search:relevance";
  }
}

function packageResults(page: number, limit: number, results: TrainingResult[], totalResults: number): TrainingData {
  const totalPages = Math.ceil(totalResults / limit);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: results,
    meta: {
      currentPage: page,
      totalPages,
      totalItems: totalResults,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage,
      nextPage: hasNextPage ? page + 1 : null,
      previousPage: hasPreviousPage ? page - 1 : null,
    },
  };
}
