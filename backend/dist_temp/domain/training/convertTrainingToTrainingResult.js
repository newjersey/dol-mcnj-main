"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTrainingToTrainingResult = void 0;
const stripUnicode_1 = require("../utils/stripUnicode");
const convertTrainingToTrainingResult = (training, highlight, rank) => {
    var _a, _b;
    return {
        ctid: training.ctid,
        name: training.name,
        cipDefinition: training.cipDefinition,
        totalCost: training.totalCost,
        percentEmployed: training.percentEmployed,
        calendarLength: training.calendarLength,
        totalClockHours: training.totalClockHours,
        localExceptionCounty: training.localExceptionCounty,
        deliveryTypes: training.deliveryTypes,
        providerId: ((_a = training.provider) === null || _a === void 0 ? void 0 : _a.ctid) || null,
        providerName: ((_b = training.provider) === null || _b === void 0 ? void 0 : _b.name) || "Provider not available",
        availableAt: training.availableAt,
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
};
exports.convertTrainingToTrainingResult = convertTrainingToTrainingResult;
