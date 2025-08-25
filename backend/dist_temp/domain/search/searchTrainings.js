"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTrainingsFactory = exports.sortTrainings = void 0;
const tslib_1 = require("tslib");
const CredentialEngineAPI_1 = require("../../credentialengine/CredentialEngineAPI");
const getLocalExceptionCounties_1 = require("../utils/getLocalExceptionCounties");
const getHighlight_1 = require("../utils/getHighlight");
const zip_county_json_1 = tslib_1.__importDefault(require("../utils/zip-county.json"));
const zipcodes_1 = tslib_1.__importDefault(require("zipcodes"));
const convertZipCodeToCounty_1 = require("../utils/convertZipCodeToCounty");
const DeliveryType_1 = require("../DeliveryType");
const normalizeCipCode_1 = require("../utils/normalizeCipCode");
const normalizeSocCode_1 = require("../utils/normalizeSocCode");
const CredentialEngineUtils_1 = require("../../credentialengine/CredentialEngineUtils");
const redisClient_1 = tslib_1.__importDefault(require("../../infrastructure/redis/redisClient"));
const STOP_WORDS = new Set(["of", "the", "and", "in", "for", "at", "on", "it", "institute"]);
const tokenize = (text) => {
    return text
        .replace(/[^a-zA-Z0-9- ]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 1 && !STOP_WORDS.has(word.toLowerCase()));
};
const levenshteinDistance = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++)
        dp[i][0] = i;
    for (let j = 0; j <= b.length; j++)
        dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            }
            else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }
    return dp[a.length][b.length];
};
const fuzzyMatch = (word1, word2) => {
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
const rankResults = (query, results, minScore = 500) => {
    if (!query || results.length === 0)
        return [];
    console.log(`🔍 Ranking ${results.length} results for query: "${query}"`);
    const queryTokens = new Set(tokenize(query.toLowerCase()));
    const queryPhrase = queryTokens.size > 1 ? [...queryTokens].join(" ") : null;
    const uniqueResults = Array.from(new Map(results.map(item => [item.ctid, item])).values());
    return uniqueResults
        .map((training) => {
        var _a, _b;
        if (!training.name)
            return Object.assign(Object.assign({}, training), { rank: 0 });
        const trainingName = training.name.trim().toLowerCase();
        const trainingDesc = (training.description || "").trim().toLowerCase();
        const providerName = (training.providerName || "").trim().toLowerCase();
        const trainingLocation = ((_a = training.availableAt) === null || _a === void 0 ? void 0 : _a.map(a => { var _a, _b; return ((_b = (_a = a.city) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || ""; }).filter(Boolean)) || [];
        const cipTitle = (((_b = training.cipDefinition) === null || _b === void 0 ? void 0 : _b.ciptitle) || "").trim().toLowerCase();
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
            }
            else if (providerTokens.has(token)) {
                score += 100;
                strongMatch = true;
                console.log(`✅ Provider Match: "${token}" +100`);
            }
            else if (descTokens.has(token)) {
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
            return Object.assign(Object.assign({}, training), { rank: 0 });
        }
        return Object.assign(Object.assign({}, training), { rank: score });
    })
        .filter((r) => r.rank > 0)
        .sort((a, b) => b.rank - a.rank);
};
const searchLearningOpportunities = (query_1, ...args_1) => tslib_1.__awaiter(void 0, [query_1, ...args_1], void 0, function* (query, offset = 0, limit = 10) {
    try {
        const response = yield CredentialEngineAPI_1.credentialEngineAPI.getResults(query, offset, limit);
        return {
            learningOpportunities: response.data.data || [],
            totalResults: response.data.extra.TotalResults || 0,
        };
    }
    catch (error) {
        console.error(`Error fetching records (offset: ${offset}, limit: ${limit}):`, error);
        return { learningOpportunities: [], totalResults: 0 };
    }
});
const searchLearningOpportunitiesInBatches = (query_1, ...args_1) => tslib_1.__awaiter(void 0, [query_1, ...args_1], void 0, function* (query, page = 1, batchSize = 25) {
    const cacheKey = `learningOpportunities-${JSON.stringify(query)}-page-${page}`;
    const cachedOpportunities = yield redisClient_1.default.get(cacheKey);
    if (cachedOpportunities) {
        console.log(`✅ Cache hit for query: "${JSON.stringify(query)}" (page: ${page})`);
        return JSON.parse(cachedOpportunities);
    }
    const learningOpportunities = [];
    let totalResults = Infinity;
    let currentPage = page;
    while (learningOpportunities.length < totalResults) {
        const offset = (currentPage - 1) * batchSize;
        const { learningOpportunities: currentBatch, totalResults: fetchedTotalResults } = yield searchLearningOpportunities(query, offset, batchSize);
        if (!currentBatch.length || fetchedTotalResults === 0) {
            console.error(`❌ Error fetching records for query: "${JSON.stringify(query)}" (offset: ${offset})`);
            break;
        }
        const validBatch = currentBatch.filter((opportunity) => {
            var _a;
            return !((_a = opportunity["ceterms:ownedBy"]) === null || _a === void 0 ? void 0 : _a.includes("Provider not available"));
        });
        learningOpportunities.push(...validBatch);
        totalResults = fetchedTotalResults;
        if (learningOpportunities.length >= totalResults) {
            break;
        }
        currentPage++;
    }
    if (learningOpportunities.length === 0) {
        console.log("❌ No valid data to cache (likely due to 503 or 'Provider not available')");
        return { learningOpportunities, totalResults };
    }
    yield redisClient_1.default.set(cacheKey, JSON.stringify({ learningOpportunities, totalResults }), 'EX', 900);
    console.log(`✅ Caching ${learningOpportunities.length} valid results`);
    return { learningOpportunities, totalResults };
});
const filterRecords = (results, cip_code, soc_code, complete_in, in_demand, max_cost, county, miles, zipcode, format, languages, services) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let filteredResults = results;
    if (cip_code) {
        const normalizedCip = (0, normalizeCipCode_1.normalizeCipCode)(cip_code);
        filteredResults = filteredResults.filter((result) => { var _a; return (0, normalizeCipCode_1.normalizeCipCode)(((_a = result.cipDefinition) === null || _a === void 0 ? void 0 : _a.cipcode) || "") === normalizedCip; });
    }
    if (soc_code) {
        const normalizedSoc = (0, normalizeSocCode_1.normalizeSocCode)(soc_code);
        filteredResults = filteredResults.filter((result) => { var _a; return (_a = result.socCodes) === null || _a === void 0 ? void 0 : _a.some((soc) => (0, normalizeSocCode_1.normalizeSocCode)(soc) === normalizedSoc); });
    }
    if (in_demand) {
        filteredResults = filteredResults.filter(result => !!result.inDemand);
    }
    if (complete_in && complete_in.length > 0) {
        filteredResults = filteredResults.filter((result) => complete_in.includes(result.calendarLength));
    }
    if (max_cost && max_cost > 0) {
        filteredResults = filteredResults.filter((result) => result.totalCost !== null &&
            result.totalCost !== undefined &&
            result.totalCost <= max_cost);
    }
    if (format && format.length > 0) {
        const deliveryTypeMapping = {
            "inperson": DeliveryType_1.DeliveryType.InPerson,
            "online": DeliveryType_1.DeliveryType.OnlineOnly,
            "blended": DeliveryType_1.DeliveryType.BlendedDelivery,
        };
        const mappedClassFormats = format
            .map((f) => deliveryTypeMapping[f.toLowerCase()])
            .filter(Boolean);
        filteredResults = filteredResults.filter(result => {
            const deliveryTypes = result.deliveryTypes || [];
            return mappedClassFormats.some(mappedFormat => deliveryTypes.includes(mappedFormat));
        });
    }
    if (county) {
        filteredResults = filteredResults.filter(result => {
            var _a;
            const zipCodes = ((_a = result.availableAt) === null || _a === void 0 ? void 0 : _a.map(address => address.zipCode).filter(Boolean)) || [];
            const counties = zipCodes.map(zip => (0, convertZipCodeToCounty_1.convertZipCodeToCounty)(zip)).filter(Boolean);
            return counties.some(trainingCounty => trainingCounty.toLowerCase() === county.toLowerCase());
        });
    }
    if (miles !== undefined && miles >= 0 && zipcode) {
        const validZip = zipcodes_1.default.lookup(zipcode);
        if (!validZip) {
            console.warn(`Invalid ZIP code: ${zipcode}`);
            return [];
        }
        filteredResults = filteredResults.filter(result => {
            var _a;
            const zipCodes = ((_a = result.availableAt) === null || _a === void 0 ? void 0 : _a.map(address => address.zipCode).filter(Boolean)) || [];
            if (miles === 0) {
                return zipCodes.some(trainingZip => (trainingZip === null || trainingZip === void 0 ? void 0 : trainingZip.trim()) === zipcode.trim());
            }
            const zipCodesInRadius = zipcodes_1.default.radius(zipcode, miles);
            return zipCodes
                .filter((trainingZip) => Boolean(trainingZip))
                .some(trainingZip => zipCodesInRadius.includes(trainingZip));
        });
    }
    if (languages && languages.length > 0) {
        filteredResults = filteredResults.filter(result => {
            return languages.every(language => { var _a; return (_a = result.languages) === null || _a === void 0 ? void 0 : _a.includes(language); });
        });
    }
    if (services && services.length > 0) {
        filteredResults = (yield Promise.all(filteredResults.map((result) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const serviceChecks = yield Promise.all(services.map((service) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                switch (service) {
                    case 'wheelchair':
                        return typeof result.isWheelchairAccessible === 'function'
                            ? yield result.isWheelchairAccessible()
                            : result.isWheelchairAccessible;
                    case 'evening':
                        return result.hasEveningCourses;
                    case 'placement':
                        return typeof result.hasJobPlacementAssistance === 'function'
                            ? yield result.hasJobPlacementAssistance()
                            : result.hasJobPlacementAssistance;
                    case 'childcare':
                        return typeof result.hasChildcareAssistance === 'function'
                            ? yield result.hasChildcareAssistance()
                            : result.hasChildcareAssistance;
                    default:
                        return false;
                }
            })));
            return serviceChecks.every(Boolean) ? result : null;
        })))).filter(result => result !== null);
    }
    return filteredResults;
});
const paginateRecords = (trainingResults, page, limit) => {
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
const sortTrainings = (trainings, sort) => {
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
exports.sortTrainings = sortTrainings;
function normalizeQueryParams(params) {
    var _a, _b, _c, _d, _e;
    return {
        searchTerm: (_a = params.searchQuery) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase(),
        cip_code: (_b = params.cip_code) === null || _b === void 0 ? void 0 : _b.trim(),
        soc_code: (_c = params.soc_code) === null || _c === void 0 ? void 0 : _c.trim(),
        county: (_d = params.county) === null || _d === void 0 ? void 0 : _d.trim(),
        zipcode: (_e = params.zipcode) === null || _e === void 0 ? void 0 : _e.trim(),
        in_demand: params.in_demand || false,
        page: params.page || 1,
        limit: params.limit || 10,
        sort: params.sort || "best_match",
        filters: params.filters
            ? [...params.filters].sort((a, b) => a.key.localeCompare(b.key))
            : undefined,
    };
}
const searchTrainingsFactory = (dataClient) => {
    return (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const overallStart = performance.now();
        const { page = 1, limit = 10, sort = "best_match" } = params;
        const query = buildQuery(params);
        const normalizedParams = normalizeQueryParams(params);
        const cacheKey = `searchResults-${JSON.stringify(normalizedParams)}`;
        console.time("TotalSearchTime");
        let cachedData = null;
        const cachedOpportunities = yield redisClient_1.default.get(cacheKey);
        if (!cachedOpportunities) {
            console.log(`🚀 Cache miss: Fetching new results for query: "${normalizedParams.searchTerm}"`);
            const fetchStart = performance.now();
            const { learningOpportunities, totalResults } = yield searchLearningOpportunitiesInBatches(query);
            console.log(`📊 API fetch took ${performance.now() - fetchStart} ms`);
            const transformStart = performance.now();
            const results = yield Promise.all(learningOpportunities.map((lo) => transformLearningOpportunityCTDLToTrainingResult(dataClient, lo, params.searchQuery)));
            console.log(`🔄 Transformation took ${performance.now() - transformStart} ms`);
            cachedData = { results, totalResults };
            yield redisClient_1.default.set(cacheKey, JSON.stringify(cachedData), 'EX', 900);
        }
        else {
            console.log(`✅ Cache hit for query: "${normalizedParams.searchTerm}"`);
            try {
                cachedData = JSON.parse(cachedOpportunities);
            }
            catch (error) {
                console.error("Error parsing cached data", error);
                cachedData = { results: [], totalResults: 0 };
            }
        }
        if (!cachedData) {
            cachedData = { results: [], totalResults: 0 };
        }
        const filterStart = performance.now();
        const filteredResults = yield filterRecords(cachedData.results, params.cip_code, params.soc_code, params.complete_in, params.in_demand, params.max_cost, params.county, params.miles, params.zipcode, params.format, params.languages, params.services);
        console.log(`⚡ Filtering took ${performance.now() - filterStart} ms`);
        const rankStart = performance.now();
        const rankedResults = rankResults(params.searchQuery, filteredResults);
        console.log(`📈 Ranking took ${performance.now() - rankStart} ms`);
        const sortedResults = (0, exports.sortTrainings)(rankedResults, sort);
        const { results: paginatedResults, totalPages, totalResults, currentPage } = paginateRecords(sortedResults, page, limit);
        console.timeEnd("TotalSearchTime");
        console.log(`🚀 Overall search execution took ${performance.now() - overallStart} ms`);
        return packageResults(currentPage, limit, paginatedResults, totalResults, totalPages);
    });
};
exports.searchTrainingsFactory = searchTrainingsFactory;
function buildQuery(params) {
    const isSOC = /^\d{2}-?\d{4}(\.00)?$/.test(params.searchQuery);
    const isCIP = /^\d{2}\.?\d{4}$/.test(params.searchQuery);
    const isZipCode = zipcodes_1.default.lookup(params.searchQuery);
    const isCounty = Object.keys(zip_county_json_1.default.byCounty).includes(params.searchQuery);
    const queryParts = params.searchQuery.split('+').map(part => part.trim());
    const hasMultipleParts = queryParts.length > 1;
    const [ownedByPart, trainingPart] = queryParts;
    let termGroup = Object.assign(Object.assign({ "search:operator": "search:orTerms" }, (isSOC || isCIP || !!isZipCode || isCounty ? undefined : {
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
    })), { "ceterms:occupationType": isSOC ? {
            "ceterms:codedNotation": {
                "search:value": params.searchQuery,
                "search:matchType": "search:contains"
            }
        } : undefined, "ceterms:instructionalProgramType": isCIP ?
            { "ceterms:codedNotation": {
                    "search:value": params.searchQuery,
                    "search:matchType": "search:contains"
                }
            } : undefined });
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
        "search:recordPublishedBy": process.env.CE_NJDOL_CTID,
        "search:termGroup": termGroup
    };
}
function transformLearningOpportunityCTDLToTrainingResult(dataClient, learningOpportunity, searchQuery) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const desc = ((_a = learningOpportunity["ceterms:description"]) === null || _a === void 0 ? void 0 : _a["en-US"]) || "";
            const highlightPromise = (0, getHighlight_1.getHighlight)(desc, searchQuery);
            const providerPromise = CredentialEngineUtils_1.credentialEngineUtils.getProviderData(learningOpportunity);
            const cipCodePromise = CredentialEngineUtils_1.credentialEngineUtils.extractCipCode(learningOpportunity);
            const occupationsPromise = CredentialEngineUtils_1.credentialEngineUtils.extractOccupations(learningOpportunity);
            const costPromise = CredentialEngineUtils_1.credentialEngineUtils.extractCost(learningOpportunity, "costType:AggregateCost");
            const calendarLengthPromise = CredentialEngineUtils_1.credentialEngineUtils.getCalendarLengthId(learningOpportunity);
            const deliveryTypesPromise = CredentialEngineUtils_1.credentialEngineUtils.hasLearningDeliveryTypes(learningOpportunity);
            const availableAtPromise = CredentialEngineUtils_1.credentialEngineUtils.getAvailableAtAddresses(learningOpportunity);
            const eveningCoursesPromise = CredentialEngineUtils_1.credentialEngineUtils.hasEveningSchedule(learningOpportunity);
            const languagesPromise = CredentialEngineUtils_1.credentialEngineUtils.getLanguages(learningOpportunity);
            const [highlight, provider, cipCode, occupations, totalCost, calendarLength, deliveryTypes, availableAt, hasEveningCourses, languages] = yield Promise.all([
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
            const outcomeDefinitionPromise = (provider === null || provider === void 0 ? void 0 : provider.providerId) ? dataClient.findOutcomeDefinition(provider.providerId, cipCode) : Promise.resolve(null);
            const inDemandCIPsPromise = dataClient.getCIPsInDemand();
            const [cipDefinition, outcomeDefinition, inDemandCIPs] = yield Promise.all([
                cipDefinitionPromise,
                outcomeDefinitionPromise,
                inDemandCIPsPromise
            ]);
            const socCodes = occupations.map((occupation) => occupation.soc);
            const isInDemand = inDemandCIPs.some((c) => c.cipcode === cipCode);
            const isWheelchairAccessible = () => CredentialEngineUtils_1.credentialEngineUtils.checkAccommodation(learningOpportunity, "accommodation:PhysicalAccessibility");
            const hasJobPlacementAssistance = () => CredentialEngineUtils_1.credentialEngineUtils.checkSupportService(learningOpportunity, "support:JobPlacement");
            const hasChildcareAssistance = () => CredentialEngineUtils_1.credentialEngineUtils.checkSupportService(learningOpportunity, "support:Childcare");
            return {
                ctid: learningOpportunity["ceterms:ctid"] || "",
                name: ((_b = learningOpportunity["ceterms:name"]) === null || _b === void 0 ? void 0 : _b["en-US"]) || "",
                description: desc,
                cipDefinition: cipDefinition ? cipDefinition[0] : null,
                totalCost,
                percentEmployed: outcomeDefinition ? formatPercentEmployed(outcomeDefinition.peremployed2) : null,
                calendarLength,
                localExceptionCounty: yield (0, getLocalExceptionCounties_1.getLocalExceptionCounties)(dataClient, cipCode),
                deliveryTypes,
                providerId: (provider === null || provider === void 0 ? void 0 : provider.providerId) || null,
                providerName: (provider === null || provider === void 0 ? void 0 : provider.name) || "Provider not available",
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
        }
        catch (error) {
            console.error("Error transforming learning opportunity CTDL to TrainingResult object:", error);
            throw error;
        }
    });
}
function packageResults(currentPage, limit, results, totalResults, totalPages) {
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
const formatPercentEmployed = (perEmployed) => {
    if (perEmployed === null || perEmployed === NAN_INDICATOR) {
        return null;
    }
    return parseFloat(perEmployed);
};
