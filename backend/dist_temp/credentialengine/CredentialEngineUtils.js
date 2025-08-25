"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialEngineUtils = exports.DATA_VALUE_TO_LANGUAGE = exports.retryWithBackoff = void 0;
exports.fetchNJDOLResource = fetchNJDOLResource;
exports.isLearningOpportunityProfile = isLearningOpportunityProfile;
const tslib_1 = require("tslib");
const convertZipCodeToCounty_1 = require("../domain/utils/convertZipCodeToCounty");
const CredentialEngineAPI_1 = require("./CredentialEngineAPI");
const DeliveryType_1 = require("../domain/DeliveryType");
const axios_1 = require("axios");
const redisClient_1 = tslib_1.__importDefault(require("../infrastructure/redis/redisClient"));
const logError = (message, error) => {
    console.error(`${message}: ${error.message}`);
};
const retryWithBackoff = (fn, retries, delay, context) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let attempt = 0;
    while (attempt < retries) {
        try {
            console.log(`Attempt ${attempt + 1} for ${context || "Unknown"} with delay ${delay}ms`);
            const result = yield fn();
            console.log(`✅ Request succeeded in ${attempt + 1} attempt(s).`);
            return result;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 503) {
                console.error(`503 Error (Attempt ${attempt + 1}): ${((_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText) || "Unknown"} for ${context || "Unknown"}`);
                console.error(`Response: ${JSON.stringify((_c = error.response) === null || _c === void 0 ? void 0 : _c.data)}`);
                if (attempt < retries - 1) {
                    console.log(`Retrying in ${delay}ms...`);
                    yield new Promise(resolve => setTimeout(resolve, delay));
                    attempt++;
                    delay *= 2;
                }
                else {
                    console.error(`Exhausted all retries. Giving up after ${retries} attempts.`);
                    throw new Error(`503 Error after ${retries} attempts in ${context || "retryWithBackoff"}`);
                }
            }
            else {
                console.error(`Error in ${context || "retryWithBackoff"}: ${error}`);
                throw error;
            }
        }
    }
    throw new Error(`503 Error after ${retries} attempts in ${context || "retryWithBackoff"}`);
});
exports.retryWithBackoff = retryWithBackoff;
const validateCtId = (id) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const pattern = /^ce-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    try {
        return pattern.test(id);
    }
    catch (error) {
        logError(`Error validating CTID: ${id}`, error);
        throw error;
    }
});
const getCtidFromURL = (url) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastSlashIndex = url.lastIndexOf("/");
        return url.substring(lastSlashIndex + 1);
    }
    catch (error) {
        logError(`Error extracting CTID from URL: ${url}`, error);
        throw error;
    }
});
function fetchNJDOLResource(envelopeUrl, filterFn) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const ctid = envelopeUrl.split("/").pop();
            if (!ctid) {
                console.error(`Invalid envelope URL: ${envelopeUrl}`);
                return null;
            }
            const envelope = yield CredentialEngineAPI_1.credentialEngineAPI.getEnvelopeByCTID(ctid);
            const publishedBy = envelope === null || envelope === void 0 ? void 0 : envelope.published_by;
            const expectedPublisher = process.env.CE_NJDOL_CTID;
            if (publishedBy !== expectedPublisher) {
                console.warn(`CTID ${ctid} not published by NJDOL. Found: ${publishedBy}`);
                return null;
            }
            const resourceGraph = (_a = envelope === null || envelope === void 0 ? void 0 : envelope.decoded_resource) === null || _a === void 0 ? void 0 : _a["@graph"];
            if (!Array.isArray(resourceGraph))
                return null;
            if (filterFn) {
                const match = resourceGraph.find((node) => filterFn(node));
                if (!match) {
                    console.warn(`No resource in @graph passed filterFn for CTID: ${ctid}`);
                    return null;
                }
                return match;
            }
            if (resourceGraph.length === 1) {
                return resourceGraph[0];
            }
            console.warn(`Ambiguous graph structure in envelope for CTID ${ctid} — multiple nodes, no filter`);
            return null;
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(`Failed to fetch or process envelope from ${envelopeUrl}:`, err.message);
            }
            else {
                console.error(`Unknown error while fetching envelope from ${envelopeUrl}`);
            }
            return null;
        }
    });
}
function getProviderData(resource) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const ownedByUrl = (_a = resource["ceterms:ownedBy"]) === null || _a === void 0 ? void 0 : _a[0];
            if (!ownedByUrl) {
                console.warn("OwnedBy field is missing in the certificate.");
                return null;
            }
            const ownedByCtid = yield exports.credentialEngineUtils.getCtidFromURL(ownedByUrl);
            const cachedProvider = yield redisClient_1.default.get(ownedByCtid);
            if (cachedProvider) {
                console.log(`✅ Cache hit for provider CTID: ${ownedByCtid}`);
                return JSON.parse(cachedProvider);
            }
            const providerData = yield CredentialEngineAPI_1.credentialEngineAPI.getResourceByCTID(ownedByCtid);
            if (!providerData) {
                return null;
            }
            const provider = {
                ctid: providerData["ceterms:ctid"] || "",
                providerId: providerData["ceterms:identifierValueCode"] || "",
                name: ((_b = providerData["ceterms:name"]) === null || _b === void 0 ? void 0 : _b["en-US"]) || "Unknown Provider",
                url: providerData["ceterms:subjectWebpage"] || "",
                email: ((_c = providerData["ceterms:email"]) === null || _c === void 0 ? void 0 : _c[0]) || "",
                addresses: yield exports.credentialEngineUtils.getAddress(providerData),
            };
            yield redisClient_1.default.set(ownedByCtid, JSON.stringify(provider), 'EX', 7200);
            return provider;
        }
        catch (error) {
            console.error(`Error fetching provider for ${(_d = resource["ceterms:ownedBy"]) === null || _d === void 0 ? void 0 : _d[0]}: `, error);
            return null;
        }
    });
}
const getAddress = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const addresses = (_a = resource["ceterms:address"]) !== null && _a !== void 0 ? _a : [];
        return addresses.map((address) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const zipCode = (_a = address["ceterms:postalCode"]) !== null && _a !== void 0 ? _a : "";
            return {
                "@type": "ceterms:Place",
                street_address: (_c = (_b = address["ceterms:streetAddress"]) === null || _b === void 0 ? void 0 : _b["en-US"]) !== null && _c !== void 0 ? _c : "",
                city: (_e = (_d = address["ceterms:addressLocality"]) === null || _d === void 0 ? void 0 : _d["en-US"]) !== null && _e !== void 0 ? _e : "",
                state: (_g = (_f = address["ceterms:addressRegion"]) === null || _f === void 0 ? void 0 : _f["en-US"]) !== null && _g !== void 0 ? _g : "",
                zipCode,
                county: (_h = (0, convertZipCodeToCounty_1.convertZipCodeToCounty)(zipCode)) !== null && _h !== void 0 ? _h : "",
                targetContactPoints: (address["ceterms:targetContactPoint"] || []).map((contactPoint) => {
                    var _a, _b, _c, _d, _e, _f;
                    return ({
                        name: (_b = (_a = contactPoint["ceterms:name"]) === null || _a === void 0 ? void 0 : _a["en-US"]) !== null && _b !== void 0 ? _b : "",
                        contactType: (_d = (_c = contactPoint["ceterms:contactType"]) === null || _c === void 0 ? void 0 : _c["en-US"]) !== null && _d !== void 0 ? _d : "",
                        email: (_e = contactPoint["ceterms:email"]) !== null && _e !== void 0 ? _e : [],
                        telephone: (_f = contactPoint["ceterms:telephone"]) !== null && _f !== void 0 ? _f : [],
                    });
                }),
            };
        });
    }
    catch (error) {
        logError(`Error getting ceterms:address`, error);
        throw error;
    }
});
const getAvailableAtAddresses = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const availableAt = (_a = resource["ceterms:availableAt"]) !== null && _a !== void 0 ? _a : [];
        return availableAt.map((location) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const zipCode = (_a = location["ceterms:postalCode"]) !== null && _a !== void 0 ? _a : "";
            const targetContactPoints = (location["ceterms:targetContactPoint"] || []).map((contactPoint) => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    name: (_b = (_a = contactPoint["ceterms:name"]) === null || _a === void 0 ? void 0 : _a["en-US"]) !== null && _b !== void 0 ? _b : null,
                    contactType: (_d = (_c = contactPoint["ceterms:contactType"]) === null || _c === void 0 ? void 0 : _c["en-US"]) !== null && _d !== void 0 ? _d : null,
                    email: (_e = contactPoint["ceterms:email"]) !== null && _e !== void 0 ? _e : [],
                    telephone: (_f = contactPoint["ceterms:telephone"]) !== null && _f !== void 0 ? _f : [],
                });
            });
            return {
                "@type": "ceterms:Place",
                street_address: (_c = (_b = location["ceterms:streetAddress"]) === null || _b === void 0 ? void 0 : _b["en-US"]) !== null && _c !== void 0 ? _c : "",
                city: (_e = (_d = location["ceterms:addressLocality"]) === null || _d === void 0 ? void 0 : _d["en-US"]) !== null && _e !== void 0 ? _e : "",
                state: (_g = (_f = location["ceterms:addressRegion"]) === null || _f === void 0 ? void 0 : _f["en-US"]) !== null && _g !== void 0 ? _g : "",
                zipCode,
                county: (_h = (0, convertZipCodeToCounty_1.convertZipCodeToCounty)(zipCode)) !== null && _h !== void 0 ? _h : "",
                targetContactPoints,
            };
        });
    }
    catch (error) {
        logError(`Error getting available addresses`, error);
        throw error;
    }
});
const extractCipCode = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const instructionalProgramTypes = resource["ceterms:instructionalProgramType"];
        if (Array.isArray(instructionalProgramTypes)) {
            for (const programType of instructionalProgramTypes) {
                if (((_a = programType["ceterms:frameworkName"]) === null || _a === void 0 ? void 0 : _a["en-US"]) ===
                    "Classification of Instructional Programs") {
                    return (programType["ceterms:codedNotation"] || "").replace(/[^\w\s]/g, "");
                }
            }
        }
        return "";
    }
    catch (error) {
        logError(`Error extracting CIP code`, error);
        throw error;
    }
});
const extractOccupations = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const occupationTypes = resource["ceterms:occupationType"];
        if (!occupationTypes || occupationTypes.length === 0)
            return [];
        return occupationTypes
            .filter((occupation) => {
            var _a, _b;
            return ((_a = occupation["ceterms:frameworkName"]) === null || _a === void 0 ? void 0 : _a["en-US"]) ===
                "Standard Occupational Classification" &&
                occupation["ceterms:codedNotation"] &&
                ((_b = occupation["ceterms:targetNodeName"]) === null || _b === void 0 ? void 0 : _b["en-US"]);
        })
            .map((occupation) => {
            var _a, _b;
            const soc = (_a = occupation["ceterms:codedNotation"]) === null || _a === void 0 ? void 0 : _a.replace(".00", "");
            const title = (_b = occupation["ceterms:targetNodeName"]) === null || _b === void 0 ? void 0 : _b["en-US"];
            return { soc, title };
        })
            .filter((occupation) => !!occupation.soc && !!occupation.title);
    }
    catch (error) {
        logError(`Error extracting occupations`, error);
        throw error;
    }
});
const extractCost = (resource, costType) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const estimatedCosts = resource["ceterms:estimatedCost"];
        if (Array.isArray(estimatedCosts)) {
            for (const costProfile of estimatedCosts) {
                const directCostType = costProfile["ceterms:directCostType"];
                if ((directCostType === null || directCostType === void 0 ? void 0 : directCostType["ceterms:targetNode"]) === costType) {
                    const price = costProfile["ceterms:price"];
                    return price !== null && price !== undefined ? price : null;
                }
            }
        }
        return null;
    }
    catch (error) {
        console.error(`Error extracting cost for type ${costType}:`, error);
        return null;
    }
});
const extractAverageSalary = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const averageSalaryData = resource["ceterms:aggregateData"];
        if (!averageSalaryData)
            return null;
        const averageSalaryProfile = averageSalaryData.find((aggData) => aggData["ceterms:medianEarnings"] !== undefined &&
            aggData["ceterms:medianEarnings"] !== null);
        if (!averageSalaryProfile)
            return null;
        const medianEarnings = averageSalaryProfile["ceterms:medianEarnings"];
        if (typeof medianEarnings !== "number") {
            throw new Error(`Median earnings is not a number: ${medianEarnings}`);
        }
        return medianEarnings;
    }
    catch (error) {
        logError(`Error extracting average salary`, error);
        throw error;
    }
});
const extractEmploymentData = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const aggData = resource["ceterms:aggregateData"];
        if (!aggData)
            return null;
        for (const data of aggData) {
            const jobObtained = (_a = data["ceterms:jobsObtained"]) === null || _a === void 0 ? void 0 : _a.find((job) => job["qdata:percentage"] != null);
            if ((jobObtained === null || jobObtained === void 0 ? void 0 : jobObtained["qdata:percentage"]) != null) {
                return jobObtained["qdata:percentage"];
            }
        }
        return null;
    }
    catch (error) {
        logError(`Error extracting employment data`, error);
        throw error;
    }
});
const extractPrerequisites = (certificate) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const prerequisites = (_a = certificate["ceterms:requires"]) === null || _a === void 0 ? void 0 : _a.filter((req) => { var _a, _b; return ((_b = (_a = req["ceterms:name"]) === null || _a === void 0 ? void 0 : _a["en-US"]) !== null && _b !== void 0 ? _b : "") === "Prerequisites"; }).map((req) => { var _a; return (_a = req["ceterms:description"]) === null || _a === void 0 ? void 0 : _a["en-US"]; }).filter((description) => description !== undefined);
        return prerequisites && prerequisites.length > 0 ? prerequisites : null;
    }
    catch (error) {
        logError(`Error extracting prerequisites`, error);
        throw error;
    }
});
const checkSupportService = (resource, targetNode) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const supportServices = resource["ceterms:hasSupportService"] || [];
        for (const serviceUrl of supportServices) {
            if (!serviceUrl)
                continue;
            const ctid = serviceUrl.split("/").pop();
            if (!ctid)
                continue;
            try {
                const linkedServiceRecord = yield CredentialEngineAPI_1.credentialEngineAPI.getResourceByCTID(ctid);
                if (!linkedServiceRecord)
                    continue;
                const serviceTypes = linkedServiceRecord["ceterms:supportServiceType"] || [];
                if (serviceTypes.some((type) => type["ceterms:targetNode"] === targetNode)) {
                    return true;
                }
            }
            catch (error) {
                console.error(`Error for support service check, skipping CTID: ${ctid}`);
            }
        }
        return false;
    }
    catch (error) {
        if (error instanceof Error) {
            logError(`Error checking support service`, error);
        }
        else {
            console.error(`Unknown error checking support service`);
        }
        return false;
    }
});
const checkAccommodation = (resource, targetNode) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const supportServices = resource["ceterms:hasSupportService"] || [];
        for (const serviceUrl of supportServices) {
            if (!serviceUrl)
                continue;
            const ctid = serviceUrl.split("/").pop();
            console.log("");
            if (!ctid)
                continue;
            try {
                const linkedServiceRecord = yield (0, exports.retryWithBackoff)(() => CredentialEngineAPI_1.credentialEngineAPI.getResourceByCTID(ctid), 3, 1000);
                if (!linkedServiceRecord)
                    continue;
                const accommodationTypes = linkedServiceRecord["ceterms:accommodationType"] || [];
                if (accommodationTypes.some((type) => type["ceterms:targetNode"] === targetNode)) {
                    return true;
                }
            }
            catch (error) {
                console.error(`Error for accommodation check, skipping CTID: ${ctid}`);
            }
        }
        return false;
    }
    catch (error) {
        if (error instanceof Error) {
            logError(`Error checking accommodation`, error);
        }
        else {
            console.error(`Unknown error checking accommodation`);
        }
        return false;
    }
});
const constructCredentialsString = (isPreparationForObject) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!isPreparationForObject || isPreparationForObject.length === 0)
            return "";
        return isPreparationForObject
            .map((obj) => { var _a, _b; return (_b = (_a = obj["ceterms:name"]) === null || _a === void 0 ? void 0 : _a["en-US"]) !== null && _b !== void 0 ? _b : ""; })
            .filter((name) => name)
            .join(", ");
    }
    catch (error) {
        logError(`Error constructing credentials string`, error);
        throw error;
    }
});
const getTimeRequired = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const estimatedDuration = resource["ceterms:estimatedDuration"];
        if (!estimatedDuration || estimatedDuration.length === 0)
            return 0;
        const exactDuration = estimatedDuration[0]["ceterms:timeRequired"];
        if (!exactDuration)
            return 0;
        return yield convertIso8601DurationToTotalHours(exactDuration);
    }
    catch (error) {
        logError(`Error getting calendar length ID`, error);
        throw error;
    }
});
const getCalendarLengthId = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const estimatedDuration = resource["ceterms:estimatedDuration"];
        if (!estimatedDuration || estimatedDuration.length === 0)
            return 0;
        const exactDuration = estimatedDuration[0]["ceterms:exactDuration"];
        if (!exactDuration)
            return 0;
        return yield convertIso8601DurationToCalendarLengthId(exactDuration);
    }
    catch (error) {
        logError(`Error getting calendar length ID`, error);
        throw error;
    }
});
const hasLearningDeliveryTypes = (resource) => {
    var _a;
    try {
        const deliveryTypes = (_a = resource["ceterms:deliveryType"]) !== null && _a !== void 0 ? _a : [];
        const mappedTypes = deliveryTypes
            .map((deliveryType) => {
            switch (deliveryType["ceterms:targetNode"]) {
                case "deliveryType:InPerson":
                    return DeliveryType_1.DeliveryType.InPerson;
                case "deliveryType:OnlineOnly":
                    return DeliveryType_1.DeliveryType.OnlineOnly;
                case "deliveryType:BlendedDelivery":
                    return DeliveryType_1.DeliveryType.BlendedDelivery;
                default:
                    console.warn(`Unknown delivery type: ${JSON.stringify(deliveryType)}`);
                    return undefined;
            }
        })
            .filter((type) => !!type);
        return Promise.resolve(mappedTypes);
    }
    catch (error) {
        logError("Error checking for learning delivery types", error);
        throw error;
    }
};
const hasEveningSchedule = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduleTimingTypes = resource["ceterms:scheduleTimingType"];
        if (!scheduleTimingTypes)
            return false;
        const hasEvening = scheduleTimingTypes.some((timingType) => timingType["ceterms:targetNode"] === "scheduleTiming:Evening");
        return hasEvening;
    }
    catch (error) {
        logError(`Error checking evening schedule`, error);
        throw error;
    }
});
const getLanguages = (resource) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const languages = resource["ceterms:inLanguage"];
        if (!languages || languages.length === 0)
            return [];
        return languages.map((languageTag) => exports.DATA_VALUE_TO_LANGUAGE[languageTag] || languageTag);
    }
    catch (error) {
        logError(`Error getting languages`, error);
        throw error;
    }
});
const convertIso8601DurationToTotalHours = (isoString) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const match = isoString.match(/P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/);
        if (!match) {
            throw new Error("Invalid ISO 8601 duration string");
        }
        const years = parseInt(match[1] || "0", 10) * 365 * 24;
        const months = parseInt(match[2] || "0", 10) * 30 * 24;
        const weeks = parseInt(match[3] || "0", 10) * 7 * 24;
        const days = parseInt(match[4] || "0", 10) * 24;
        const hours = parseInt(match[5] || "0", 10);
        const minutes = parseInt(match[6] || "0", 10) / 60;
        const seconds = parseInt(match[7] || "0", 10) / 3600;
        return years + months + weeks + days + hours + minutes + seconds;
    }
    catch (error) {
        logError(`Error converting ISO 8601 duration to total hours`, error);
        throw error;
    }
});
const convertIso8601DurationToCalendarLengthId = (isoString) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const match = isoString.match(/P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/);
        if (!match) {
            throw new Error("Invalid ISO 8601 duration string");
        }
        const years = parseInt(match[1]) || 0;
        const months = parseInt(match[2]) || 0;
        const weeks = parseInt(match[3]) || 0;
        const days = parseInt(match[4]) || 0;
        const hours = parseInt(match[5]) || 0;
        const minutes = parseInt(match[6]) || 0;
        const seconds = parseInt(match[7]) || 0;
        const totalDays = years * 365 + months * 30 + weeks * 7 + days + hours / 24 + minutes / 1440 + seconds / 86400;
        if (totalDays < 1)
            return 1;
        if (totalDays <= 2)
            return 2;
        if (totalDays <= 7)
            return 3;
        if (totalDays <= 21)
            return 4;
        if (totalDays <= 77)
            return 5;
        if (totalDays <= 150)
            return 6;
        if (totalDays <= 365)
            return 7;
        if (totalDays <= 730)
            return 8;
        if (totalDays <= 1460)
            return 9;
        return 10;
    }
    catch (error) {
        logError(`Error converting ISO 8601 duration to calendar length ID`, error);
        throw error;
    }
});
exports.DATA_VALUE_TO_LANGUAGE = {
    ar: "Arabic",
    zh: "Chinese",
    en: "English",
    "en-US": "English",
    te: "Telugu",
    fr: "French",
    "fr-HT": "French Creole",
    de: "German",
    el: "Greek",
    he: "Hebrew",
    hi: "Hindi",
    hu: "Hungarian",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    pl: "Polish",
    pt: "Portuguese",
    ru: "Russian",
    es: "Spanish",
    tl: "Tagalog",
    vi: "Vietnamese",
    yi: "Yiddish",
};
function isLearningOpportunityProfile(resource) {
    const type = resource === null || resource === void 0 ? void 0 : resource["@type"];
    if (Array.isArray(type)) {
        return type.includes("ceterms:LearningOpportunityProfile");
    }
    return type === "ceterms:LearningOpportunityProfile";
}
exports.credentialEngineUtils = {
    validateCtId,
    getCtidFromURL,
    getProviderData,
    getAddress,
    getAvailableAtAddresses,
    extractCipCode,
    extractOccupations,
    extractCost,
    extractAverageSalary,
    extractEmploymentData,
    extractPrerequisites,
    checkSupportService,
    checkAccommodation,
    constructCredentialsString,
    getTimeRequired,
    getCalendarLengthId,
    hasLearningDeliveryTypes,
    hasEveningSchedule,
    getLanguages,
    convertIso8601DurationToTotalHours,
    convertIso8601DurationToCalendarLengthId,
    isLearningOpportunityProfile,
};
