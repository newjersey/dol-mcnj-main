/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { TrainingResult, Status } from "./Training";
import { DataClient } from "./DataClient";
import { SearchTrainings } from "./types";
import { stripSurroundingQuotes } from "./stripSurroundingQuotes";
import { convertToTitleCase } from "./convertToTitleCase";

export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (searchQuery?: string): Promise<TrainingResult[]> => {
    let trainingResultsPromise;
    let highlightsPromise;

    if (searchQuery) {
      const ids: string[] = await dataClient.search(searchQuery);
      trainingResultsPromise = dataClient.findTrainingResultsByIds(ids);
      highlightsPromise = dataClient.getHighlights(ids, searchQuery);
    } else {
      trainingResultsPromise = dataClient.findAllTrainingResults();
      highlightsPromise = Promise.resolve([]);
    }

    return Promise.all([trainingResultsPromise, highlightsPromise]).then(
      ([trainingResults, highlights]) => {
        return trainingResults
          .map((training, index) => ({
            ...training,
            name: stripSurroundingQuotes(training.name),
            provider: {
              ...training.provider,
              name: stripSurroundingQuotes(training.provider.name),
            },
            highlight: highlights?.length > 0 ? highlights[index] : "",
            localExceptionCounty: training.localExceptionCounty.map(convertToTitleCase),
          }))
          .filter(
            (training) =>
              training.status !== Status.SUSPENDED &&
              training.status !== Status.PENDING &&
              training.provider.status !== Status.SUSPENDED &&
              training.provider.status !== Status.PENDING
          );
      }
    );
  };
};
