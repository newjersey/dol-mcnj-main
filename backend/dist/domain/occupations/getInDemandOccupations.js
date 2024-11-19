"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInDemandOccupationsFactory = void 0;
const tslib_1 = require("tslib");
const stripOccupations_1 = require("../utils/stripOccupations");
const convertToTitleCaseIfUppercase_1 = require("../utils/convertToTitleCaseIfUppercase");
const getInDemandOccupationsFactory = (dataClient) => {
    const removeDuplicateSocs = (occupationTitles) => {
        return occupationTitles.filter((value, index, array) => array.findIndex((it) => it.soc === value.soc) === index);
    };
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
    return () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const inDemandOccupations = yield dataClient.getOccupationsInDemand();
        const expandedInDemand = removeDuplicateSocs(yield expand2010SocsTo2018(inDemandOccupations));
        const localExceptions = yield dataClient.getLocalExceptionsBySoc();
        if (localExceptions != null && localExceptions.length != 0) {
            for (const exception of localExceptions) {
                const matchingOccupation = expandedInDemand.find((occupation) => occupation.soc === exception.soc);
                if (matchingOccupation) {
                    if (!matchingOccupation.counties) {
                        matchingOccupation.counties = [];
                    }
                    matchingOccupation.counties.push(exception.county);
                }
                else {
                    expandedInDemand.push({
                        soc: exception.soc,
                        title: exception.title,
                        counties: [exception.county],
                    });
                }
            }
        }
        return Promise.all(expandedInDemand.map((occupationTitle) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const initialCode = occupationTitle.soc.split("-")[0];
            const majorGroupSoc = initialCode + "-0000";
            const majorGroup = yield dataClient.findSocDefinitionBySoc(majorGroupSoc);
            const uniqueCounties = [
                ...new Set((_a = occupationTitle.counties) === null || _a === void 0 ? void 0 : _a.map((c) => (0, convertToTitleCaseIfUppercase_1.convertToTitleCaseIfUppercase)(c))),
            ];
            return {
                soc: occupationTitle.soc,
                title: occupationTitle.title,
                majorGroup: (0, stripOccupations_1.stripOccupations)(majorGroup.title),
                counties: uniqueCounties,
            };
        })));
    });
};
exports.getInDemandOccupationsFactory = getInDemandOccupationsFactory;
