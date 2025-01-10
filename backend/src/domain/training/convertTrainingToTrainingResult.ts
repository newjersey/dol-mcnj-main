import { Training } from "./Training";
import { TrainingResult } from "../training/TrainingResult";
import { stripUnicode } from "../utils/stripUnicode";

export const convertTrainingToTrainingResult = (
  training: Training,
  highlight: string,
  rank: number,
): TrainingResult => {
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
    providerId: training.provider?.ctid || null,
    providerName: training.provider?.name || "Provider not available",
    availableAt: training.availableAt,
    inDemand: training.inDemand,
    highlight: stripUnicode(highlight),
    rank: rank,
    socCodes: training.occupations.map((o) => o.soc),
    hasEveningCourses: training.hasEveningCourses,
    languages: training.languages,
    isWheelchairAccessible: training.isWheelchairAccessible,
    hasJobPlacementAssistance: training.hasJobPlacementAssistance,
    hasChildcareAssistance: training.hasChildcareAssistance,
  };
};
