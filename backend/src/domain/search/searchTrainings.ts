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

// Initializing a simple in-memory cache
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

const paginateCerts = (certs: CTDLResource[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return certs.slice(start, end);
};

const hasAllCerts = (certNum: number, totalResults: number) => certNum === totalResults;

const fetchAllCerts = async (query: object, sort: string) => {
  const firstBatch = await credentialEngineAPI.getResults(query, 0, 100, sort);
  const totalResults = firstBatch.data.extra.TotalResults;

  let allCerts;
  if (hasAllCerts(firstBatch.data.data.length, totalResults)) {
    allCerts = firstBatch.data.data;
  } else {
    // How many fetches need to be made
    const remainingCerts = totalResults - 100;
    const numOfFetches = parseInt(Math.ceil(remainingCerts / 100).toString().split(".")[0], 10);
    console.log({ remainingCerts, numOfFetches });

    allCerts = firstBatch.data.data;

    for (let i = 1; i <= numOfFetches; i++) {
      const nextBatch = await credentialEngineAPI.getResults(query, i * 100, 100, sort);
      allCerts = allCerts.concat(nextBatch.data.data);
    }
  }

  return { allCerts, totalResults };
}

export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (params: { searchQuery: string, page?: number, limit?: number, sort?: string }): Promise<TrainingData> => {
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

    const paginatedCerts = paginateCerts(certificates, page, limit);

    // Added null check
    const results = await Promise.all(paginatedCerts.map(certificate => transformCertificateToTraining(dataClient, certificate, params.searchQuery)));

    const totalResults = ceRecordsResponse.totalResults;

    const data = packageResults(page, limit, results, totalResults);

    cache.set(cacheKey, data);
    return data;
  };
};

function prepareSearchParameters(params: {
  searchQuery: string,
  page?: number,
  limit?: number,
  sort?: string,
  county?: string,
  maxCost?: number,
  miles?: number,
  zipcode?: string
}) {
  const page = params.page || 1;
  const limit = params.limit || 10;

  const sort = determineSortOption(params.sort);
  const cacheKey = `searchQuery-${params.searchQuery}-${page}-${limit}-${sort}-${params.county}-${params.maxCost}-${params.miles}-${params.zipcode}`;

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

function buildQuery(params: {
  searchQuery: string,
  county?: string,
  maxCost?: number,
  miles?: number,
  zipcode?: string
}) {
  const isSOC = /^\d{2}-?\d{4}(\.00)?$/.test(params.searchQuery);
  const isCIP = /^\d{2}\.?\d{4}$/.test(params.searchQuery);
  const isZipCode = zipcodes.lookup(params.searchQuery);
  const isCounty = Object.keys(zipcodeJson.byCounty).includes(params.searchQuery);

  const miles = params.miles;
  const zipcode = params.zipcode;

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
  }

  return {
    "@type": {
      "search:value": "ceterms:Credential",
      "search:matchType": "search:subClassOf",
    },
    "search:termGroup": {
      "search:operator": "search:andTerms",
      "search:value": [
        {
          "search:operator": "search:orTerms",
          ...(isSOC || isCIP || !!isZipCode || isCounty ? {} : {
            "ceterms:name": params.searchQuery,
            "ceterms:description": params.searchQuery,
            "ceterms:ownedBy": { "ceterms:name": { "search:value": params.searchQuery, "search:matchType": "search:contains" } }
          }),
          "ceterms:occupationType": isSOC ? {
            "ceterms:codedNotation": { "search:value": params.searchQuery, "search:matchType": "search:startsWith" }
          } : undefined,
          "ceterms:instructionalProgramType": isCIP ? {
            "ceterms:codedNotation": { "search:value": params.searchQuery, "search:matchType": "search:startsWith" }
          } : undefined
        },{
          "ceterms:availableAt": {
            "ceterms:postalCode": zipcodesList
          }
        },
        {
          "search:operator": "search:andTerms",
          "ceterms:credentialStatusType": {
            "ceterms:targetNode": "credentialStat:Active",
          },
          "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d",
        },
      ],
    },
  };
}

async function transformCertificateToTraining(dataClient: DataClient, certificate: CTDLResource, searchQuery: string): Promise<TrainingResult> {
  try {
    const desc = certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : null;
    const highlight = desc ? await getHighlight(desc, searchQuery) : "";

    const provider = await credentialEngineUtils.getProviderData(certificate);

    const cipCode = await credentialEngineUtils.extractCipCode(certificate);
    const cipDefinition = await dataClient.findCipDefinitionByCip(cipCode);

    return {
      id: certificate["ceterms:ctid"] || "",
      name: certificate["ceterms:name"]?.["en-US"] || "",
      cipDefinition: cipDefinition ? cipDefinition[0] : null,
      totalCost: await credentialEngineUtils.extractCost(certificate, "costType:AggregateCost"),
      percentEmployed: await credentialEngineUtils.extractEmploymentData(certificate),
      calendarLength: await credentialEngineUtils.getCalendarLengthId(certificate),
      localExceptionCounty: await getLocalExceptionCounties(dataClient, cipCode),
      online: certificate["ceterms:availableOnlineAt"] != null,
      providerId: provider.id,
      providerName: provider.name,
      availableAt: await credentialEngineUtils.getAvailableAtAddresses(certificate),
      inDemand: (await dataClient.getCIPsInDemand()).map((c) => c.cipcode).includes(cipCode ?? ""),
      highlight: highlight,
      socCodes: [],
      hasEveningCourses: await credentialEngineUtils.hasEveningSchedule(certificate),
      languages: "",
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
