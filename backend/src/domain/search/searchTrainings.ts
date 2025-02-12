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

// Initialize a simple in-memory cache to store results temporarily.
// TTL (Time-to-Live) is set to 900 seconds, and the cache is checked every 120 seconds.
const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });
const STOP_WORDS = new Set(["of", "the", "and", "in", "for", "at", "on", "it", "institute"]);

const tokenize = (text: string): string[] => {
  return text
    .replace(/[^a-zA-Z0-9- ]/g, "")  // Keep letters, numbers, hyphens, and spaces
    .split(/\s+/)  // Split by spaces
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word.toLowerCase()));  // Remove short words & stop words
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
  "systems", "technology", "training", "certificate", "certification",
  "degree", "education", "course", "program", "school", "college", "academy"
]);

/**
 * Ranks search results based on query relevance using multiple criteria.
 *
 * **Scoring Breakdown:**
 * - **Exact Match Boosts**
 *   - Full match with provider name: `+15000`
 *   - Full match with training name or CIP title: `+2000`
 *   - Exact multi-word phrase match: `+1000`
 *
 * - **Token-Based Boosts**
 *   - Individual query tokens found in the training name: `+150`
 *   - Individual query tokens found in the provider name: `+100`
 *   - Individual query tokens found in the description: `+50`
 *
 * @param {string} query - The user's search query.
 * @param {TrainingResult[]} results - The list of training results to rank.
 * @param {number} [minScore=500] - The minimum score threshold for inclusion.
 * @returns {TrainingResult[]} - Ranked and filtered results.
 */
const rankResults = (query: string, results: TrainingResult[], minScore = 500): TrainingResult[] => {
  if (!query || results.length === 0) return [];

  console.log(`🔍 Ranking ${results.length} results for query: "${query}"`);

  const queryTokens = new Set(tokenize(query.toLowerCase()));
  const queryPhrase = queryTokens.size > 1 ? [...queryTokens].join(" ") : null;

  // ✅ Deduplicate results by `ctid`
  const uniqueResults = Array.from(new Map(results.map(item => [item.ctid, item])).values());

  return uniqueResults
    .map((training) => {
      if (!training.name) return { ...training, rank: 0 };

      // ✅ Normalize text fields
      const trainingName = training.name.trim().toLowerCase();
      const trainingDesc = (training.description || "").trim().toLowerCase();
      const providerName = (training.providerName || "").trim().toLowerCase();
      const trainingLocation = training.availableAt?.map(a => a.city?.trim()?.toLowerCase() || "").filter(Boolean) || [];
      const cipTitle = (training.cipDefinition?.ciptitle || "").trim().toLowerCase();

      // ✅ Precompute token sets for efficiency
      const nameTokens = new Set(tokenize(trainingName));
      const descTokens = new Set(tokenize(trainingDesc));
      const providerTokens = new Set(tokenize(providerName));
      const cipTokens = new Set(tokenize(cipTitle));
      const allTokensArray = [...nameTokens, ...descTokens, ...providerTokens, ...cipTokens]; // Convert set to array

      let score = 0;
      let strongMatch = false; // 🚨 Track whether this result is strongly relevant

      console.log(`\n🔹 Evaluating: ${training.name} (${training.ctid})`);

      // 🎯 **Exact Matches (High Weight)**
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

      // 🔥 **Token-Based Matching (Weighted)**
      queryTokens.forEach((token) => {
        if (COMMON_WORDS.has(token)) {
          console.log(`⚠️ Skipping common word: "${token}"`);
          return; // 🚨 Ignore common words
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

      // 📍 **Boost if location is mentioned**
      trainingLocation.forEach((city) => {
        if (queryTokens.has(city)) {
          score += 1500;
          strongMatch = true;
          console.log(`📍 City Match: "${city}" +1500`);
        }
      });

      // 🔍 **Optimized Fuzzy Matching**
      queryTokens.forEach((queryToken) => {
        allTokensArray.forEach((textToken) => {
          if (!textToken.includes(queryToken) && fuzzyMatch(queryToken, textToken)) {
            score += 50;
            console.log(`🔍 Fuzzy Match: "${queryToken}" ~ "${textToken}" +50`);
          }
        });
      });

      console.log(`🔹 Final Score for "${training.name}": ${score}`);

      // ❌ **Reject weak matches**
      if (!strongMatch || score < minScore) {
        console.log(`❌ Discarding "${training.name}" (score: ${score})`);
        return { ...training, rank: 0 }; // Mark as irrelevant
      }

      return { ...training, rank: score };
    })
    .filter((r) => r.rank > 0) // ✅ NEW: Discard weak results
    .sort((a, b) => b.rank - a.rank); // ✅ Sort by highest rank
};


/**
 * Fetch a single batch of learning opportunities from the Credential Engine API.
 * @param {object} query - The search query object.
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The maximum number of results to fetch in this batch.
 * @returns {Promise<{ learningOpportunities: CTDLResource[], totalResults: number }>}
 */
const searchLearningOpportunities = async (query: object, offset = 0, limit = 10): Promise<{ learningOpportunities: CTDLResource[]; totalResults: number }> => {
  try {
    // console.log(`FETCHING RECORD with offset ${offset} and limit ${limit}`);
    const response = await credentialEngineAPI.getResults(query, offset, limit);
    return {
      learningOpportunities: response.data.data || [],
      totalResults: response.data.extra.TotalResults || 0,
    };
  } catch (error) {
    console.error(`Error fetching records (offset: ${offset}, limit: ${limit}):`, error);
    // Return an empty result set to allow processing to continue
    return { learningOpportunities: [], totalResults: 0 };
  }
};

/**
 * Fetch all learning opportunities in batches, using a concurrency limit to avoid API overload.
 * @param {object} query - The search query object.
 * @param {number} batchSize - The size of each batch to fetch.
 * @returns {Promise<{ learningOpportunities: CTDLResource[], totalResults: number }>}
 */
const searchLearningOpportunitiesInBatches = async (query: object, batchSize = 100) => {
  const learningOpportunities: CTDLResource[] = [];
  const initialResponse = await searchLearningOpportunities(query, 0, batchSize);
  const totalResults = initialResponse.totalResults;
  learningOpportunities.push(...initialResponse.learningOpportunities);

  // Fetch subsequent batches.
  const fetchBatch = async (offset: number) => {
    try {
      const response = await searchLearningOpportunities(query, offset, batchSize);
      return response.learningOpportunities;
    } catch (error) {
      console.error(`Error fetching batch at offset ${offset}:`, error);
      return [];
    }
  };

  const offsets = [];
  for (let offset = batchSize; offset < totalResults; offset += batchSize) {
    offsets.push(offset);
  }

  // Process batches concurrently, with a limit on the number of concurrent requests.
  const concurrencyLimit = 5;
  for (let i = 0; i < offsets.length; i += concurrencyLimit) {
    const batchOffsets = offsets.slice(i, i + concurrencyLimit);
    const results = await Promise.all(batchOffsets.map(fetchBatch));
    results.forEach((batch) => learningOpportunities.push(...batch));
  }

  return { learningOpportunities, totalResults };
};


/**
 * Filters training results based on various parameters.
 * @param {TrainingResult[]} results - The list of training results to filter.
 * @param {string} [cip_code] - Filter by CIP code.
 * @param {string} [soc_code] - Filter by SOC code.
 * @param {number[]} [complete_in] - Filter by completion time.
 * @param {boolean} [in_demand] - Filter by "in demand" status.
 * @param {number} [max_cost] - Filter by maximum cost.
 * @param {string} [county] - Filter by county.
 * @param {number} [miles] - Filter by distance in miles.
 * @param {string} [zipcode] - Filter by ZIP code.
 * @param {string[]} [format] - Filter by delivery format.
 * @param {string[]} [languages] - Filter by supported languages.
 * @param {string[]} [services] - Filter by available services.
 * @returns {Promise<TrainingResult[]>} - The filtered list of results.
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

  // Filter by CIP code.
  if (cip_code) {
    const normalizedCip = normalizeCipCode(cip_code);
    filteredResults = filteredResults.filter(
      (result) => normalizeCipCode(result.cipDefinition?.cipcode || '') === normalizedCip
    );
  }

  // Filter by SOC code.
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

const paginateRecords = (trainingResults: TrainingResult[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return trainingResults.slice(start, end);
};

/**
 * Sorts training results based on the specified criteria.
 * @param {TrainingResult[]} trainings - The list of training results.
 * @param {string} sort - The sorting criteria (e.g., "asc", "desc", "price_asc").
 * @returns {TrainingResult[]} - The sorted list of results.
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
 * @param {object} params - The query parameters.
 * @returns {object} - The normalized parameters.
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
      const { learningOpportunities } = await searchLearningOpportunitiesInBatches(query);

      unFilteredResults = await Promise.all(
        learningOpportunities.map((learningOpportunity) =>
          transformLearningOpportunityCTDLToTrainingResult(dataClient, learningOpportunity, params.searchQuery)
        )
      );

      // Cache the filtered results
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
    const rankedResults = rankResults(params.searchQuery, filteredResults);
    // console.log(rankedResults);
    const sortedResults = sortTrainings(rankedResults, sort);
    cache.set(unFilteredCacheKey, rankedResults, 300); // Cache for 5 minutes

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

async function transformLearningOpportunityCTDLToTrainingResult(
  dataClient: DataClient,
  learningOpportunity: CTDLResource,
  searchQuery: string
): Promise<TrainingResult> {
  try {
    const desc = learningOpportunity["ceterms:description"] ? learningOpportunity["ceterms:description"]["en-US"] : null;
    const highlight = desc ? await getHighlight(desc, searchQuery) : "";
    // Lazy load Credential Engine utilities when needed
    const { credentialEngineUtils } = await import("../../credentialengine/CredentialEngineUtils");
    const provider = await credentialEngineUtils.getProviderData(learningOpportunity);
    const cipCode = await credentialEngineUtils.extractCipCode(learningOpportunity);
    const cipDefinition = cipCode ? await dataClient.findCipDefinitionByCip(cipCode) : null;

    const occupations = await credentialEngineUtils.extractOccupations(learningOpportunity);
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
      await credentialEngineUtils.checkAccommodation(learningOpportunity, "accommodation:PhysicalAccessibility");

    const getJobPlacementAssistance = async () =>
      await credentialEngineUtils.checkSupportService(learningOpportunity, "support:JobPlacement");

    const getChildcareAssistance = async () =>
      await credentialEngineUtils.checkSupportService(learningOpportunity, "support:Childcare");

    const result: TrainingResult = {
      ctid: learningOpportunity["ceterms:ctid"] || "",
      name: learningOpportunity["ceterms:name"]?.["en-US"] || "",
      description: learningOpportunity["ceterms:description"]?.["en-US"] || "",
      cipDefinition: cipDefinition ? cipDefinition[0] : null,
      totalCost: await credentialEngineUtils.extractCost(learningOpportunity, "costType:AggregateCost"),
      percentEmployed: outcomesDefinition ? formatPercentEmployed(outcomesDefinition.peremployed2) : null,
      calendarLength: await credentialEngineUtils.getCalendarLengthId(learningOpportunity),
      localExceptionCounty: await getLocalExceptionCounties(dataClient, cipCode),
      deliveryTypes: await credentialEngineUtils.hasLearningDeliveryTypes(learningOpportunity),
      providerId: provider?.providerId || null,
      providerName: provider?.name || "Provider not available",
      availableAt: await credentialEngineUtils.getAvailableAtAddresses(learningOpportunity),
      inDemand: isInDemand,
      highlight: highlight,
      socCodes: socCodes,
      hasEveningCourses: await credentialEngineUtils.hasEveningSchedule(learningOpportunity),
      languages: await credentialEngineUtils.getLanguages(learningOpportunity),
      isWheelchairAccessible: getWheelchairAccessibility,
      hasJobPlacementAssistance: getJobPlacementAssistance,
      hasChildcareAssistance: getChildcareAssistance,
      totalClockHours: null,
    };
    // console.log(result);
    return result;
  } catch (error) {
    console.error("Error transforming learning opportunity CTDL to TrainingResult object:", error);
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
