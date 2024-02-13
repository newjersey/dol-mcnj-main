import { stripUnicode } from "../utils/stripUnicode";
import { FindTrainingsBy, SearchTrainings } from "../types";
import { TrainingResult } from "../training/TrainingResult";
import { Training } from "../training/Training";
import { SearchClient } from "./SearchClient";
import { Selector } from "../training/Selector";
import * as Sentry from "@sentry/node";

export const searchTrainingsFactory = (
  findTrainingsBy: FindTrainingsBy,
  searchClient: SearchClient,
): SearchTrainings => {
  return async (searchQuery: string): Promise<TrainingResult[]> => {
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
            cipCode: training.cipCode,
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
      console.error(`Failed to search for trainings with the query: ${searchQuery}`, error);
      Sentry.captureException(error);
      throw error;
    }
  };
};
