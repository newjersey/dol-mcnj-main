import { DataClient } from "./DataClient";
import { FindTrainingById } from "./types";
import { Training } from "./Training";
import { stripSurroundingQuotes } from "./stripSurroundingQuotes";

export const findTrainingByIdFactory = (dataClient: DataClient): FindTrainingById => {
  return async (id?: string): Promise<Training> => {
    if (!id) {
      return Promise.reject("id is empty or undefined");
    }

    return dataClient.findTrainingById(id as string).then((training) => ({
      ...training,
      name: stripSurroundingQuotes(training.name),
      description: stripSurroundingQuotes(training.description),
    }));
  };
};
