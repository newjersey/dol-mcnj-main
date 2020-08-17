import {stripSurroundingQuotes} from "../utils/stripSurroundingQuotes";
import {stripUnicode} from "../utils/stripUnicode";
import {convertToTitleCase} from "../utils/convertToTitleCase";
import {FindTrainingById} from "../types";
import {TrainingDataClient} from "./TrainingDataClient";
import {Training} from "./Training";


export const findTrainingByIdFactory = (dataClient: TrainingDataClient): FindTrainingById => {
  return async (id?: string): Promise<Training> => {
    if (!id) {
      return Promise.reject("id is empty or undefined");
    }

    return dataClient.findTrainingById(id as string).then((training) => ({
      ...training,
      name: stripSurroundingQuotes(training.name),
      description: stripSurroundingQuotes(stripUnicode(training.description)),
      localExceptionCounty: training.localExceptionCounty.map(convertToTitleCase),
    }));
  };
};
