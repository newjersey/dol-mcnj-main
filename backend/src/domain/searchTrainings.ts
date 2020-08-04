import { TrainingResult, Status } from "./Training";
import { DataClient } from "./DataClient";
import { SearchTrainings } from "./types";
import { stripSurroundingQuotes } from "./stripSurroundingQuotes";

export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (searchQuery?: string): Promise<TrainingResult[]> =>
    (searchQuery
      ? dataClient.search(searchQuery).then(dataClient.findTrainingResultsByIds)
      : dataClient.findAllTrainingResults()
    ).then((trainings: TrainingResult[]): TrainingResult[] => {
      return trainings
        .filter(
          (training) =>
            training.status !== Status.SUSPENDED &&
            training.status !== Status.PENDING &&
            training.provider.status !== Status.SUSPENDED &&
            training.provider.status !== Status.PENDING
        )
        .map((training) => ({
          ...training,
          name: stripSurroundingQuotes(training.name),
          provider: {
            ...training.provider,
            name: stripSurroundingQuotes(training.provider.name),
          },
        }));
    });
};
