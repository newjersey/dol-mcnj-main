"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOccupationDetailFactory = void 0;
const tslib_1 = require("tslib");
const Selector_1 = require("../training/Selector");
const convertTrainingToTrainingResult_1 = require("../training/convertTrainingToTrainingResult");
const convertToTitleCaseIfUppercase_1 = require("../utils/convertToTitleCaseIfUppercase");
const getOccupationDetailFactory = (getOccupationDetailFromOnet, getEducationText, getSalaryEstimate, getOpenJobsCount, findTrainingsBy, dataClient) => {
    return (soc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
            try {
                const trainings = yield findTrainingsBy(Selector_1.Selector.CIP_CODE, cipcodes);
                return trainings.map((training) => {
                    return (0, convertTrainingToTrainingResult_1.convertTrainingToTrainingResult)(training, "", 0);
                });
            }
            catch (Error) {
                return [];
            }
        });
        return getOccupationDetailFromOnet(soc)
            .then((onetOccupationDetail) => {
            return Promise.all([
                isInDemand(soc),
                getLocalExceptionCounties(soc),
                getOpenJobsCount(soc),
                getEducationText(soc),
                getSalaryEstimate(soc),
                getTrainingResults(soc),
            ]).then(([inDemand, counties, openJobsCount, education, medianSalary, relatedTrainings]) => {
                return Object.assign(Object.assign({}, onetOccupationDetail), { education: education, inDemand: inDemand, counties: counties.map((l) => l.county), medianSalary: medianSalary, openJobsCount: openJobsCount, openJobsSoc: soc, relatedTrainings: relatedTrainings });
            });
        })
            .catch(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            console.log("getOccupationDetailFromOnet failed");
            const occupationTitles2010 = yield dataClient.find2010OccupationsBySoc2018(soc);
            if (occupationTitles2010.length === 1) {
                const soc2010 = occupationTitles2010[0].soc;
                return Promise.all([
                    getOccupationDetailFromOnet(soc2010),
                    isInDemand(soc2010),
                    getLocalExceptionCounties(soc2010),
                    getOpenJobsCount(soc2010),
                    getEducationText(soc),
                    getSalaryEstimate(soc),
                    getTrainingResults(soc),
                ]).then(([onetOccupationDetail, inDemand, counties, openJobsCount, education, medianSalary, relatedTrainings,]) => {
                    return Object.assign(Object.assign({}, onetOccupationDetail), { soc: soc, education: education, inDemand: inDemand, localExceptionCounties: counties, medianSalary: medianSalary, openJobsCount: openJobsCount, openJobsSoc: soc2010, relatedTrainings: relatedTrainings });
                });
            }
            else {
                return Promise.all([
                    dataClient.findSocDefinitionBySoc(soc),
                    isInDemand(soc),
                    getLocalExceptionCounties(soc),
                    getOpenJobsCount(soc),
                    getEducationText(soc),
                    getSalaryEstimate(soc),
                    dataClient.getNeighboringOccupations(soc),
                    getTrainingResults(soc),
                ]).then(([socDefinition, inDemand, counties, openJobsCount, education, medianSalary, neighboringOccupations, relatedTrainings,]) => {
                    return {
                        soc: socDefinition.soc,
                        title: socDefinition.title,
                        description: socDefinition.definition,
                        tasks: [],
                        education: education,
                        inDemand: inDemand,
                        localExceptionCounties: counties,
                        medianSalary: medianSalary,
                        openJobsCount: openJobsCount,
                        relatedOccupations: neighboringOccupations,
                        relatedTrainings: relatedTrainings,
                    };
                });
            }
        }));
    });
};
exports.getOccupationDetailFactory = getOccupationDetailFactory;
