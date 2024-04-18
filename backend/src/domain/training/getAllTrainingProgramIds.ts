import { stripSurroundingQuotes } from "../utils/stripSurroundingQuotes";
import { stripUnicode } from "../utils/stripUnicode";
import { convertToTitleCaseIfUppercase } from "../utils/convertToTitleCaseIfUppercase";
import { formatZip } from "../utils/formatZipCode";
import {FindTrainingsBy, GetAllTrainingProgramIds} from "../types";
import { Training } from "./Training";
import { CalendarLength } from "../CalendarLength";
import { Program } from "./Program";
import { DataClient } from "../DataClient";
import { Selector } from "./Selector";
import * as Sentry from "@sentry/node";

export const getAllTrainingProgramIds = (dataClient: DataClient): GetAllTrainingProgramIds => {
    return async (): Promise<string[]> => {
        try {
            const programids = await dataClient.getAllTrainingProgramIds();

            return programids;
        } catch (error) {
            console.error(`Error while fetching program ids: `, error);

            Sentry.withScope((scope) => {
                scope.setLevel("error");
                Sentry.captureException(error);
            });

            throw error;
        }
    };
};
