import {
    GetOccupationDetail,
    GetOccupationDetailPartial,
    GetEducationText,
    GetSalaryEstimate,
    GetOpenJobsCount,
    FindTrainingsBy,
} from "../types";
import {Occupation, OccupationDetail, OccupationDetailPartial } from "./Occupation";
import { DataClient } from "../DataClient";
import { Selector } from "../training/Selector";
import { convertTrainingToTrainingResult } from "../training/convertTrainingToTrainingResult";
import { Training } from "../training/Training";
import { TrainingResult } from "../training/TrainingResult";
import {LocalException, NullableOccupation} from "../training/Program";
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

            const expandedInDemand: (Occupation & { counties?: string[] })[] = removeDuplicateSocs(
                await expand2010SocsTo2018(inDemandOccupations)
            );

            return expandedInDemand.map((it) => it.soc).includes(soc);
        };

        const expand2010SocsTo2018 = async (occupations: NullableOccupation[]): Promise<Occupation[]> => {
            let expanded: Occupation[] = [];

            for (const occupation of occupations) {
                if (!occupation.title) {
                    const socs2018 = await dataClient.find2018OccupationsBySoc2010(occupation.soc);
                    expanded = [...expanded, ...socs2018];
                } else {
                    expanded.push({
                        ...occupation,
                        title: occupation.title as string,
                    });
                }
            }

            return expanded;
        };

        const removeDuplicateSocs = (occupationTitles: Occupation[]): Occupation[] => {
            return occupationTitles.filter(
                (value, index, array) => array.findIndex((it) => it.soc === value.soc) === index
            );
        };

        const getLocalExceptionCounties = async (soc: string): Promise<LocalException[]> => {
            const localExceptions = await dataClient.getLocalExceptionsBySoc();
            if (!localExceptions || localExceptions.length == 0) {
                return [];
            }
            const matches = localExceptions.filter(e => e.soc === soc);

            const transformedMatches = matches.map((match) => {
                const { county, ...rest } = match;
                const transformedCounty = convertToTitleCaseIfUppercase(county);

                return {
                    county: transformedCounty,
                    ...rest
                };
            });

            const deduplicatedMatches: LocalException[] = transformedMatches.reduce((acc: LocalException[], current: LocalException) => {
                const x = acc.find(item => item.county === current.county);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, [] as LocalException[]);


            return deduplicatedMatches;
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
                console.log('getOccupationDetailFromOnet failed');
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
