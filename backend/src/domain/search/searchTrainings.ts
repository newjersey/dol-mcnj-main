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
import {Provider} from "../training/Training";
import Redis from "ioredis";

// ─── Initialize cache ─────────────────────────────────────────────────────────
interface CachedResults {
  results: TrainingResult[];
  totalResults: number;
}

// Initialize Redis client
const redis = new Redis({
  host: '127.0.0.1',  // Local Redis server
  port: 6379,         // Default Redis port
});


const STOP_WORDS = new Set(["of", "the", "and", "in", "for", "at", "on", "it", "institute"]);

const tokenize = (text: string): string[] => {
  return text
    .replace(/[^a-zA-Z0-9- ]/g, "") // Keep letters, numbers, hyphens, and spaces
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word.toLowerCase()));
};

const levenshteinDistance = (a: string, b: string): number => {
  const dp = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[a.length][b.length];
};

const fuzzyMatch = (word1: string, word2: string): boolean => {
  return word1.length > 4 && word2.length > 4 && levenshteinDistance(word1, word2) <= 1;
};

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
 * Ranks search results based on query relevance using multiple criteria.
 */
const rankResults = (query: string, results: TrainingResult[], minScore = 500): TrainingResult[] => {
  if (!query || results.length === 0) return [];
  console.log(`🔍 Ranking ${results.length} results for query: "${query}"`);
  const queryTokens = new Set(tokenize(query.toLowerCase()));
  const queryPhrase = queryTokens.size > 1 ? [...queryTokens].join(" ") : null;
  const uniqueResults = Array.from(new Map(results.map(item => [item.ctid, item])).values());
  return uniqueResults
    .map((training) => {
      if (!training.name) return { ...training, rank: 0 };
      const trainingName = training.name.trim().toLowerCase();
      const trainingDesc = (training.description || "").trim().toLowerCase();
      const providerName = (training.providerName || "").trim().toLowerCase();
      const trainingLocation = training.availableAt?.map(a => a.city?.trim()?.toLowerCase() || "").filter(Boolean) || [];
      const cipTitle = (training.cipDefinition?.ciptitle || "").trim().toLowerCase();
      const nameTokens = new Set(tokenize(trainingName));
      const descTokens = new Set(tokenize(trainingDesc));
      const providerTokens = new Set(tokenize(providerName));
      const cipTokens = new Set(tokenize(cipTitle));
      const allTokensArray = [...nameTokens, ...descTokens, ...providerTokens, ...cipTokens];
      let score = 0;
      let strongMatch = false;
      console.log(`\n🔹 Evaluating: ${training.name} (${training.ctid})`);
      if (query === providerName) {
        score += 15000;
        strongMatch = true;
        console.log(`🎯 Exact Provider Match: ${providerName} +15000`);
      }
      if (query === trainingName || cipTitle) {
        score += 2000;
        strongMatch = true;
        console.log(`🎯 Exact Training Name or CIP Match: ${trainingName} / ${cipTitle} +2000`);
      }
      if (queryPhrase && allTokensArray.join(" ").includes(queryPhrase)) {
        score += 1000;
        strongMatch = true;
        console.log(`✅ Exact Phrase Match: "${queryPhrase}" +1000`);
      }
      queryTokens.forEach((token) => {
        if (COMMON_WORDS.has(token)) {
          console.log(`⚠️ Skipping common word: "${token}"`);
          return;
        }
        if (nameTokens.has(token)) {
          score += 150;
          strongMatch = true;
          console.log(`✅ Name Match: "${token}" +150`);
        } else if (providerTokens.has(token)) {
          score += 100;
          strongMatch = true;
          console.log(`✅ Provider Match: "${token}" +100`);
        } else if (descTokens.has(token)) {
          score += 50;
          console.log(`✅ Description Match: "${token}" +50`);
        }
      });
      trainingLocation.forEach((city) => {
        if (queryTokens.has(city)) {
          score += 1500;
          strongMatch = true;
          console.log(`📍 City Match: "${city}" +1500`);
        }
      });
      queryTokens.forEach((queryToken) => {
        allTokensArray.forEach((textToken) => {
          if (!textToken.includes(queryToken) && fuzzyMatch(queryToken, textToken)) {
            score += 50;
            console.log(`🔍 Fuzzy Match: "${queryToken}" ~ "${textToken}" +50`);
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
 * Fetch a single batch of learning opportunities from the Credential Engine API.
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
// Fetch all learning opportunities in batches with pagination
const searchLearningOpportunitiesInBatches = async (query: object, page = 1, batchSize = 25) => {
  const cacheKey = `learningOpportunities-${JSON.stringify(query)}-page-${page}`;

  // Try to get from cache first
  const cachedOpportunities = await redis.get(cacheKey);

  if (cachedOpportunities) {
    console.log(`✅ Cache hit for query: "${JSON.stringify(query)}" (page: ${page})`);
    return JSON.parse(cachedOpportunities);
  }

  const learningOpportunities: CTDLResource[] = [];
  let totalResults = 0;
  let currentPage = page;

  // Fetch data in batches and aggregate them
  while (true) {
    const offset = (currentPage - 1) * batchSize;

    // Fetch current batch
    const { learningOpportunities: currentBatch, totalResults: fetchedTotalResults } = await searchLearningOpportunities(query, offset, batchSize);

    // Handle 503 errors and filter out results with "Provider not available"
    if (!currentBatch.length || fetchedTotalResults === 0) {
      console.error(`❌ Error fetching records for query: "${JSON.stringify(query)}" (offset: ${offset})`);
      break;
    }

    // Filter out "Provider not available" items
    const validBatch = currentBatch.filter((opportunity: CTDLResource) => {
      // Ensure ownedBy is an array and check if it contains "Provider not available"
      return !(opportunity["ceterms:ownedBy"]?.includes("Provider not available"));
    });

    learningOpportunities.push(...validBatch);
    totalResults = fetchedTotalResults;

    // If we've fetched all available results, break the loop
    if (learningOpportunities.length >= totalResults) {
      break;
    }

    // Otherwise, fetch the next batch
    currentPage++;
  }

  // If no valid data, do not cache
  if (learningOpportunities.length === 0) {
    console.log("❌ No valid data to cache (likely due to 503 or 'Provider not available')");
    return { learningOpportunities, totalResults };
  }

  // Cache the results for the current page
  await redis.set(cacheKey, JSON.stringify({ learningOpportunities, totalResults }), 'EX', 900); // Cache for 15 minutes
  console.log(`✅ Caching ${learningOpportunities.length} valid results`);

  return { learningOpportunities, totalResults };
};


/**
 * Filters training results based on various parameters.
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
        result.totalCost !== null &&
        result.totalCost !== undefined &&
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

  // Ensure current page is within valid range
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * limit;
  const end = start + limit;

  console.log(`📌 Paginating ${totalResults} results (Page: ${currentPage} / ${totalPages}, Limit: ${limit})`);

  return {
    results: trainingResults.slice(start, end), // ✅ Return correctly paginated results
    totalPages,
    totalResults,
    currentPage
  };
}



/**
 * Sorts training results based on the specified criteria.
 */
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

/**
 * Normalizes query parameters for caching consistency.
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
  }): Promise<TrainingData> => {
    const overallStart = performance.now();
    const { page = 1, limit = 10, sort = "best_match" } = params;
    const query = buildQuery(params);
    const normalizedParams = normalizeQueryParams(params);
    const cacheKey = `searchResults-${JSON.stringify(normalizedParams)}`;
    console.time("TotalSearchTime");

    // First, define the cache type explicitly for `cachedData`
    let cachedData: CachedResults | null = null;

    // Attempt to get cached data from Redis (which will be a string)
    const cachedOpportunities = await redis.get(cacheKey);

    // If cache miss, fetch data from the API and store it in Redis
    if (!cachedOpportunities) {
      console.log(`🚀 Cache miss: Fetching new results for query: "${normalizedParams.searchTerm}"`);

      // Fetch the data from the API
      const fetchStart = performance.now();
      const { learningOpportunities, totalResults } = await searchLearningOpportunitiesInBatches(query);
      console.log(`📊 API fetch took ${performance.now() - fetchStart} ms`);

      // Transform the results
      const transformStart = performance.now();
      const results = await Promise.all(
        learningOpportunities.map((lo: CTDLResource) =>
          transformLearningOpportunityCTDLToTrainingResult(dataClient, lo, params.searchQuery)
        )
      );
      console.log(`🔄 Transformation took ${performance.now() - transformStart} ms`);

      // Store the results in Redis cache as a string (JSON stringified)
      cachedData = { results, totalResults };
      await redis.set(cacheKey, JSON.stringify(cachedData), 'EX', 900); // Cache for 15 minutes
    } else {
      console.log(`✅ Cache hit for query: "${normalizedParams.searchTerm}"`);

      // Try to parse the cached string into a `CachedResults` object
      try {
        cachedData = JSON.parse(cachedOpportunities) as CachedResults;
      } catch (error) {
        console.error("Error parsing cached data", error);
        // In case of parsing failure, we reset `cachedData` to a default value
        cachedData = { results: [], totalResults: 0 };
      }
    }

    // Ensure `cachedData` is correctly handled
    if (!cachedData) {
      // If no data or failed to fetch from the cache, reset
      cachedData = { results: [], totalResults: 0 };
    }

    // Apply filtering, sorting, and pagination as usual
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

    const rankStart = performance.now();
    const rankedResults = rankResults(params.searchQuery, filteredResults);
    console.log(`📈 Ranking took ${performance.now() - rankStart} ms`);

    // Apply sorting
    const sortedResults = sortTrainings(rankedResults, sort);

    // Apply pagination
    const { results: paginatedResults, totalPages, totalResults, currentPage } = paginateRecords(sortedResults, page, limit);

    console.timeEnd("TotalSearchTime");
    console.log(`🚀 Overall search execution took ${performance.now() - overallStart} ms`);

    return packageResults(currentPage, limit, paginatedResults, totalResults, totalPages);

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
        { "search:value": params.searchQuery, "search:matchType": "search:contains" },
      ],
      "ceterms:description": [
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
        "search:matchType": "search:contains"
      }
    } : undefined,
    "ceterms:instructionalProgramType": isCIP ?
      { "ceterms:codedNotation": {
          "search:value": params.searchQuery,
          "search:matchType": "search:contains"
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

const transformResults = async (
  learningOpportunities: CTDLResource[],
  dataClient: DataClient,
  searchQuery: string
): Promise<TrainingResult[]> => {
  return Promise.all(
    learningOpportunities.map(async (lo) => {
      return transformLearningOpportunityCTDLToTrainingResult(dataClient, lo, searchQuery);
    })
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

    // Fetch independent promises in parallel
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
    const outcomeDefinitionPromise = provider?.providerId ? dataClient.findOutcomeDefinition(provider.providerId, cipCode) : Promise.resolve(null);
    const inDemandCIPsPromise = dataClient.getCIPsInDemand();

    // Fetch dependent values in parallel
    const [cipDefinition, outcomeDefinition, inDemandCIPs] = await Promise.all([
      cipDefinitionPromise,
      outcomeDefinitionPromise,
      inDemandCIPsPromise
    ]);

    const socCodes = occupations.map((occupation) => occupation.soc);
    const isInDemand = inDemandCIPs.some((c) => c.cipcode === cipCode);

    // Define async functions but don't await them yet
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
      isWheelchairAccessible, // Do not await, return as function
      hasJobPlacementAssistance, // Do not await, return as function
      hasChildcareAssistance, // Do not await, return as function
      totalClockHours: null,
    };
  } catch (error) {
    console.error("Error transforming learning opportunity CTDL to TrainingResult object:", error);
    throw error;
  }
}


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


const NAN_INDICATOR = "-99999";

const formatPercentEmployed = (perEmployed: string | null): number | null => {
  if (perEmployed === null || perEmployed === NAN_INDICATOR) {
    return null;
  }
  return parseFloat(perEmployed);
};
