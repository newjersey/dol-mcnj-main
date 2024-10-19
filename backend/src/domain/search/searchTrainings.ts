import NodeCache = require("node-cache");
import * as Sentry from "@sentry/node";
import { SearchTrainings } from "../types";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import { getLocalExceptionCounties } from "../utils/getLocalExceptionCounties";
import { DataClient } from "../DataClient";
import { getHighlight } from "../utils/getHighlight";
import { TrainingData, TrainingResult } from "../training/TrainingResult";
import zipcodeJson from "../utils/zip-county.json";
import zipcodes from "zipcodes";

// Initializing a simple in-memory cache
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

/*
const hasAllCerts = (certNum: number, totalResults: number) => certNum === totalResults;
*/

const fetchAllCerts = async (query: object, sort: string, offset = 0, limit = 10) => {
  console.log(`FETCHING CERTS with offset ${offset} and limit ${limit}`);

  // Fetch only the requested page of results based on offset and limit
  const response = await credentialEngineAPI.getResults(query, offset, limit, sort);
  const totalResults = response.data.extra.TotalResults;

  const allCerts = response.data.data;

  return { allCerts, totalResults };
};

const filterCerts = async (
  results: TrainingResult[],
  cip_code?: string,
  complete_in?: number[],
  in_demand?: boolean,
  max_cost?: number,
) => {
  let filteredResults = results;

  if (cip_code) {
    filteredResults = filteredResults.filter(result => result.cipDefinition?.cipcode === cip_code);
  }

  if (in_demand) {
    filteredResults = filteredResults.filter(result => !!result.inDemand);
  }

  if (complete_in && complete_in.length > 0) {
    filteredResults = filteredResults.filter((result) => complete_in.includes(result.calendarLength as number));
  }

  if (max_cost && max_cost > 0) {
    filteredResults = filteredResults.filter((result) => result.totalCost !== null && result.totalCost !== undefined && result.totalCost <= max_cost);
  }

  return filteredResults;
}

const paginateCerts = (certs: TrainingResult[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return certs.slice(start, end);
};

export const sortTrainings = (trainings: TrainingResult[], sort: string): TrainingResult[] => {
  switch (sort) {
    case "asc":
      return trainings.sort((a, b) => (a.name && b.name) ? a.name.localeCompare(b.name) : 0);
    case "desc":
      return trainings.sort((a, b) => (b.name && a.name) ? b.name.localeCompare(a.name) : 0);
    case "price_asc":
      return trainings.sort((a, b) => (a.totalCost || 0) - (b.totalCost || 0));
    case "price_desc":
      return trainings.sort((a, b) => (b.totalCost || 0) - (a.totalCost || 0));
    case "EMPLOYMENT_RATE":
      return trainings.sort((a, b) => (b.percentEmployed || 0) - (a.percentEmployed || 0));
    default:
      return trainings;
  }
};

export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (params: {
    searchQuery: string,
    page?: number,
    limit?: number,
    sort?: string,
    cip_code?: string,
    soc_code?: string,
    class_format?: string[],
    complete_in?: number[],
    county?: string,
    in_demand?: boolean,
    languages?: string[],
    max_cost?: number,
    miles?: number,
    services?: string[],
    zip_code?: string,
  }): Promise<TrainingData> => {
    const cip_code = params.cip_code?.split(".").join("") || "";
    const soc_code = params.soc_code?.split("-").join("") || "";
    const { page = 1, limit = 10, sort, cacheKey } = prepareSearchParameters(cip_code, soc_code, params);

    const cachedResults = cache.get<TrainingData>(cacheKey);
    if (cachedResults) {
      console.log(`Returning cached results for key: ${cacheKey}`);

      // Trigger the background fetch for the next pages
      fetchNextSearchPages(buildQuery(params), page, limit, sort, dataClient, { ...params, totalResults: cachedResults.meta.totalItems });

      return cachedResults;
    }

    // If not in cache, fetch the current page's data
    const query = buildQuery(params);
    console.log(`Executing search with query: ${JSON.stringify(query)}`);

    let ceRecordsResponse;
    try {
      const offset = (page - 1) * limit;  // Calculate the correct offset for pagination
      console.log(`Fetching results with offset ${offset} and limit ${limit} for page ${page}`);
      ceRecordsResponse = await fetchAllCerts(query, sort, offset, limit);  // Fetch only the current page
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error fetching results from Credential Engine API:", error);
      throw new Error("Failed to fetch results from Credential Engine API.");
    }

    const certificates = ceRecordsResponse.allCerts as CTDLResource[];
    const results = await Promise.all(certificates.map(certificate => transformCertificateToTraining(dataClient, certificate, params.searchQuery)));

    const filteredResults = await filterCerts(
      results,
      cip_code,
      params.complete_in,
      params.in_demand,
      params.max_cost
    );

    const sortedResults = await sortTrainings(filteredResults, sort);

    const paginatedResults = paginateCerts(sortedResults, 1, limit);

    const totalResults = ceRecordsResponse.totalResults;

    const data = packageResults(page, limit, paginatedResults, totalResults);

    cache.set(cacheKey, data);
    console.log(`Caching results for page ${page} with key ${cacheKey}`);

    // Trigger the background fetch for the next pages
    fetchNextSearchPages(query, page, limit, sort, dataClient, { ...params, totalResults });

    return data;
  };
};

interface SearchParams {
  searchQuery: string;
  page?: number;
  limit?: number;
  sort?: string;
  cip_code?: string;
  soc_code?: string;
  class_format?: string[];
  complete_in?: number[];
  county?: string;
  in_demand?: boolean;
  languages?: string[];
  max_cost?: number;
  miles?: number;
  services?: string[];
  zip_code?: string;
  totalResults: number;
}

async function fetchNextSearchPages(query: object, currentPage: number, limit: number, sort: string, dataClient: DataClient, params: SearchParams) {  const totalPages = Math.ceil(params.totalResults / limit);

  // Fetch the next two pages, if available
  for (let i = 1; i <= 2; i++) {
    const pageToFetch = currentPage + i;

    if (pageToFetch > totalPages) {
      console.log(`Reached the last page, no more pages to fetch.`);
      break;
    }

    const { cip_code, soc_code } = params;
    const { cacheKey } = prepareSearchParameters(cip_code, soc_code, { ...params, page: pageToFetch, limit, sort });

    if (!cache.get(cacheKey)) {
      const offset = (pageToFetch - 1) * limit;
      console.log(`Asynchronously fetching data for page ${pageToFetch}, offset ${offset}, limit ${limit}`);

      try {
        const ceRecordsResponse = await fetchAllCerts(query, sort, offset, limit);
        const certificates = ceRecordsResponse.allCerts as CTDLResource[];

        if (certificates.length === 0) {
          console.log(`No records found for page ${pageToFetch}`);
          return;
        }

        const results = await Promise.all(certificates.map(certificate => transformCertificateToTraining(dataClient, certificate, params.searchQuery)));

        const filteredResults = await filterCerts(results, cip_code, params.complete_in, params.in_demand, params.max_cost);
        const sortedResults = await sortTrainings(filteredResults, sort);
        const paginatedResults = paginateCerts(sortedResults, 1, limit);

        const data = packageResults(pageToFetch, limit, paginatedResults, ceRecordsResponse.totalResults);

        cache.set(cacheKey, data);
        console.log(`Caching results for page ${pageToFetch} with key ${cacheKey}`);
      } catch (error) {
        console.error(`Error asynchronously fetching page ${pageToFetch}:`, error);
      }
    } else {
      console.log(`Cache hit for page ${pageToFetch} with key ${cacheKey}`);
    }
  }
}

function prepareSearchParameters(
  cip_code_value= "",
  soc_code_value = "",
  params: {
    searchQuery: string,
    page?: number,
    limit?: number,
    sort?: string,
    class_format?: string[],
    complete_in?: number[],
    county?: string,
    in_demand?: boolean,
    languages?: string[],
    max_cost?: number,
    miles?: number,
    services?: string[],
    zip_code?: string,
    cip_code?: string,
    soc_code?: string,
  }) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const cip_code = params.cip_code ? `-cip:${cip_code_value}` : "";
  const class_format = params.class_format ? `-format:${params.class_format.join(",")}` : "";
  const complete_in = params.complete_in ? `-complete:${params.complete_in.join(",")}` : "";
  const county = params.county ? `-${params.county}` : "";
  const in_demand = params.in_demand ? "-in_demand" : "";
  const languages = params.languages ? `-${params.languages.join(",")}` : "";
  const max_cost = params.max_cost ? `-max:${params.max_cost}` : "";
  const miles = params.miles ? `-miles:${params.miles}` : "";
  const services = params.services ? `-services:${params.services.join(",")}` : "";
  const soc_code = params.soc_code ? `-soc:${soc_code_value}` : "";
  const zip_code = params.zip_code ? `-zip:${params.zip_code}` : "";

  const sort = determineSortOption(params.sort);
  const cacheKey = `searchQuery-${params.searchQuery}-${page}-${limit}-${sort}${cip_code}${class_format}${complete_in}${county}${in_demand}${languages}${max_cost}${miles}${services}${soc_code}${zip_code}`;

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

type SearchTerm = {
  "search:value": string;
  "search:matchType": string;
};

type TermGroup = {
  "search:operator": string;
  "ceterms:name"?: SearchTerm | SearchTerm[];
  "ceterms:description"?: SearchTerm | SearchTerm[];
  "ceterms:ownedBy"?: { "ceterms:name": SearchTerm | SearchTerm[] };
  "ceterms:occupationType"?: { "ceterms:codedNotation": SearchTerm };
  "ceterms:instructionalProgramType"?: { "ceterms:codedNotation": SearchTerm };
};

function buildQuery(params: {
  searchQuery: string,
  county?: string,
  miles?: number,
  zip_code?: string
}) {
  const isSOC = /^\d{2}-?\d{4}(\.00)?$/.test(params.searchQuery);
  const isCIP = /^\d{2}\.?\d{4}$/.test(params.searchQuery);
  const isZipCode = zipcodes.lookup(params.searchQuery);
  const isCounty = Object.keys(zipcodeJson.byCounty).includes(params.searchQuery);

  /*  const miles = params.miles;
  const zipcode = params.zip_code;*/
  /*
    let zipcodesList: string[] | zipcodes.ZipCode[] = []

    if (isZipCode) {
      zipcodesList = [params.searchQuery]
    } else if (isCounty) {
      zipcodesList = zipcodeJson.byCounty[params.searchQuery as keyof typeof zipcodeJson.byCounty]
    }

    if (params.county) {
      zipcodesList = zipcodeJson.byCounty[params.county as keyof typeof zipcodeJson.byCounty]
    }

    if (miles && miles > 0 && zipcode) {
      const zipcodesInRadius = zipcodes.radius(zipcode, miles);
      zipcodesList = zipcodesInRadius;
    }*/

  const queryParts = params.searchQuery.split('+').map(part => part.trim());
  const hasMultipleParts = queryParts.length > 1;
  const [ownedByPart, trainingPart] = queryParts;

  let termGroup: TermGroup = {
    "search:operator": "search:orTerms",
    ...(isSOC || isCIP || !!isZipCode || isCounty ? undefined : {
      "ceterms:name": { "search:value": params.searchQuery, "search:matchType": "search:contains" },
      "ceterms:description": { "search:value": params.searchQuery, "search:matchType": "search:contains" },
      "ceterms:ownedBy": { "ceterms:name": { "search:value": params.searchQuery, "search:matchType": "search:contains" } }
    }),
    "ceterms:occupationType": isSOC ? {
      "ceterms:codedNotation": { "search:value": params.searchQuery, "search:matchType": "search:startsWith" }
    } : undefined,
    "ceterms:instructionalProgramType": isCIP ? {
      "ceterms:codedNotation": { "search:value": params.searchQuery, "search:matchType": "search:startsWith" }
    } : undefined
  };

  if (hasMultipleParts) {
    termGroup = {
      "search:operator": "search:andTerms",
      "ceterms:ownedBy": { "ceterms:name": { "search:value": ownedByPart, "search:matchType": "search:contains" } },
      "ceterms:name": { "search:value": trainingPart, "search:matchType": "search:contains" }
    };
  }

  return {
    "@type": {
      "search:value": "ceterms:LearningOpportunityProfile",
      "search:matchType": "search:subClassOf",
    },
    "ceterms:lifeCycleStatusType": {
      "ceterms:targetNode": "lifeCycle:Active",
    },
    "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d",
    "search:termGroup": termGroup
  };
}

async function transformCertificateToTraining(dataClient: DataClient, certificate: CTDLResource, searchQuery: string): Promise<TrainingResult> {
  try {
    const desc = certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : null;
    const highlight = desc ? await getHighlight(desc, searchQuery) : "";

    const provider = await credentialEngineUtils.getProviderData(certificate);

    const cipCode = await credentialEngineUtils.extractCipCode(certificate);
    const cipDefinition = await dataClient.findCipDefinitionByCip(cipCode);

    const occupations = await credentialEngineUtils.extractOccupations(certificate);
    const socCodes = occupations.map((occupation: { soc: string }) => occupation.soc);

    const outcomesDefinition = await dataClient.findOutcomeDefinition(cipCode, provider.providerId);

    return {
      ctid: certificate["ceterms:ctid"] || "",
      name: certificate["ceterms:name"]?.["en-US"] || "",
      cipDefinition: cipDefinition ? cipDefinition[0] : null,
      totalCost: await credentialEngineUtils.extractCost(certificate, "costType:AggregateCost"),
      percentEmployed: outcomesDefinition ? formatPercentEmployed(outcomesDefinition.peremployed2) : null,
      calendarLength: await credentialEngineUtils.getCalendarLengthId(certificate),
      localExceptionCounty: await getLocalExceptionCounties(dataClient, cipCode),
      online: await credentialEngineUtils.hasOnlineOffering(certificate),
      providerId: provider.providerId,
      providerName: provider.name,
      availableAt: await credentialEngineUtils.getAvailableAtAddresses(certificate),
      inDemand: (await dataClient.getCIPsInDemand()).map((c) => c.cipcode).includes(cipCode ?? ""),
      highlight: highlight,
      socCodes: socCodes,
      hasEveningCourses: await credentialEngineUtils.hasEveningSchedule(certificate),
      languages: await credentialEngineUtils.getLanguages(certificate),
      isWheelchairAccessible: await credentialEngineUtils.checkAccommodation(certificate, "accommodation:PhysicalAccessibility"),
      hasJobPlacementAssistance: await credentialEngineUtils.checkSupportService(certificate, "support:JobPlacement"),
      hasChildcareAssistance: await credentialEngineUtils.checkSupportService(certificate, "support:Childcare"),
      totalClockHours: null,
    };
  } catch (error) {
    console.error("Error transforming certificate to training:", error);
    throw error;
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

const NAN_INDICATOR = "-99999";

const formatPercentEmployed = (perEmployed: string | null): number | null => {
  if (perEmployed === null || perEmployed === NAN_INDICATOR) {
    return null;
  }

  return parseFloat(perEmployed);
};
