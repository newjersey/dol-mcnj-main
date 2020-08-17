import {TrainingDataClient} from "../training/TrainingDataClient";
import {SearchClient, SearchResult} from "../../database/search/SearchClient";
import {convertToTitleCase} from "../utils/convertToTitleCase";
import {stripUnicode} from "../utils/stripUnicode";
import {stripSurroundingQuotes} from "../utils/stripSurroundingQuotes";
import {SearchTrainings} from "../types";
import {TrainingResult} from "./TrainingResult";
import {ApprovalStatus} from "../ApprovalStatus";


export const searchTrainingsFactory = (
  dataClient: TrainingDataClient,
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
            training.status !== ApprovalStatus.SUSPENDED &&
            training.status !== ApprovalStatus.PENDING &&
            training.provider.status !== ApprovalStatus.SUSPENDED &&
            training.provider.status !== ApprovalStatus.PENDING
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
