import NodeCache from "node-cache";
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
    page?: number,
    limit?: number,
    sort?: string,
    classFormat?: string,
    completeIn?: string[],
    county?: string,
    inDemand?: boolean,
    languages?: string[],
    maxCost?: string,
    miles?: string,
    services?: string[],
    zip?: string,
    cipCode?: string,
    socCode?: string
  }): Promise<TrainingData> => {
    console.log(params)
    const { page, limit, sort, zip, miles, cacheKey } = prepareSearchParameters(params);

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
  page?: number,
  limit?: number,
  sort?: string,
  classFormat?: string,
  completeIn?: string[],
  county?: string,
  inDemand?: boolean,
  languages?: string[],
  maxCost?: string,
  miles?: string,
  services?: string[],
  zip?: string,
  cipCode?: string,
  socCode?: string
 }) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const classFormat = params.classFormat;
  const completeIn = params.completeIn;
  const county = params.county;
  const inDemand = params.inDemand;
  const languages = params.languages;
  const maxCost = params.maxCost;
  const miles = params.miles;
  const services = params.services;
  const zip = params.zip;
  const cipCode = params.cipCode;
  const socCode = params.socCode;

  const sort = determineSortOption(params.sort);
  const cacheKey = `searchQuery-${params.searchQuery}-${page}-${limit}-${sort}${zip && miles ? `-${zip}-${miles}` : ""}`;

  return {
    page,
    limit,
    sort,
    classFormat,
    completeIn,
    county,
    inDemand,
    languages,
    maxCost,
    miles,
    services,
    zip,
    cipCode,
    socCode,
    cacheKey
  };
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
  zip?: string,
  miles?: string
}) {
  console.log({params})
  const isSOC = /^\d{2}-?\d{4}(\.00)?$/.test(params.searchQuery);
  const isCIP = /^\d{2}\.?\d{4}$/.test(params.searchQuery);
  const isZipCode = zipcodes.lookup(params.searchQuery);
  const isCounty = Object.keys(zipcodeJson.byCounty).includes(params.searchQuery);

  const buildAvailableAtQuery = () => {
    if (isZipCode) {
      return params.searchQuery;
    }

    if (isCounty) {
      return zipcodeJson.byCounty[params.searchQuery as keyof typeof zipcodeJson.byCounty];
    }

    if (params.miles && params.zip) {
      const milesNum = Number(params.miles);
      console.log("params.miles", params.miles)
      const radius = zipcodes.radius(params.zip, milesNum);
      return radius;
    }

    return undefined;
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
          } : undefined,
          "ceterms:availableAt": {
            "ceterms:postalCode": buildAvailableAtQuery()
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

    const ownedByCtid = await credentialEngineUtils.getCtidFromURL(certificate["ceterms:ownedBy"]?.[0] ?? "");
    const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
    const address = await credentialEngineUtils.getAvailableAtAddress(certificate);

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
      providerId: ownedByCtid,
      providerName: ownedByRecord["ceterms:name"]?.["en-US"],
      availableAt: address,
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
