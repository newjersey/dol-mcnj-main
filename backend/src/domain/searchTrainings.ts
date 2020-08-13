import { Status, TrainingResult } from "./Training";
import { DataClient } from "./DataClient";
import { SearchTrainings } from "./types";
import { stripSurroundingQuotes } from "./stripSurroundingQuotes";
import { convertToTitleCase } from "./convertToTitleCase";
import { SearchClient, SearchResult } from "./SearchClient";
import { stripUnicode } from "./stripUnicode";

export const searchTrainingsFactory = (
  dataClient: DataClient,
  searchClient: SearchClient
): SearchTrainings => {
  return async (searchQuery?: string): Promise<TrainingResult[]> => {
    let trainingResults: TrainingResult[];
    let searchResults: SearchResult[];

    if (searchQuery) {
      searchResults = await searchClient.search(searchQuery);
      trainingResults = await dataClient.findTrainingResultsByIds(searchResults.map((it) => it.id));
    } else {
      trainingResults = await dataClient.findAllTrainingResults();
    }

    return Promise.all(
      trainingResults
        .filter(
          (training) =>
            training.status !== Status.SUSPENDED &&
            training.status !== Status.PENDING &&
            training.provider.status !== Status.SUSPENDED &&
            training.provider.status !== Status.PENDING
        )
        .map(async (trainingResult) => {
          let highlight = "";
          let rank = 0;

          if (searchQuery) {
            highlight = await searchClient.getHighlight(trainingResult.id, searchQuery);
          }

          if (searchResults) {
            const foundRank = searchResults.find((it) => it.id === trainingResult.id)?.rank;
            if (foundRank) {
              rank = foundRank;
            }
          }

          return {
            ...trainingResult,
            name: stripSurroundingQuotes(trainingResult.name),
            provider: {
              ...trainingResult.provider,
              name: stripSurroundingQuotes(trainingResult.provider.name),
            },
            highlight: stripUnicode(highlight),
            rank: rank,
            localExceptionCounty: trainingResult.localExceptionCounty.map(convertToTitleCase),
          };
        })
    );
  };
};
