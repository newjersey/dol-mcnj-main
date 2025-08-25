"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTrainings = void 0;
const tslib_1 = require("tslib");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const CredentialEngineAPI_1 = require("../../credentialengine/CredentialEngineAPI");
const CredentialEngineUtils_1 = require("../../credentialengine/CredentialEngineUtils");
const node_cache_1 = tslib_1.__importDefault(require("node-cache"));
const process = tslib_1.__importStar(require("node:process"));
const cache = new node_cache_1.default({ stdTTL: 3600, checkperiod: 3600 });
const allTrainings = () => {
    return () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const query = buildQuery();
        let ceRecordsResponse1;
        const cacheKey = 'all-trainings';
        const cachedResults = cache.get(cacheKey);
        if (cachedResults) {
            console.log("Returning cached results for key:", cacheKey);
            return cachedResults;
        }
        try {
            ceRecordsResponse1 = yield CredentialEngineAPI_1.credentialEngineAPI.getResults(query, 0, 1);
            const totalResults = ceRecordsResponse1.data.extra.TotalResults;
            const batchSize = 100;
            let allRecords = [];
            const fetchBatch = (skip) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const response = yield CredentialEngineAPI_1.credentialEngineAPI.getResults(query, skip, batchSize);
                return response.data.data;
            });
            const batchPromises = [];
            for (let skip = 0; skip < totalResults; skip += batchSize) {
                batchPromises.push(fetchBatch(skip));
            }
            const batchResults = yield Promise.all(batchPromises);
            allRecords = batchResults.flat();
            const results = yield Promise.all(allRecords.map(certificate => transformLearningOpportunityCTDLToTrainingResult(certificate)));
            cache.set(cacheKey, results);
            return results;
        }
        catch (error) {
            Sentry.captureException(error);
            console.error("Error fetching results from Credential Engine API:", error);
            throw new Error("Failed to fetch results from Credential Engine API.");
        }
    });
};
exports.allTrainings = allTrainings;
function buildQuery() {
    return {
        "@type": {
            "search:value": "ceterms:LearningOpportunityProfile",
            "search:matchType": "search:subClassOf"
        },
        "ceterms:lifeCycleStatusType": {
            "ceterms:targetNode": "lifeCycle:Active"
        },
        "search:recordPublishedBy": process.env.CE_NJDOL_CTID
    };
}
function transformLearningOpportunityCTDLToTrainingResult(learningOpportunity) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const training_id = learningOpportunity["ceterms:ctid"] || "";
            const title = ((_a = learningOpportunity["ceterms:name"]) === null || _a === void 0 ? void 0 : _a["en-US"]) || "";
            const address = yield CredentialEngineUtils_1.credentialEngineUtils.getAvailableAtAddresses(learningOpportunity);
            const socName = learningOpportunity["ceterms:occupationType"] && learningOpportunity["ceterms:occupationType"][0] && learningOpportunity["ceterms:occupationType"][0]["ceterms:targetNodeName"] && learningOpportunity["ceterms:occupationType"][0]["ceterms:targetNodeName"]["en-US"]
                ? learningOpportunity["ceterms:occupationType"][0]["ceterms:targetNodeName"]["en-US"] : 'Not Available';
            const socCode = learningOpportunity["ceterms:occupationType"] ? learningOpportunity["ceterms:occupationType"][0]["ceterms:codedNotation"] : '999999';
            const socCodeReplaced = socCode.replace(/-/g, '').replace(/\.00$/, '');
            const duration = yield CredentialEngineUtils_1.credentialEngineUtils.getCalendarLengthId(learningOpportunity);
            return {
                training_id: training_id,
                title: title,
                area: address.length > 0 ? address[0].city : "",
                link: `https://mycareer.nj.gov/training/${training_id}`,
                duration: duration,
                soc: socCodeReplaced,
                roi: 0,
                soc3: socCodeReplaced.substring(0, 3),
                id: `training#${training_id}`,
                method: `classroom`,
                soc_name: socName,
                location: address.length > 0 ? address[0].county : "",
                title_en: title,
                soc_name_en: socName,
                title_es: title,
                soc_name_es: socName,
                title_tl: title,
                soc_name_tl: socName,
                title_zh: title,
                soc_name_zh: socName,
                title_ja: title,
                soc_name_ja: socName,
                duration_units: `Weeks`,
                duration_slider_val_min: duration.toString(),
                duration_slider_val_max: duration.toString(),
                duration_units_en: `Weeks`,
                duration_units_es: `Semanas`,
                duration_units_tl: `tuần`,
                duration_units_zh: `周`,
                duration_units_ja: `週間`,
            };
        }
        catch (error) {
            console.error("Error transforming learning opportunity to trainingresult:", error);
            throw error;
        }
    });
}
