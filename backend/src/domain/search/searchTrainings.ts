import { stripUnicode } from "../utils/stripUnicode";
import { FindTrainingsBy, SearchTrainings } from "../types";
import { TrainingResult } from "../training/TrainingResult";
import { Training } from "../training/Training";
import { SearchClient } from "./SearchClient";
import { Selector } from "../training/Selector";
import * as Sentry from "@sentry/node";

/**
 * Factory function that creates a full-text training program search function.
 * 
 * Powers the main training search experience. Executes PostgreSQL full-text search,
 * retrieves matching programs, and enriches results with search highlights and relevance ranks.
 * Handles both keyword search and CIP code lookup.
 * 
 * @param findTrainingsBy - Function to retrieve full training details by IDs
 * @param searchClient - PostgreSQL search client for full-text and CIP code searches
 * @returns Function that searches for training programs and returns simplified results with highlights
 * 
 * @example
 * ```typescript
 * const searchTrainings = searchTrainingsFactory(findTrainingsBy, postgresSearchClient);
 * const results = await searchTrainings('web development');
 * // Returns: [{ id, name, highlight: 'Learn <b>web development</b>...', rank: 1, ... }]
 * ```
 * 
 * @see {@link findTrainingsByFactory} for retrieving training details
 * @see {@link PostgresSearchClient} for search implementation
 */
export const searchTrainingsFactory = (
  findTrainingsBy: FindTrainingsBy,
  searchClient: SearchClient,
): SearchTrainings => {
  return async (searchQuery: string): Promise<TrainingResult[]> => {
    // Check for a blank query
    if (!searchQuery || searchQuery.trim() === "") {
      return [];
    }

    try {
      const searchResults = await searchClient.search(searchQuery);
      const trainings = await findTrainingsBy(
        Selector.ID,
        searchResults.map((it) => it.id),
      );

      return await Promise.all(
        trainings.map(async (training: Training) => {
          let highlight = "";
          let rank = 0;

          if (searchQuery) {
            highlight = await searchClient.getHighlight(training.id, searchQuery);
          }

          if (searchResults) {
            const foundRank = searchResults.find((it) => it.id === training.id)?.rank;
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
            highlight: stripUnicode(highlight),
            rank: rank,
            socCodes: training.occupations.map((o) => o.soc),
            hasEveningCourses: training.hasEveningCourses,
            languages: training.languages,
            isWheelchairAccessible: training.isWheelchairAccessible,
            hasJobPlacementAssistance: training.hasJobPlacementAssistance,
            hasChildcareAssistance: training.hasChildcareAssistance,
          };
          return result;
        }),
      );
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };
};
