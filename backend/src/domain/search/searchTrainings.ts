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
import zipcodes, { ZipCode } from "zipcodes";
import { convertZipCodeToCounty } from "../utils/convertZipCodeToCounty";
import { DeliveryType } from "../DeliveryType";
import { normalizeCipCode } from "../utils/normalizeCipCode";
import { normalizeSocCode } from "../utils/normalizeSocCode";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { Provider } from "../training/Training";

// ─── Initialize cache ───────────────────────────────────────────────
interface CachedResults {
  results: TrainingResult[];
  totalResults: number;
  isFull: boolean;
}

const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

// We'll use a separate cache key for a "fast" (partial) fetch for page 1.
const fastCacheKeyPrefix = "fastSearchResults-";

const STOP_WORDS = new Set(["of", "the", "and", "in", "for", "at", "on", "it", "institute"]);

const tokenize = (text: string): string[] =>
  text
    .replace(/[^a-zA-Z0-9- ]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word.toLowerCase()));

const levenshteinDistance = (a: string, b: string): number => {
  const dp = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
};

const fuzzyMatch = (word1: string, word2: string): boolean =>
  word1.length > 4 && word2.length > 4 && levenshteinDistance(word1, word2) <= 1;

const COMMON_WORDS = new Set([
  "systems",
  "technology",
  "training",
  "certificate",
  "certification",
  "degree",
  "education",
  "course",
  "program",
  "school",
  "college",
  "academy"
]);

/**
 * Ranks search results based on query relevance.
 */
const rankResults = (query: string, results: TrainingResult[], minScore = 500): TrainingResult[] => {
  if (!query || results.length === 0) return [];
  console.log(`🔍 Ranking ${results.length} results for query: "${query}"`);
  const queryTokens = new Set(tokenize(query.toLowerCase()));
  const queryPhrase = queryTokens.size > 1 ? [...queryTokens].join(" ") : null;
  return results
    .map((training) => {
      if (!training.name) return { ...training, rank: 0 };
      const trainingName = training.name.trim().toLowerCase();
      const trainingDesc = (training.description || "").trim().toLowerCase();
      const providerName = (training.providerName || "").trim().toLowerCase();
      const trainingLocation = training.availableAt
        ?.map(a => a.city?.trim()?.toLowerCase() || "")
        .filter(Boolean) || [];
      const cipTitle = (training.cipDefinition?.ciptitle || "").trim().toLowerCase();
      const nameTokens = new Set(tokenize(trainingName));
      const descTokens = new Set(tokenize(trainingDesc));
      const providerTokens = new Set(tokenize(providerName));
      const cipTokens = new Set(tokenize(cipTitle));
      const allTokensArray = [...nameTokens, ...descTokens, ...providerTokens, ...cipTokens];
      let score = 0;
      let strongMatch = false;
      if (query === providerName) {
        score += 15000;
        strongMatch = true;
      }
      if (query === trainingName || cipTitle) {
        score += 2000;
        strongMatch = true;
      }
      if (queryPhrase && allTokensArray.join(" ").includes(queryPhrase)) {
        score += 1000;
        strongMatch = true;
      }
      queryTokens.forEach((token) => {
        if (COMMON_WORDS.has(token)) return;
        if (nameTokens.has(token)) {
          score += 150;
          strongMatch = true;
        } else if (providerTokens.has(token)) {
          score += 100;
          strongMatch = true;
        } else if (descTokens.has(token)) {
          score += 50;
        }
      });
      trainingLocation.forEach((city) => {
        if (queryTokens.has(city)) {
          score += 1500;
          strongMatch = true;
        }
      });
      queryTokens.forEach((queryToken) => {
        allTokensArray.forEach((textToken) => {
          if (!textToken.includes(queryToken) && fuzzyMatch(queryToken, textToken)) {
            score += 50;
          }
        });
      });
      console.log(`🔹 Final Score for "${training.name}": ${score}`);
      if (!strongMatch || score < minScore) {
        console.log(`❌ Discarding "${training.name}" (score: ${score})`);
        return { ...training, rank: 0 };
      }
      return { ...training, rank: score };
    })
    .filter((r) => r.rank > 0)
    .sort((a, b) => b.rank - a.rank);
};

/**
 * Fetch a single page from the Credential Engine API.
 */
const searchLearningOpportunities = async (query: object, offset = 0, limit = 10): Promise<{ learningOpportunities: CTDLResource[]; totalResults: number }> => {
  try {
    const response = await credentialEngineAPI.getResults(query, offset, limit);
    return {
      learningOpportunities: response.data.data || [],
      totalResults: response.data.extra.TotalResults || 0,
    };
  } catch (error) {
    console.error(`Error fetching records (offset: ${offset}, limit: ${limit}):`, error);
    return { learningOpportunities: [], totalResults: 0 };
  }
};

/**
 * Fetch all learning opportunities in batches.
 */
const searchLearningOpportunitiesInBatches = async (query: object, batchSize = 25) => {
  const learningOpportunities: CTDLResource[] = [];
  const initialResponse = await searchLearningOpportunities(query, 0, batchSize);
  const totalResults = initialResponse.totalResults;
  learningOpportunities.push(...initialResponse.learningOpportunities);
  const offsets = [];
  for (let offset = batchSize; offset < totalResults; offset += batchSize) {
    offsets.push(offset);
  }
  const concurrencyLimit = 5;
  for (let i = 0; i < offsets.length; i += concurrencyLimit) {
    const batchOffsets = offsets.slice(i, i + concurrencyLimit);
    const results = await Promise.all(
      batchOffsets.map(offset => searchLearningOpportunities(query, offset, batchSize))
    );
    results.forEach(res => learningOpportunities.push(...res.learningOpportunities));
  }
  return { learningOpportunities, totalResults };
};

/**
 * Filters training results based on parameters.
 */
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
): Promise<TrainingResult[]> => {
  let filteredResults = results;
  if (cip_code) {
    const normalizedCip = normalizeCipCode(cip_code);
    filteredResults = filteredResults.filter(
      (result) => normalizeCipCode(result.cipDefinition?.cipcode || "") === normalizedCip
    );
  }
  if (soc_code) {
    const normalizedSoc = normalizeSocCode(soc_code);
    filteredResults = filteredResults.filter(
      (result) =>
        result.socCodes?.some((soc) => normalizeSocCode(soc) === normalizedSoc)
    );
  }
  if (in_demand) {
    filteredResults = filteredResults.filter(result => !!result.inDemand);
  }
  if (complete_in && complete_in.length > 0) {
    filteredResults = filteredResults.filter((result) =>
      complete_in.includes(result.calendarLength as number)
    );
  }
  if (max_cost && max_cost > 0) {
    filteredResults = filteredResults.filter(
      (result) =>
        result.totalCost != null &&
        result.totalCost <= max_cost
    );
  }
  if (format && format.length > 0) {
    const deliveryTypeMapping: Record<string, DeliveryType> = {
      "inperson": DeliveryType.InPerson,
      "online": DeliveryType.OnlineOnly,
      "blended": DeliveryType.BlendedDelivery,
    };
    const mappedClassFormats = format
      .map((f) => deliveryTypeMapping[f.toLowerCase() as keyof typeof deliveryTypeMapping])
      .filter(Boolean);
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
      return languages.every(language => result.languages?.includes(language));
    });
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
      }));
      return serviceChecks.every(Boolean) ? result : null;
    }))).filter(result => result !== null);
  }
  return filteredResults;
};

const paginateRecords = (trainingResults: TrainingResult[], page: number, limit: number) => {
  const totalResults = trainingResults.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / limit));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  console.log(`📌 Paginating ${totalResults} results (Page: ${currentPage} / ${totalPages}, Limit: ${limit})`);
  return {
    results: trainingResults.slice(start, end),
    totalPages,
    totalResults,
    currentPage
  };
};

/**
 * Sorts training results.
 */
export const sortTrainings = (trainings: TrainingResult[], sort: string): TrainingResult[] => {
  switch (sort) {
    case "asc":
      console.log("Before sorting (asc):", trainings.map(t => t.name));
      return trainings.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    case "desc":
      console.log("Before sorting (desc):", trainings.map(t => t.name));
      return trainings.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    case "price_asc":
      return trainings.sort((a, b) => (a.totalCost || 0) - (b.totalCost || 0));
    case "price_desc":
      return trainings.sort((a, b) => (b.totalCost || 0) - (a.totalCost || 0));
    case "EMPLOYMENT_RATE":
      console.log("Before sorting by employment rate:", trainings.map(t => t.percentEmployed));
      return trainings.sort((a, b) => (b.percentEmployed ?? -Infinity) - (a.percentEmployed ?? -Infinity));
    case "best_match":
    default:
      return trainings;
  }
};

/**
 * Normalizes query parameters for caching.
 */
function normalizeQueryParams(params: {
  searchQuery?: string;
  cip_code?: string;
  soc_code?: string;
  county?: string;
  zipcode?: string;
  in_demand?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  filters?: { key: string; value: string }[];
}) {
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
    filters: params.filters
      ? [...params.filters].sort((a, b) => a.key.localeCompare(b.key))
      : undefined,
  };
}

/**
 * Factory: Returns the search function.
 *
 * - For page 1: If no full dataset is cached, do a fast partial fetch (first page only)
 *   and trigger a background full fetch (which will invalidate the final-sorted cache).
 * - For pages > 1: Wait for (or fetch) the full dataset.
 * Then build a final cache key (excluding pagination) for filtering & sorting.
 */
export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (params: {
    searchQuery: string;
    page?: number;
    limit?: number;
    sort?: string;
    cip_code?: string;
    soc_code?: string;
    format?: string[];
    complete_in?: number[];
    county?: string;
    in_demand?: boolean;
    languages?: string[];
    max_cost?: number;
    miles?: number;
    services?: string[];
    zipcode?: string;
  }): Promise<TrainingData & { isFull: boolean }> => {
    const overallStart = performance.now();
    console.time("TotalSearchTime");
    const { page = 1, limit = 10, sort = "best_match" } = params;
    console.log(`Received search request for query: "${params.searchQuery}" on page: ${page}`);
    const query = buildQuery(params);
    const normalizedParams = normalizeQueryParams(params);
    // Exclude pagination from our full-data cache key.
    const { page: _, limit: __, ...cacheParams } = normalizedParams;
    const fullCacheKey = `fullSearchResults-${JSON.stringify(cacheParams)}`;
    // Also build a separate cache key for a fast (partial) fetch of page 1.
    const fastCacheKey = fastCacheKeyPrefix + JSON.stringify(cacheParams);

    let cachedData: CachedResults | undefined = cache.get(fullCacheKey);

    if (!cachedData) {
      if (page === 1) {
        // Fast partial fetch for page 1
        console.log(`🚀 Fast fetch triggered for query: "${normalizedParams.searchTerm}" on page 1`);
        const partialResponse = await searchLearningOpportunities(query, 0, limit);
        const partialTransformed = await Promise.all(
          partialResponse.learningOpportunities.map(lo =>
            transformLearningOpportunityCTDLToTrainingResult(dataClient, lo, params.searchQuery)
          )
        );
        // Cache fast (partial) data separately.
        cache.set(fastCacheKey, {
          results: partialTransformed,
          totalResults: partialResponse.totalResults,
          isFull: false
        }, 300);
        cachedData = {
          results: partialTransformed,
          totalResults: partialResponse.totalResults,
          isFull: false
        };
        // Trigger background full fetch.
        (async () => {
          try {
            const fullResponse = await searchLearningOpportunitiesInBatches(query);
            const fullTransformed = await Promise.all(
              fullResponse.learningOpportunities.map(lo =>
                transformLearningOpportunityCTDLToTrainingResult(dataClient, lo, params.searchQuery)
              )
            );
            const fullData: CachedResults = {
              results: fullTransformed,
              totalResults: fullResponse.totalResults,
              isFull: true
            };
            cache.set(fullCacheKey, fullData, 300);
            console.log("Background full fetch completed and cache updated with full data.");
            // Invalidate the final sorted cache so that subsequent requests use full data.
            const finalCacheKey = `${fullCacheKey}-final-${JSON.stringify({
              sort,
              cip_code: params.cip_code,
              soc_code: params.soc_code,
              county: params.county,
              zipcode: params.zipcode,
              in_demand: params.in_demand,
              format: params.format,
              complete_in: params.complete_in,
              miles: params.miles,
              languages: params.languages,
              services: params.services,
            })}`;
            cache.del(finalCacheKey);
            // Also update the fast cache so future page 1 requests use full data.
            cache.set(fastCacheKey, fullData, 300);
          } catch (error) {
            console.error("Background full fetch failed:", error);
          }
        })();
      } else {
        // For pages > 1, perform a full fetch.
        console.log(`🚀 Full fetch triggered for query: "${normalizedParams.searchTerm}" on page ${page}`);
        const fullResponse = await searchLearningOpportunitiesInBatches(query);
        const fullTransformed = await Promise.all(
          fullResponse.learningOpportunities.map(lo =>
            transformLearningOpportunityCTDLToTrainingResult(dataClient, lo, params.searchQuery)
          )
        );
        cachedData = {
          results: fullTransformed,
          totalResults: fullResponse.totalResults,
          isFull: true
        };
        cache.set(fullCacheKey, cachedData, 300);
      }
    } else {
      console.log(`✅ Cache hit for full results for query: "${normalizedParams.searchTerm}"`);
    }

    // Build final sorted results cache key (excluding pagination).
    const finalCacheKey = `${fullCacheKey}-final-${JSON.stringify({
      sort,
      cip_code: params.cip_code,
      soc_code: params.soc_code,
      county: params.county,
      zipcode: params.zipcode,
      in_demand: params.in_demand,
      format: params.format,
      complete_in: params.complete_in,
      miles: params.miles,
      languages: params.languages,
      services: params.services,
    })}`;
    let finalResults = cache.get<TrainingResult[]>(finalCacheKey);
    if (!finalResults) {
      console.log("Computing final results with filtering, ranking and sorting...");
      const filterStart = performance.now();
      const filteredResults = await filterRecords(
        cachedData.results,
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
      console.log(`⚡ Filtering took ${performance.now() - filterStart} ms`);

      const rankStart = performance.now();
      const rankedResults = rankResults(params.searchQuery, filteredResults);
      console.log(`📈 Ranking took ${performance.now() - rankStart} ms`);

      finalResults = sortTrainings(rankedResults, sort);
      cache.set(finalCacheKey, finalResults, 300);
    } else {
      console.log("Final sorted results found in cache.");
    }

    // When using partial (fast) data, use totalResults from that API call;
    // otherwise, use the length of the full finalResults.
    const totalItems = cachedData.isFull ? finalResults.length : cachedData.totalResults;
    const { results: paginatedResults, totalPages } = paginateRecords(finalResults, page, limit);

    console.timeEnd("TotalSearchTime");
    if (page === 1) {
      console.log(`⏱ Time to first page of results: ${performance.now() - overallStart} ms`);
    }
    console.log(`🚀 Overall search execution took ${performance.now() - overallStart} ms`);

    return {
      ...packageResults(page, limit, paginatedResults, totalItems, totalPages),
      isFull: cachedData.isFull,
    };
  };
};

//
// --- Helper types and functions for building the query and transforming results ---
//

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
    "ceterms:occupationType": isSOC
      ? {
        "ceterms:codedNotation": {
          "search:value": params.searchQuery,
          "search:matchType": "search:startsWith"
        }
      }
      : undefined,
    "ceterms:instructionalProgramType": isCIP
      ? {
        "ceterms:codedNotation": {
          "search:value": params.searchQuery,
          "search:matchType": "search:startsWith"
        }
      }
      : undefined
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

const transformResults = async (
  learningOpportunities: CTDLResource[],
  dataClient: DataClient,
  searchQuery: string
): Promise<TrainingResult[]> => {
  return Promise.all(
    learningOpportunities.map(async (lo) =>
      transformLearningOpportunityCTDLToTrainingResult(dataClient, lo, searchQuery)
    )
  );
};

async function transformLearningOpportunityCTDLToTrainingResult(
  dataClient: DataClient,
  learningOpportunity: CTDLResource,
  searchQuery: string
): Promise<TrainingResult> {
  try {
    const desc = learningOpportunity["ceterms:description"]?.["en-US"] || "";
    const highlightPromise = getHighlight(desc, searchQuery);
    const providerPromise = credentialEngineUtils.getProviderData(learningOpportunity);
    const cipCodePromise = credentialEngineUtils.extractCipCode(learningOpportunity);
    const occupationsPromise = credentialEngineUtils.extractOccupations(learningOpportunity);
    const costPromise = credentialEngineUtils.extractCost(learningOpportunity, "costType:AggregateCost");
    const calendarLengthPromise = credentialEngineUtils.getCalendarLengthId(learningOpportunity);
    const deliveryTypesPromise = credentialEngineUtils.hasLearningDeliveryTypes(learningOpportunity);
    const availableAtPromise = credentialEngineUtils.getAvailableAtAddresses(learningOpportunity);
    const eveningCoursesPromise = credentialEngineUtils.hasEveningSchedule(learningOpportunity);
    const languagesPromise = credentialEngineUtils.getLanguages(learningOpportunity);

    const [
      highlight,
      provider,
      cipCode,
      occupations,
      totalCost,
      calendarLength,
      deliveryTypes,
      availableAt,
      hasEveningCourses,
      languages
    ] = await Promise.all([
      highlightPromise,
      providerPromise,
      cipCodePromise,
      occupationsPromise,
      costPromise,
      calendarLengthPromise,
      deliveryTypesPromise,
      availableAtPromise,
      eveningCoursesPromise,
      languagesPromise
    ]);

    const cipDefinitionPromise = cipCode ? dataClient.findCipDefinitionByCip(cipCode) : Promise.resolve(null);
    const outcomeDefinitionPromise = provider?.providerId
      ? dataClient.findOutcomeDefinition(provider.providerId, cipCode)
      : Promise.resolve(null);
    const inDemandCIPsPromise = dataClient.getCIPsInDemand();

    const [cipDefinition, outcomeDefinition, inDemandCIPs] = await Promise.all([
      cipDefinitionPromise,
      outcomeDefinitionPromise,
      inDemandCIPsPromise
    ]);

    const socCodes = occupations.map((occupation) => occupation.soc);
    const isInDemand = inDemandCIPs.some((c) => c.cipcode === cipCode);

    const isWheelchairAccessible = () => credentialEngineUtils.checkAccommodation(learningOpportunity, "accommodation:PhysicalAccessibility");
    const hasJobPlacementAssistance = () => credentialEngineUtils.checkSupportService(learningOpportunity, "support:JobPlacement");
    const hasChildcareAssistance = () => credentialEngineUtils.checkSupportService(learningOpportunity, "support:Childcare");

    return {
      ctid: learningOpportunity["ceterms:ctid"] || "",
      name: learningOpportunity["ceterms:name"]?.["en-US"] || "",
      description: desc,
      cipDefinition: cipDefinition ? cipDefinition[0] : null,
      totalCost,
      percentEmployed: outcomeDefinition ? formatPercentEmployed(outcomeDefinition.peremployed2) : null,
      calendarLength,
      localExceptionCounty: await getLocalExceptionCounties(dataClient, cipCode),
      deliveryTypes,
      providerId: provider?.providerId || null,
      providerName: provider?.name || "Provider not available",
      availableAt,
      inDemand: isInDemand,
      highlight,
      socCodes,
      hasEveningCourses,
      languages,
      isWheelchairAccessible,
      hasJobPlacementAssistance,
      hasChildcareAssistance,
      totalClockHours: null,
    };
  } catch (error) {
    console.error("Error transforming learning opportunity CTDL to TrainingResult object:", error);
    throw error;
  }
}

const NAN_INDICATOR = "-99999";

const formatPercentEmployed = (perEmployed: string | null): number | null => {
  if (perEmployed === null || perEmployed === NAN_INDICATOR) {
    return null;
  }
  return parseFloat(perEmployed);
};

function packageResults(
  currentPage: number,
  limit: number,
  results: TrainingResult[],
  totalResults: number,
  totalPages: number
): TrainingData {
  return {
    data: results,
    meta: {
      currentPage,
      totalPages,
      totalItems: totalResults,
      itemsPerPage: limit,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      previousPage: currentPage > 1 ? currentPage - 1 : null,
    },
  };
}
