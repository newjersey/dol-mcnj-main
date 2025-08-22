"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTrainingToTrainingResult = void 0;
const stripUnicode_1 = require("../utils/stripUnicode");
const convertTrainingToTrainingResult = (training, highlight, rank) => {
    return {
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
};
exports.convertTrainingToTrainingResult = convertTrainingToTrainingResult;
