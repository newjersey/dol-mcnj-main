"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOccupationDetailByCIPFactory = void 0;
const tslib_1 = require("tslib");
const convertToTitleCaseIfUppercase_1 = require("../utils/convertToTitleCaseIfUppercase");
const convertTrainingToTrainingResult_1 = require("../training/convertTrainingToTrainingResult");
const Selector_1 = require("../training/Selector");
const getOccupationDetailByCIPFactory = (getOccupationDetailFromOnet, getEducationText, getSalaryEstimate, getOpenJobsCount, findTrainingsBy, dataClient) => {
    return (cip) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const occupations = yield dataClient.findOccupationsByCip(cip);
        const socs = occupations.map((it) => it.soc);
        const occupationDetailsPromises = socs.map((soc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const isInDemand = (soc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const inDemandOccupations = yield dataClient.getOccupationsInDemand();
                const expandedInDemand = removeDuplicateSocs(yield expand2010SocsTo2018(inDemandOccupations));
                return expandedInDemand.map((it) => it.soc).includes(soc);
            });
            const expand2010SocsTo2018 = (occupations) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                let expanded = [];
                for (const occupation of occupations) {
                    if (!occupation.title) {
                        const socs2018 = yield dataClient.find2018OccupationsBySoc2010(occupation.soc);
                        expanded = [...expanded, ...socs2018];
                    }
                    else {
                        expanded.push(Object.assign(Object.assign({}, occupation), { title: occupation.title }));
                    }
                }
                return expanded;
            });
            const removeDuplicateSocs = (occupationTitles) => {
                return occupationTitles.filter((value, index, array) => array.findIndex((it) => it.soc === value.soc) === index);
            };
            const getLocalExceptionCounties = (soc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const localExceptions = yield dataClient.getLocalExceptionsBySoc();
                if (!localExceptions || localExceptions.length == 0) {
                    return [];
                }
                const matches = localExceptions.filter((e) => e.soc === soc);
                const uniqueCounties = new Set();
                const uniqueMatches = [];
                matches.forEach((match) => {
                    const { county } = match, rest = tslib_1.__rest(match, ["county"]);
                    const transformedCounty = (0, convertToTitleCaseIfUppercase_1.convertToTitleCaseIfUppercase)(county);
                    if (!uniqueCounties.has(transformedCounty)) {
                        uniqueCounties.add(transformedCounty);
                        uniqueMatches.push(Object.assign({ county: transformedCounty }, rest));
                    }
                });
                return uniqueMatches;
            });
            const getTrainingResults = (soc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const cipDefinitions = yield dataClient.findCipDefinitionBySoc2018(soc);
                const cipcodes = cipDefinitions.map((it) => it.cipcode);
                const trainings = yield findTrainingsBy(Selector_1.Selector.CIP_CODE, cipcodes);
                return trainings.map((training) => {
                    return (0, convertTrainingToTrainingResult_1.convertTrainingToTrainingResult)(training, "", 0);
                });
            });
            return getOccupationDetailFromOnet(soc)
                .then((onetOccupationDetail) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const [inDemand, counties, openJobsCount, education, medianSalary, relatedTrainings] = yield Promise.all([
                    isInDemand(soc),
                    getLocalExceptionCounties(soc),
                    getOpenJobsCount(soc),
                    getEducationText(soc),
                    getSalaryEstimate(soc),
                    getTrainingResults(soc),
                ]);
                return Object.assign(Object.assign({}, onetOccupationDetail), { education: education, inDemand: inDemand, counties: counties.map((l) => l.county), medianSalary: medianSalary, openJobsCount: openJobsCount, openJobsSoc: soc, relatedTrainings: relatedTrainings });
            }))
                .catch((error) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                console.error("Error fetching occupation detail for SOC: " + soc + "; Error: ", error);
                return {
                    soc: soc,
                    title: "Not Available",
                    description: "Details not available due to an error.",
                    tasks: [],
                    education: "Unknown",
                    inDemand: false,
                    counties: [],
                    medianSalary: null,
                    openJobsCount: null,
                    relatedOccupations: [],
                    relatedTrainings: [],
                };
            }));
        }));
        return Promise.all(occupationDetailsPromises);
    });
};
exports.getOccupationDetailByCIPFactory = getOccupationDetailByCIPFactory;
