import { TrainingResult, Status } from "./Training";
import { DataClient } from "./DataClient";
import { SearchTrainings } from "./types";

export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (searchQuery?: string): Promise<TrainingResult[]> => {
    if (!searchQuery) {
      return await dataClient.findAllTrainings();
    }

    const matchingIds = await dataClient.search(searchQuery);

    return dataClient
      .findTrainingsByIds(matchingIds)
      .then((trainings: TrainingResult[]): TrainingResult[] => {
        return trainings.filter(
          (training) =>
            training.status !== Status.SUSPENDED && training.provider.status !== Status.SUSPENDED
        );
      });
  };
};
