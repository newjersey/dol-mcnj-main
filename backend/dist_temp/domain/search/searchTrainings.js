"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTrainingsFactory = void 0;
const tslib_1 = require("tslib");
const stripUnicode_1 = require("../utils/stripUnicode");
const Selector_1 = require("../training/Selector");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const searchTrainingsFactory = (findTrainingsBy, searchClient) => {
    return (searchQuery) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        if (!searchQuery || searchQuery.trim() === '') {
            return [];
        }
        try {
            const searchResults = yield searchClient.search(searchQuery);
            const trainings = yield findTrainingsBy(Selector_1.Selector.ID, searchResults.map((it) => it.id));
            return yield Promise.all(trainings.map((training) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                var _a;
                let highlight = "";
                let rank = 0;
                if (searchQuery) {
                    highlight = yield searchClient.getHighlight(training.id, searchQuery);
                }
                if (searchResults) {
                    const foundRank = (_a = searchResults.find((it) => it.id === training.id)) === null || _a === void 0 ? void 0 : _a.rank;
                    if (foundRank) {
                        rank = foundRank;
                    }
                }
                const result = {
                    id: training.id,
                    name: training.name,
                    cipDefinition: training.cipDefinition,
                    totalCost: training.totalCost,
                    percentEmployed: training.percentEmployed,
                    calendarLength: training.calendarLength,
                    totalClockHours: training.totalClockHours,
                    localExceptionCounty: training.localExceptionCounty,
                    online: training.online,
                    providerId: training.provider.id,
                    providerName: training.provider.name,
                    city: training.provider.address.city,
                    zipCode: training.provider.address.zipCode,
                    county: training.provider.county,
                    inDemand: training.inDemand,
                    highlight: (0, stripUnicode_1.stripUnicode)(highlight),
                    rank: rank,
                    socCodes: training.occupations.map((o) => o.soc),
                    hasEveningCourses: training.hasEveningCourses,
                    languages: training.languages,
                    isWheelchairAccessible: training.isWheelchairAccessible,
                    hasJobPlacementAssistance: training.hasJobPlacementAssistance,
                    hasChildcareAssistance: training.hasChildcareAssistance,
                };
                return result;
            })));
        }
        catch (error) {
            console.error(`Failed to search for trainings with the query: ${searchQuery}`, error);
            Sentry.captureException(error);
            throw error;
        }
    });
};
exports.searchTrainingsFactory = searchTrainingsFactory;
