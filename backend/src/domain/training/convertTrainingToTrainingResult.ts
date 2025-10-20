import { Training } from "./Training";
import { TrainingResult } from "../training/TrainingResult";
import { stripUnicode } from "../utils/stripUnicode";

/**
 * Converts a full Training object to a simplified TrainingResult for search results display.
 * 
 * This function extracts only the fields needed for search result cards, reducing payload size
 * and improving frontend performance. Used extensively in training search endpoints.
 * 
 * @param training - Complete training program object with full details
 * @param highlight - Search highlight text to display (from full-text search)
 * @param rank - Search relevance rank for ordering results
 * @returns Simplified training result object optimized for list display
 * 
 * @example
 * ```typescript
 * const result = convertTrainingToTrainingResult(training, "Web Development", 1);
 * // Returns: { id, name, totalCost, percentEmployed, ... }
 * ```
 */
export const convertTrainingToTrainingResult = (
  training: Training,
  highlight: string,
  rank: number,
): TrainingResult => {
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
