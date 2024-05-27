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

export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (params: {
    searchQuery: string,
    maxCost?: number,
    miles?: number,
    zipCode?: string,
    page?: number,
    limit?: number,
    sort?: string,
  }): Promise<TrainingData> => {
    console.log(params);
    const { maxCost, miles, zipCode, page, limit, sort, cacheKey } = prepareSearchParameters(params);

    const cachedResults = cache.get<TrainingData>(cacheKey);
    if (cachedResults) {
      console.log("Returning cached results for key:", cacheKey);
      return cachedResults;
    }

    const query = buildQuery(params);
    console.log("Executing search with query:", JSON.stringify(query));

    let ceRecordsResponse;
    try {
      ceRecordsResponse = await credentialEngineAPI.getResults(query, (page - 1) * limit, limit, sort);
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error fetching results from Credential Engine API:", error);
      throw new Error("Failed to fetch results from Credential Engine API.");
    }

    const certificates = ceRecordsResponse.data.data as CTDLResource[];
    const results = await Promise.all(certificates.map(certificate => transformCertificateToTraining(dataClient, certificate, params.searchQuery)));

    const totalResults = ceRecordsResponse.data.extra.TotalResults;

    const data = packageResults(page, limit, results, totalResults);

    cache.set(cacheKey, data);
    return data;
  };
};

function prepareSearchParameters(params: {
  searchQuery: string,
  maxCost?: number,
  miles?: number,
  zipCode?: string,
  page?: number,
  limit?: number,
  sort?: string
}) {
  const maxCost = params.maxCost;
  const miles = params.miles;
  const zipCode = params.zipCode;

  const page = params.page || 1;
  const limit = params.limit || 10;

  const sort = determineSortOption(params.sort);
  const cacheKey = `searchQuery-${params.searchQuery}-${page}-${limit}-${sort}${miles ? `-${miles}` : ""}${zipCode ? `-${zipCode}` : ""}${maxCost ? `-${maxCost}` : ""}`;

  return { maxCost, miles, zipCode, page, limit, sort, cacheKey };
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

function buildAvailableAtQuery (zipCode?: string | string[] | undefined, miles?: number) {
  let zip;

  if (Array.isArray(zipCode) && zipCode.length > 1) {
    return zipCode
  }

  if (Array.isArray(zipCode) && zipCode.length === 1) {
    zip = zipCode[0];
  } else {
    zip = zipCode as string;
  }

  console.log(miles)

  if (zip && miles && !isNaN(miles)) {
    const radius = zipcodes.radius(zip, miles);
    return radius;
  }

  if (zip) {
    return zip;
  }

  return undefined;
}

function buildQuery(params: {
  searchQuery: string,
  maxCost?: number,
  miles?: number,
  zipCode?: string
}) {
  const isSOC = /^\d{2}-?\d{4}(\.00)?$/.test(params.searchQuery);
  const isCIP = /^\d{2}\.?\d{4}$/.test(params.searchQuery);
  const isZipCode = zipcodes.lookup(params.searchQuery);
  const isCounty = Object.keys(zipcodeJson.byCounty).includes(params.searchQuery);
  const maxCost = params.maxCost;

  let zipCode

  if (isZipCode) {
    zipCode = params.searchQuery;
  }
  
  if (isCounty) {
    zipCode = Object.keys(zipcodeJson.byCounty[params.searchQuery as keyof typeof zipcodeJson.byCounty])[0]
  }
  
  if (params.zipCode) {
    zipCode = params.zipCode;
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
          ...(isCIP || isSOC || !!isZipCode || isCounty ? {} : {
            "ceterms:name": params.searchQuery,
            "ceterms:description": params.searchQuery,
            "ceterms:ownedBy": { "ceterms:name": { "search:value": params.searchQuery, "search:matchType": "search:contains" } }
          }),
          "ceterms:occupationType": isSOC ? {
            "ceterms:codedNotation": { "search:value": params.searchQuery, "search:matchType": "search:startsWith" }
          } : undefined,
          "ceterms:instructionalProgramType": isCIP ? {
            "ceterms:codedNotation": { "search:value": params.searchQuery, "search:matchType": "search:startsWith" }
          } : undefined,
        },
        {
          "ceterms:requires": {
            "ceterms:availableAt": {
              "ceterms:postalCode": buildAvailableAtQuery(zipCode, params.miles)
            },
            "ceterms:estimatedCost": maxCost && !isNaN(maxCost) && maxCost > 0 ? {
              "ceterms:directCostType": {
                "ceterms:targetNode": "costType:AggregateCost"
              },
              "ceterms:price": [
                0,
                maxCost
              ]
            } : undefined,
          },
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
