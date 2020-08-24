import { stripUnicode } from "../utils/stripUnicode";
import { FindTrainingsByIds, SearchTrainings } from "../types";
import { TrainingResult } from "./TrainingResult";
import { Training } from "../training/Training";
import { SearchClient } from "./SearchClient";

export const searchTrainingsFactory = (
  findTrainingsByIds: FindTrainingsByIds,
  searchClient: SearchClient
): SearchTrainings => {
  return async (searchQuery: string): Promise<TrainingResult[]> => {
    const searchResults = await searchClient.search(searchQuery);
    const trainings = await findTrainingsByIds(searchResults.map((it) => it.id));

    return Promise.all(
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

        return {
          id: training.id,
          name: training.name,
          totalCost: training.totalCost,
          percentEmployed: training.percentEmployed,
          calendarLength: training.calendarLength,
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
        };
      })
    );
  };
};
