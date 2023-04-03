import { Training } from "./Training";
import { TrainingResult } from "../training/TrainingResult";
import { stripUnicode } from "../utils/stripUnicode";

export const convertTrainingToTrainingResult = (
  training: Training,
  highlight: string,
  rank: number
): TrainingResult => {
  return {
    id: training.id,
    name: training.name,
    cipCode: training.cipCode,
    totalCost: training.totalCost,
    percentEmployed: training.percentEmployed,
    calendarLength: training.calendarLength,
    localExceptionCounty: training.localExceptionCounty,
    online: training.online,
    providerId: training.provider.id,
    providerName: training.provider.name,
    cities: training.provider.addresses ? training.provider.addresses.map(a => a.city) : [],
    zipCodes: training.provider.addresses ? training.provider.addresses.map(a => a.zipCode) : [],
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
