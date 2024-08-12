import NodeCache = require("node-cache");
import * as Sentry from "@sentry/node";
import { SearchTrainings,  } from "../types";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import { getLocalExceptionCounties } from "../utils/getLocalExceptionCounties";
import { DataClient } from "../DataClient";
import { getHighlight } from "../utils/getHighlight";
import {TrainingData, TrainingResult} from "../training/TrainingResult";
import zipcodeJson from "../utils/zip-county.json";
import zipcodes from "zipcodes";

// Ensure TrainingData is exported in ../types
// types.ts:
// export interface TrainingData { ... }

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

// Initializing a simple in-memory cache
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

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
    sort?: string
    cip_code?: string
    class_format?: string[],
    complete_in?: number[],
    county?: string,
    in_demand?: boolean,
    languages?: string[],
    max_cost?: number,
    miles?: number,
    services?: string[],
    soc_code?: string,
    zip_code?: string,
  }): Promise<TrainingData> => {
    const cip_code = params.cip_code?.split(".").join("") || "";
    const soc_code = params.soc_code?.split("-").join("") || "";
    const { page, limit, sort, cacheKey } = prepareSearchParameters(cip_code, soc_code, params);

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
    const results = await Promise.all(certificates.map(certificate => transformCertificateToTraining(dataClient, certificate, params.searchQuery)));

    const filteredResults = await filterCerts(
      results,
      cip_code,
      params.complete_in,
      params.in_demand,
      params.max_cost
    );

    const sortedResults = await sortTrainings(filteredResults, sort);

    const paginatedResults = paginateCerts(sortedResults, page, limit);

    console.log(paginatedResults)

    const totalResults = filteredResults.length;

    const data = packageResults(page, limit, paginatedResults, totalResults);

    const dataJSON = JSON.stringify(data);
    console.log(dataJSON);

    cache.set(cacheKey, data);
    return data;
  };
};


function prepareSearchParameters(
  cip_code_value: string,
  soc_code_value: string,
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
    zip_code?: string
}) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const cip_code = `-cip:${cip_code_value}` || "";
  const class_format = `-format:${params.class_format?.join(",")}` || [];
  const complete_in = `-complete:${params.complete_in?.join(",")}` || [];
  const county = `-${params.county}` || "";
  const in_demand = params.in_demand ? "-in_demand" : "";
  const languages = `-${params.languages?.join(",")}` || "";
  const max_cost = `-max:${params.max_cost}` || "";
  const miles = `-miles:${params.miles}` || "";
  const services = `-services:${params.services?.join(",")}` || "";
  const soc_code = `-soc:${soc_code_value}` || "";
  const zip_code = `-zip:${params.zip_code}` || "";

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
      "search:value": "ceterms:Credential",
      "search:matchType": "search:subClassOf",
    },
    "ceterms:credentialStatusType": {
      "ceterms:targetNode": "credentialStat:Active",
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
      // percentEmployed: await credentialEngineUtils.extractEmploymentData(certificate),d
      percentEmployed:outcomesDefinition ? formatPercentEmployed(outcomesDefinition.peremployed2) : null,
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
