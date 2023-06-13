import {
    GetOccupationDetail,
    GetOccupationDetailPartial,
    GetEducationText,
    GetSalaryEstimate,
    GetOpenJobsCount,
    FindTrainingsBy,
} from "../types";
import { OccupationDetail, OccupationDetailPartial } from "./Occupation";
import { DataClient } from "../DataClient";
import { Selector } from "../training/Selector";
import { convertTrainingToTrainingResult } from "../training/convertTrainingToTrainingResult";
import { Training } from "../training/Training";
import { TrainingResult } from "../training/TrainingResult";
import {LocalException} from "../training/Program";
import {convertToTitleCaseIfUppercase} from "../utils/convertToTitleCaseIfUppercase";

export const getOccupationDetailFactory = (
    getOccupationDetailFromOnet: GetOccupationDetailPartial,
    getEducationText: GetEducationText,
    getSalaryEstimate: GetSalaryEstimate,
    getOpenJobsCount: GetOpenJobsCount,
    findTrainingsBy: FindTrainingsBy,
    dataClient: DataClient
): GetOccupationDetail => {
    return async (soc: string): Promise<OccupationDetail> => {
        const isInDemand = async (soc: string): Promise<boolean> => {
            const inDemandOccupations = await dataClient.getOccupationsInDemand();
            return inDemandOccupations.map((it) => it.soc).includes(soc);
        };

        const getLocalExceptionCounties = async (soc: string): Promise<LocalException[]> => {
            const localExceptions = await dataClient.getLocalExceptionsBySoc();
            const matches = localExceptions.filter(e => e.soc === soc);

            const transformedMatches = matches.map((match) => {
                const { county, ...rest } = match;
                const transformedCounty = convertToTitleCaseIfUppercase(county);

                return {
                    county: transformedCounty,
                    ...rest
                };
            });

            return transformedMatches;
        };

        const getTrainingResults = async (soc: string): Promise<TrainingResult[]> => {
            const cipDefinitions = await dataClient.findCipDefinitionBySoc2018(soc);
            const cipcodes = cipDefinitions.map((it) => it.cipcode);
            const trainings = await findTrainingsBy(Selector.CIP_CODE, cipcodes);

            return trainings.map((training: Training) => {
                return convertTrainingToTrainingResult(training, "", 0);
            });
        };

        return getOccupationDetailFromOnet(soc)
            .then((onetOccupationDetail: OccupationDetailPartial) => {
                return Promise.all([
                    isInDemand(soc),
                    getLocalExceptionCounties(soc),
                    getOpenJobsCount(soc),
                    getEducationText(soc),
                    getSalaryEstimate(soc),
                    getTrainingResults(soc),
                ]).then(([inDemand, counties, openJobsCount, education, medianSalary, relatedTrainings]) => {
                    return {
                        ...onetOccupationDetail,
                        education: education,
                        inDemand: inDemand,
                        counties: counties.map(l => l.county),
                        medianSalary: medianSalary,
                        openJobsCount: openJobsCount,
                        openJobsSoc: soc,
                        relatedTrainings: relatedTrainings,
                    };
                });
            })
            .catch(async () => {
                const occupationTitles2010 = await dataClient.find2010OccupationsBySoc2018(soc);

                if (occupationTitles2010.length === 1) {
                    const soc2010 = occupationTitles2010[0].soc;

                    return Promise.all([
                        getOccupationDetailFromOnet(soc2010),
                        isInDemand(soc2010),
                        getLocalExceptionCounties(soc2010),
                        getOpenJobsCount(soc2010),
                        getEducationText(soc),
                        getSalaryEstimate(soc),
                        getTrainingResults(soc),
                    ]).then(
                        ([
                             onetOccupationDetail,
                             inDemand,
                             counties,
                             openJobsCount,
                             education,
                             medianSalary,
                             relatedTrainings,
                         ]) => {
                            return {
                                ...onetOccupationDetail,
                                soc: soc,
                                education: education,
                                inDemand: inDemand,
                                localExceptionCounties: counties,
                                medianSalary: medianSalary,
                                openJobsCount: openJobsCount,
                                openJobsSoc: soc2010,
                                relatedTrainings: relatedTrainings,
                            };
                        }
                    );
                } else {
                    return Promise.all([
                        dataClient.findSocDefinitionBySoc(soc),
                        isInDemand(soc),
                        getLocalExceptionCounties(soc),
                        getOpenJobsCount(soc),
                        getEducationText(soc),
                        getSalaryEstimate(soc),
                        dataClient.getNeighboringOccupations(soc),
                        getTrainingResults(soc),
                    ]).then(
                        ([
                             socDefinition,
                             inDemand,
                             counties,
                             openJobsCount,
                             education,
                             medianSalary,
                             neighboringOccupations,
                             relatedTrainings,
                         ]) => {
                            return {
                                soc: socDefinition.soc,
                                title: socDefinition.title,
                                description: socDefinition.definition,
                                tasks: [],
                                education: education,
                                inDemand: inDemand,
                                localExceptionCounties: counties,
                                medianSalary: medianSalary,
                                openJobsCount: openJobsCount,
                                relatedOccupations: neighboringOccupations,
                                relatedTrainings: relatedTrainings,
                            };
                        }
                    );
                }
            });
    };
};
