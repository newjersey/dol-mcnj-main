import NodeCache from "node-cache";
// import * as Sentry from "@sentry/node";
import { SearchTrainings } from "../types";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import { getLocalExceptionCounties } from "../utils/getLocalExceptionCounties";
import { DataClient } from "../DataClient";
import { getHighlight } from "../utils/getHighlight";
import { TrainingData, TrainingResult } from "../training/TrainingResult";
import zipcodeJson from "../utils/zip-county.json";
import zipcodes, {ZipCode} from "zipcodes";
import { convertZipCodeToCounty } from "../utils/convertZipCodeToCounty";
import { DeliveryType } from "../DeliveryType";
import { normalizeCipCode } from "../utils/normalizeCipCode";
import { normalizeSocCode } from "../utils/normalizeSocCode";

// Initializing a simple in-memory cache
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

const searchTrainingPrograms = async (query: object, offset = 0, limit = 10): Promise<{ allCerts: CTDLResource[]; totalResults: number }> => {
  try {
    // console.log(`FETCHING RECORD with offset ${offset} and limit ${limit}`);
    const response = await credentialEngineAPI.getResults(query, offset, limit);
    return {
      allCerts: response.data.data || [],
      totalResults: response.data.extra.TotalResults || 0,
    };
  } catch (error) {
    console.error(`Error fetching records (offset: ${offset}, limit: ${limit}):`, error);
    // Return an empty result set to allow processing to continue
    return { allCerts: [], totalResults: 0 };
  }
};


const searchTrainingProgramsInBatches = async (query: object, batchSize = 100) => {
  const allCerts: CTDLResource[] = [];
  const initialResponse = await searchTrainingPrograms(query, 0, batchSize);
  const totalResults = initialResponse.totalResults;
  allCerts.push(...initialResponse.allCerts);

  const fetchBatch = async (offset: number) => {
    try {
      const response = await searchTrainingPrograms(query, offset, batchSize);
      return response.allCerts;
    } catch (error) {
      console.error(`Error fetching batch at offset ${offset}:`, error);
      return [];
    }
  };

  const offsets = [];
  for (let offset = batchSize; offset < totalResults; offset += batchSize) {
    offsets.push(offset);
  }

  // Process requests in batches of 5 to avoid overloading the API
  const concurrencyLimit = 5;
  for (let i = 0; i < offsets.length; i += concurrencyLimit) {
    const batchOffsets = offsets.slice(i, i + concurrencyLimit);
    const results = await Promise.all(batchOffsets.map(fetchBatch));
    results.forEach((batch) => allCerts.push(...batch));
  }

  return { allCerts, totalResults };
};

const filterRecords = async (
  results: TrainingResult[],
  cip_code?: string,
  soc_code?: string,
  complete_in?: number[],
  in_demand?: boolean,
  max_cost?: number,
  county?: string,
  miles?: number,
  zipcode?: string,
  format?: string[],
  languages?: string[],
  services?: string[]
) => {
  let filteredResults = results;

  if (cip_code) {
    const normalizedCip = normalizeCipCode(cip_code);
    filteredResults = filteredResults.filter(
      (result) => normalizeCipCode(result.cipDefinition?.cipcode || '') === normalizedCip
    );
  }

  if (soc_code) {
    const normalizedSoc = normalizeSocCode(soc_code);
    filteredResults = filteredResults.filter(
      (result) => result.socCodes?.some(
        (soc) => normalizeSocCode(soc) === normalizedSoc
      )
    );
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

  if (format && format.length > 0) {
    const deliveryTypeMapping: Record<string, DeliveryType> = {
      "inperson": DeliveryType.InPerson,
      "online": DeliveryType.OnlineOnly,
      "blended": DeliveryType.BlendedDelivery,
    };

    // Convert format to the corresponding DeliveryType terms
    const mappedClassFormats = format
      .map((f) => deliveryTypeMapping[f.toLowerCase() as keyof typeof deliveryTypeMapping])
      .filter(Boolean);

    // Filter results based on the mapped delivery types
    filteredResults = filteredResults.filter(result => {
      const deliveryTypes = result.deliveryTypes || [];
      return mappedClassFormats.some(mappedFormat => deliveryTypes.includes(mappedFormat));
    });
  }

  if (county) {
    filteredResults = filteredResults.filter(result => {
      const zipCodes = result.availableAt?.map(address => address.zipCode).filter(Boolean) || [];
      const counties = zipCodes.map(zip => convertZipCodeToCounty(zip)).filter(Boolean);
      return counties.some(trainingCounty => trainingCounty.toLowerCase() === county.toLowerCase());
    });
  }

  if (miles !== undefined && miles >= 0 && zipcode) {
    const validZip = zipcodes.lookup(zipcode);
    if (!validZip) {
      console.warn(`Invalid ZIP code: ${zipcode}`);
      return [];
    }

    filteredResults = filteredResults.filter(result => {
      const zipCodes = result.availableAt?.map(address => address.zipCode).filter(Boolean) || [];

      if (miles === 0) {
        return zipCodes.some(trainingZip => trainingZip?.trim() === zipcode.trim());
      }

      const zipCodesInRadius = zipcodes.radius(zipcode as string & ZipCode, miles);

      return zipCodes
        .filter((trainingZip): trainingZip is string => Boolean(trainingZip))
        .some(trainingZip => zipCodesInRadius.includes(trainingZip as string & ZipCode));
    });
  }
  if (languages && languages.length > 0) {
      filteredResults = filteredResults.filter(result => {
        return languages.every(language => result.languages?.includes(language))
      })
  }

  if (services && services.length > 0) {
    filteredResults = (await Promise.all(filteredResults.map(async result => { 
        const serviceChecks = await Promise.all(services.map(async service => {
          switch (service) {
            case 'wheelchair':
                return typeof result.isWheelchairAccessible === 'function'
                    ? await result.isWheelchairAccessible() 
                    : result.isWheelchairAccessible;
            case 'evening':
                return result.hasEveningCourses;
            case 'placement':
                return typeof result.hasJobPlacementAssistance === 'function'
                    ? await result.hasJobPlacementAssistance()
                    : result.hasJobPlacementAssistance;
            case 'childcare':
                return typeof result.hasChildcareAssistance === 'function'
                    ? await result.hasChildcareAssistance()
                    : result.hasChildcareAssistance;
            default:
                return false; 
        }
        }))
        return serviceChecks.every(Boolean) ? result : null
      }))
    ).filter(result => result !== null)
  }


  return filteredResults;
}

const paginateRecords = (certs: TrainingResult[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return certs.slice(start, end);
};

export const sortTrainings = (trainings: TrainingResult[], sort: string): TrainingResult[] => {
  switch (sort) {
    case "asc":
      console.log("Before sorting (asc):", trainings.map(t => t.name));
      return trainings.sort((a, b) => {
        const nameA = a.name || "";
        const nameB = b.name || "";
        return nameA.localeCompare(nameB);
      });
    case "desc":
      console.log("Before sorting (desc):", trainings.map(t => t.name));
      return trainings.sort((a, b) => {
        const nameA = a.name || "";
        const nameB = b.name || "";
        return nameB.localeCompare(nameA);
      });
    case "price_asc":
      return trainings.sort((a, b) => (a.totalCost || 0) - (b.totalCost || 0));
    case "price_desc":
      return trainings.sort((a, b) => (b.totalCost || 0) - (a.totalCost || 0));
    case "EMPLOYMENT_RATE":
      console.log("Before sorting by employment rate:", trainings.map(t => t.percentEmployed));
      return trainings.sort((a, b) => {
        const rateA = a.percentEmployed !== null && a.percentEmployed !== undefined ? a.percentEmployed : -Infinity;
        const rateB = b.percentEmployed !== null && b.percentEmployed !== undefined ? b.percentEmployed : -Infinity;
        return rateB - rateA;
      });
    case "best_match":
    default:
      return trainings;
  }
};

// Utility to normalize query parameters for consistent caching
function normalizeQueryParams(params: any) {
  return {
    searchTerm: params.searchQuery?.trim().toLowerCase(),
    cip_code: params.cip_code?.trim(),
    soc_code: params.soc_code?.trim(),
    county: params.county?.trim(),
    zipcode: params.zipcode?.trim(),
    in_demand: params.in_demand || false,
    page: params.page || 1,
    limit: params.limit || 10,
    sort: params.sort || "best_match",
    filters: params.filters ? [...params.filters].sort((a: any, b: any) => a.key.localeCompare(b.key)) : undefined,
  };
}


export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (params: {
    searchQuery: string,
    page?: number,
    limit?: number,
    sort?: string,
    cip_code?: string,
    soc_code?: string,
    format?: string[],
    complete_in?: number[],
    county?: string,
    in_demand?: boolean,
    languages?: string[],
    max_cost?: number,
    miles?: number,
    services?: string[],
    zipcode?: string
  }): Promise<TrainingData> => {
    const { page = 1, limit = 10, sort = "best_match" } = params;
    const query = buildQuery(params);
    const normalizedParams = normalizeQueryParams(params);

    const unFilteredCacheKey = `filteredResults-${JSON.stringify(normalizedParams)}`;
    let unFilteredResults = cache.get<TrainingResult[]>(unFilteredCacheKey);

    // If unfiltered results are not in cache, fetch the results
    if (!unFilteredResults) {
      console.log(`Cache miss: Fetching results for query: ${normalizedParams.searchTerm}`);
      const { allCerts } = await searchTrainingProgramsInBatches(query);

      unFilteredResults = await Promise.all(
        allCerts.map((certificate) =>
          transformCertificateToTraining(dataClient, certificate, params.searchQuery)
        )
      );

      // Cache the filtered results
      cache.set(unFilteredCacheKey, unFilteredResults, 300); // Cache for 5 minutes
    } else {
      console.log(`Cache hit for filtered results with key: ${unFilteredCacheKey}`);
    }

    // Apply filtering
    const filteredResults = await filterRecords(
      unFilteredResults,
      params.cip_code,
      params.soc_code,
      params.complete_in,
      params.in_demand,
      params.max_cost,
      params.county,
      params.miles,
      params.zipcode,
      params.format,
      params.languages,
      params.services
    );

    // Apply sorting to the cached filtered results
    const sortedResults = sortTrainings(filteredResults, sort);

    // Paginate the sorted results
    const paginatedResults = paginateRecords(sortedResults, page, limit);

    const data = packageResults(page, limit, paginatedResults, sortedResults.length);
    return data;
  };
};

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
  zipcode?: string
}) {
  const isSOC = /^\d{2}-?\d{4}(\.00)?$/.test(params.searchQuery);
  const isCIP = /^\d{2}\.?\d{4}$/.test(params.searchQuery);
  const isZipCode = zipcodes.lookup(params.searchQuery);
  const isCounty = Object.keys(zipcodeJson.byCounty).includes(params.searchQuery);

  const queryParts = params.searchQuery.split('+').map(part => part.trim());
  const hasMultipleParts = queryParts.length > 1;
  const [ownedByPart, trainingPart] = queryParts;

  let termGroup: TermGroup = {
    "search:operator": "search:orTerms",
    ...(isSOC || isCIP || !!isZipCode || isCounty ? undefined : {
      "ceterms:name": [
        { "search:value": params.searchQuery, "search:matchType": "search:exact" },
        { "search:value": params.searchQuery, "search:matchType": "search:contains" },
      ],
      "ceterms:description": [
        { "search:value": params.searchQuery, "search:matchType": "search:exact" },
        { "search:value": params.searchQuery, "search:matchType": "search:contains" },
      ],
      "ceterms:ownedBy": {
        "ceterms:name": {
          "search:value": params.searchQuery,
          "search:matchType": "search:contains"
        }
      }
    }),
    "ceterms:occupationType": isSOC ? {
      "ceterms:codedNotation": {
        "search:value": params.searchQuery,
        "search:matchType": "search:startsWith"
      }
    } : undefined,
        "ceterms:instructionalProgramType": isCIP ?
          {"ceterms:codedNotation": {
            "search:value": params.searchQuery,
            "search:matchType": "search:startsWith"
          }
    } : undefined
  };

  if (hasMultipleParts) {
    termGroup = {
      "search:operator": "search:andTerms",
      "ceterms:ownedBy": {
        "ceterms:name": {
          "search:value": ownedByPart,
          "search:matchType": "search:contains"
        }
      },
      "ceterms:name": {
        "search:value": trainingPart,
        "search:matchType": "search:contains"
      }
    };
  }

  return {
    "@type": {
      "search:value": "ceterms:LearningOpportunityProfile",
      "search:matchType": "search:subClassOf"
    },
    "ceterms:lifeCycleStatusType": {
      "ceterms:targetNode": "lifeCycle:Active",
    },
    "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d",
    "search:termGroup": termGroup
  };
}

async function transformCertificateToTraining(
  dataClient: DataClient,
  certificate: CTDLResource,
  searchQuery: string
): Promise<TrainingResult> {
  try {
    const desc = certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : null;
    const highlight = desc ? await getHighlight(desc, searchQuery) : "";
    // Lazy load Credential Engine utilities when needed
    const { credentialEngineUtils } = await import("../../credentialengine/CredentialEngineUtils");
    const provider = await credentialEngineUtils.getProviderData(certificate);
    const cipCode = await credentialEngineUtils.extractCipCode(certificate);
    const cipDefinition = cipCode ? await dataClient.findCipDefinitionByCip(cipCode) : null;

    const occupations = await credentialEngineUtils.extractOccupations(certificate);
    const socCodes = occupations.map((occupation) => occupation.soc);

    let outcomesDefinition = null;
    if (provider?.providerId) {
      outcomesDefinition = await dataClient.findOutcomeDefinition(provider.providerId, cipCode);
    } else {
      console.warn("Provider is null; skipping outcomesDefinition lookup.");
    }

    const inDemandCIPs = await dataClient.getCIPsInDemand();
    const isInDemand = inDemandCIPs.map((c) => c.cipcode).includes(cipCode ?? "");

    const getWheelchairAccessibility = async () =>
      await credentialEngineUtils.checkAccommodation(certificate, "accommodation:PhysicalAccessibility");

    const getJobPlacementAssistance = async () =>
      await credentialEngineUtils.checkSupportService(certificate, "support:JobPlacement");

    const getChildcareAssistance = async () =>
      await credentialEngineUtils.checkSupportService(certificate, "support:Childcare");

    const result: TrainingResult = {
      ctid: certificate["ceterms:ctid"] || "",
      name: certificate["ceterms:name"]?.["en-US"] || "",
      cipDefinition: cipDefinition ? cipDefinition[0] : null,
      totalCost: await credentialEngineUtils.extractCost(certificate, "costType:AggregateCost"),
      percentEmployed: outcomesDefinition ? formatPercentEmployed(outcomesDefinition.peremployed2) : null,
      calendarLength: await credentialEngineUtils.getCalendarLengthId(certificate),
      localExceptionCounty: await getLocalExceptionCounties(dataClient, cipCode),
      deliveryTypes: await credentialEngineUtils.hasLearningDeliveryTypes(certificate),
      providerId: provider?.providerId || null,
      providerName: provider?.name || "Provider not available",
      availableAt: await credentialEngineUtils.getAvailableAtAddresses(certificate),
      inDemand: isInDemand,
      highlight: highlight,
      socCodes: socCodes,
      hasEveningCourses: await credentialEngineUtils.hasEveningSchedule(certificate),
      languages: await credentialEngineUtils.getLanguages(certificate),
      isWheelchairAccessible: getWheelchairAccessibility,
      hasJobPlacementAssistance: getJobPlacementAssistance,
      hasChildcareAssistance: getChildcareAssistance,
      totalClockHours: null,
    };

    return result;
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
