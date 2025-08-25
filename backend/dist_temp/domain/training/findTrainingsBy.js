"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTrainingsByFactory = void 0;
const tslib_1 = require("tslib");
const CredentialEngineUtils_1 = require("../../credentialengine/CredentialEngineUtils");
const getLocalExceptionCounties_1 = require("../utils/getLocalExceptionCounties");
const node_cache_1 = tslib_1.__importDefault(require("node-cache"));
const cache = new node_cache_1.default({ stdTTL: 300, checkperiod: 120 });
const findTrainingsByFactory = (dataClient) => {
    return (selector, values) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const cacheKey = `findTrainingsBy-${selector}-${values.join(",")}`;
        const cachedTrainings = cache.get(cacheKey);
        if (cachedTrainings) {
            console.info(`Cache hit for key: ${cacheKey}`);
            return cachedTrainings;
        }
        const inDemandCIPs = yield dataClient.getCIPsInDemand();
        const inDemandCIPCodes = inDemandCIPs.map((c) => c.cipcode);
        const ceEnvelopeUrls = values;
        const ceRecordsRaw = yield Promise.all(ceEnvelopeUrls.map(url => (0, CredentialEngineUtils_1.fetchNJDOLResource)(url, CredentialEngineUtils_1.credentialEngineUtils.isLearningOpportunityProfile)));
        const ceRecords = ceRecordsRaw.filter(Boolean);
        if (ceRecords.length === 0) {
            return [];
        }
        const trainings = yield Promise.all(ceRecords.map((record) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const provider = yield CredentialEngineUtils_1.credentialEngineUtils.getProviderData(record);
            const cipCode = yield CredentialEngineUtils_1.credentialEngineUtils.extractCipCode(record);
            const cipDefinition = yield dataClient.findCipDefinitionByCip(cipCode);
            let outcomesDefinition = null;
            if (provider === null || provider === void 0 ? void 0 : provider.providerId) {
                outcomesDefinition = yield dataClient.findOutcomeDefinition(provider.providerId, cipCode);
            }
            else {
                console.warn("Skipping outcomesDefinition lookup because providerId is missing or invalid");
            }
            const filteredPreparationFor = (record["ceterms:isPreparationFor"] || []).filter((entry) => { var _a; return ((_a = entry["ceterms:name"]) === null || _a === void 0 ? void 0 : _a["en-US"]) !== "Data not collected"; });
            const credentials = yield CredentialEngineUtils_1.credentialEngineUtils.constructCredentialsString(filteredPreparationFor);
            const training = {
                ctid: record["ceterms:ctid"],
                name: record["ceterms:name"] ? record["ceterms:name"]["en-US"] : "",
                cipDefinition: cipDefinition ? cipDefinition[0] : null,
                provider: provider,
                availableAt: yield CredentialEngineUtils_1.credentialEngineUtils.getAvailableAtAddresses(record),
                description: record["ceterms:description"] ? record["ceterms:description"]["en-US"] : "",
                credentials,
                prerequisites: yield CredentialEngineUtils_1.credentialEngineUtils.extractPrerequisites(record),
                totalClockHours: yield CredentialEngineUtils_1.credentialEngineUtils.getTimeRequired(record),
                calendarLength: yield CredentialEngineUtils_1.credentialEngineUtils.getCalendarLengthId(record),
                occupations: yield CredentialEngineUtils_1.credentialEngineUtils.extractOccupations(record),
                inDemand: inDemandCIPCodes.includes(cipCode !== null && cipCode !== void 0 ? cipCode : ""),
                localExceptionCounty: yield (0, getLocalExceptionCounties_1.getLocalExceptionCounties)(dataClient, cipCode),
                tuitionCost: yield CredentialEngineUtils_1.credentialEngineUtils.extractCost(record, "costType:Tuition"),
                feesCost: yield CredentialEngineUtils_1.credentialEngineUtils.extractCost(record, "costType:MixedFees"),
                booksMaterialsCost: yield CredentialEngineUtils_1.credentialEngineUtils.extractCost(record, "costType:LearningResource"),
                suppliesToolsCost: yield CredentialEngineUtils_1.credentialEngineUtils.extractCost(record, "costType:TechnologyFee"),
                otherCost: yield CredentialEngineUtils_1.credentialEngineUtils.extractCost(record, "costType:ProgramSpecificFee"),
                totalCost: yield CredentialEngineUtils_1.credentialEngineUtils.extractCost(record, "costType:AggregateCost"),
                deliveryTypes: yield CredentialEngineUtils_1.credentialEngineUtils.hasLearningDeliveryTypes(record),
                percentEmployed: outcomesDefinition ? formatPercentEmployed(outcomesDefinition.peremployed2) : null,
                averageSalary: outcomesDefinition ? formatAverageSalary(outcomesDefinition.avgquarterlywage2) : null,
                hasEveningCourses: yield CredentialEngineUtils_1.credentialEngineUtils.hasEveningSchedule(record),
                languages: yield CredentialEngineUtils_1.credentialEngineUtils.getLanguages(record),
                isWheelchairAccessible: yield CredentialEngineUtils_1.credentialEngineUtils.checkAccommodation(record, "accommodation:PhysicalAccessibility"),
                hasJobPlacementAssistance: yield CredentialEngineUtils_1.credentialEngineUtils.checkSupportService(record, "support:JobPlacement"),
                hasChildcareAssistance: yield CredentialEngineUtils_1.credentialEngineUtils.checkSupportService(record, "support:Childcare"),
            };
            console.log(training);
            return training;
        })));
        cache.set(cacheKey, trainings, 60 * 60);
        console.log(`Cache set for key: ${cacheKey}`);
        return trainings;
    });
};
exports.findTrainingsByFactory = findTrainingsByFactory;
const NAN_INDICATOR = "-99999";
const formatPercentEmployed = (perEmployed) => {
    if (perEmployed === null || perEmployed === NAN_INDICATOR) {
        return null;
    }
    return parseFloat(perEmployed);
};
const formatAverageSalary = (averageQuarterlyWage) => {
    if (averageQuarterlyWage === null || averageQuarterlyWage === NAN_INDICATOR) {
        return null;
    }
    const QUARTERS_IN_A_YEAR = 4;
    return parseFloat(averageQuarterlyWage) * QUARTERS_IN_A_YEAR;
};
