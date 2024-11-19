"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLanguages = exports.mapStrNumToBool = exports.findTrainingsByFactory = void 0;
const tslib_1 = require("tslib");
const stripSurroundingQuotes_1 = require("../utils/stripSurroundingQuotes");
const stripUnicode_1 = require("../utils/stripUnicode");
const convertToTitleCaseIfUppercase_1 = require("../utils/convertToTitleCaseIfUppercase");
const formatZipCode_1 = require("../utils/formatZipCode");
const CalendarLength_1 = require("../CalendarLength");
const Sentry = tslib_1.__importStar(require("@sentry/node"));
const findTrainingsByFactory = (dataClient) => {
    return (selector, values) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const programs = yield dataClient.findProgramsBy(selector, values);
            return (yield Promise.all(programs.map((program) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                try {
                    const matchingOccupations = yield dataClient.findOccupationsByCip(program.cipcode);
                    const localExceptionCounties = (yield dataClient.getLocalExceptionsByCip())
                        .filter((localException) => localException.cipcode === program.cipcode)
                        .map((localException) => (0, convertToTitleCaseIfUppercase_1.convertToTitleCaseIfUppercase)(localException.county));
                    const cipDefinition = yield dataClient.findCipDefinitionByCip(program.cipcode);
                    return {
                        id: program.programid,
                        name: (0, stripSurroundingQuotes_1.stripSurroundingQuotes)((0, convertToTitleCaseIfUppercase_1.convertToTitleCaseIfUppercase)(program.officialname)),
                        cipDefinition: cipDefinition !== undefined ? cipDefinition[0] : null,
                        provider: {
                            id: program.providerid,
                            name: program.providername ? (0, stripSurroundingQuotes_1.stripSurroundingQuotes)(program.providername) : "",
                            url: (_a = program.website) !== null && _a !== void 0 ? _a : "",
                            contactName: program.contactfirstname && program.contactlastname
                                ? `${(0, stripSurroundingQuotes_1.stripSurroundingQuotes)(program.contactfirstname)} ${(0, stripSurroundingQuotes_1.stripSurroundingQuotes)(program.contactlastname)}`
                                : "",
                            contactTitle: (0, stripSurroundingQuotes_1.stripSurroundingQuotes)((_b = program.contacttitle) !== null && _b !== void 0 ? _b : ""),
                            phoneNumber: (_c = program.phone) !== null && _c !== void 0 ? _c : "",
                            phoneExtension: (_d = program.phoneextension) !== null && _d !== void 0 ? _d : "",
                            county: formatCounty(program.county),
                            address: {
                                street1: (0, stripSurroundingQuotes_1.stripSurroundingQuotes)((_e = program.street1) !== null && _e !== void 0 ? _e : ""),
                                street2: (0, stripSurroundingQuotes_1.stripSurroundingQuotes)((_f = program.street2) !== null && _f !== void 0 ? _f : ""),
                                city: (_g = program.city) !== null && _g !== void 0 ? _g : "",
                                state: (_h = program.state) !== null && _h !== void 0 ? _h : "",
                                zipCode: program.zip ? (0, formatZipCode_1.formatZip)(program.zip) : "",
                            },
                        },
                        description: (0, stripSurroundingQuotes_1.stripSurroundingQuotes)((0, stripUnicode_1.stripUnicode)((_j = program.description) !== null && _j !== void 0 ? _j : "")),
                        certifications: program.industrycredentialname,
                        prerequisites: formatPrerequisites(program.prerequisites),
                        calendarLength: program.calendarlengthid
                            ? parseInt(program.calendarlengthid)
                            : CalendarLength_1.CalendarLength.NULL,
                        totalClockHours: parseInt(program.totalclockhours),
                        occupations: matchingOccupations.map((it) => ({
                            title: it.title,
                            soc: it.soc,
                        })),
                        inDemand: !!program.indemandcip,
                        localExceptionCounty: localExceptionCounties,
                        tuitionCost: parseFloat(program.tuition),
                        feesCost: parseFloat(program.fees),
                        booksMaterialsCost: parseFloat(program.booksmaterialscost),
                        suppliesToolsCost: parseFloat(program.suppliestoolscost),
                        otherCost: parseFloat(program.othercosts),
                        totalCost: parseFloat(program.totalcost),
                        online: !!program.onlineprogramid,
                        percentEmployed: formatPercentEmployed(program.peremployed2),
                        averageSalary: formatAverageSalary(program.avgquarterlywage2),
                        hasEveningCourses: (0, exports.mapStrNumToBool)(program.eveningcourses),
                        languages: (0, exports.formatLanguages)(program.languages),
                        isWheelchairAccessible: (0, exports.mapStrNumToBool)(program.accessfordisabled),
                        hasJobPlacementAssistance: (0, exports.mapStrNumToBool)(program.personalassist),
                        hasChildcareAssistance: (0, exports.mapStrNumToBool)(program.childcare) ||
                            (0, exports.mapStrNumToBool)(program.assistobtainingchildcare),
                    };
                }
                catch (error) {
                    console.error(`Error while processing program id ${program.programid}: `, error);
                    Sentry.withScope((scope) => {
                        scope.setLevel("error");
                        scope.setExtra("programId", program.programid);
                        Sentry.captureException(error);
                    });
                    throw error;
                }
            })))).filter((item) => item !== null);
        }
        catch (error) {
            console.error(`Error while fetching programs: `, error);
            Sentry.withScope((scope) => {
                scope.setLevel("error");
                scope.setExtra("selector", selector);
                Sentry.captureException(error);
            });
            throw error;
        }
    });
};
exports.findTrainingsByFactory = findTrainingsByFactory;
const NAN_INDICATOR = "-99999";
const formatCounty = (county) => {
    const SELECT_ONE = "Select One";
    if (!county || county === SELECT_ONE) {
        return "";
    }
    return `${county} County`;
};
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
const formatPrerequisites = (prereq) => {
    if (!prereq)
        return "";
    if (prereq.match(/None/i)) {
        return "";
    }
    return (0, stripSurroundingQuotes_1.stripSurroundingQuotes)(prereq);
};
const mapStrNumToBool = (value) => {
    return value === "1";
};
exports.mapStrNumToBool = mapStrNumToBool;
const formatLanguages = (languages) => {
    if (languages == null || languages.length === 0)
        return [];
    const languagesWithoutQuotes = languages.replace(/["\s]+/g, "");
    return languagesWithoutQuotes.split(",");
};
exports.formatLanguages = formatLanguages;
