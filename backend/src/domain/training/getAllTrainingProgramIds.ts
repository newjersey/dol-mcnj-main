import { GetAllTrainingProgramIds } from "../types";
import { DataClient } from "../DataClient";
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
