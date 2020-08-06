import { Status, TrainingResult } from "./Training";
import { DataClient } from "./DataClient";
import { SearchTrainings } from "./types";
import { stripSurroundingQuotes } from "./stripSurroundingQuotes";
import { convertToTitleCase } from "./convertToTitleCase";

export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (searchQuery?: string): Promise<TrainingResult[]> => {
    let trainingResults;

    if (searchQuery) {
      const ids: string[] = await dataClient.search(searchQuery);
      trainingResults = await dataClient.findTrainingResultsByIds(ids);
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

          if (searchQuery) {
            highlight = await dataClient.getHighlight(trainingResult.id, searchQuery);
          }

          return {
            ...trainingResult,
            name: stripSurroundingQuotes(trainingResult.name),
            provider: {
              ...trainingResult.provider,
              name: stripSurroundingQuotes(trainingResult.provider.name),
            },
            highlight: highlight,
            localExceptionCounty: trainingResult.localExceptionCounty.map(convertToTitleCase),
          };
        })
    );
  };
};
