import {Occupation, OccupationDetail, OccupationDetailPartial} from "./Occupation";
import {LocalException, NullableOccupation} from "../training/Program";
import {
    FindTrainingsBy,
    GetEducationText, GetOccupationDetailByCIP,
    GetOccupationDetailPartial,
    GetOpenJobsCount,
    GetSalaryEstimate
} from "../types";
import {DataClient} from "../DataClient";
import {convertToTitleCaseIfUppercase} from "../utils/convertToTitleCaseIfUppercase";
// import {convertTrainingToTrainingResult} from "../training/convertTrainingToTrainingResult";
// import {Training} from "../training/Training";
// import {Selector} from "../training/Selector";
import {TrainingResult} from "../training/TrainingResult";
import { searchTrainingsFactory } from "../search/searchTrainings";

export const getOccupationDetailByCIPFactory = (
    getOccupationDetailFromOnet: GetOccupationDetailPartial,
    getEducationText: GetEducationText,
    getSalaryEstimate: GetSalaryEstimate,
    getOpenJobsCount: GetOpenJobsCount,
    findTrainingsBy: FindTrainingsBy,
    dataClient: DataClient,
): GetOccupationDetailByCIP => {
    return async (cip: string): Promise<OccupationDetail[]> => {
        const occupations = await dataClient.findOccupationsByCip(cip);
        const socs = occupations.map((it) => it.soc);

        // Collect details for all SOCs
        const occupationDetailsPromises = socs.map(async (soc) => {
            // Logic to check if an occupation is in demand
            const isInDemand = async (soc: string): Promise<boolean> => {
                const inDemandOccupations = await dataClient.getOccupationsInDemand();

                const expandedInDemand: (Occupation & { counties?: string[] })[] = removeDuplicateSocs(
                    await expand2010SocsTo2018(inDemandOccupations),
                );

                return expandedInDemand.map((it) => it.soc).includes(soc);
            };

            // Logic to expand 2010 SOCs to 2018
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

            // Logic to remove duplicate SOCs
            const removeDuplicateSocs = (occupationTitles: Occupation[]): Occupation[] => {
                return occupationTitles.filter(
                    (value, index, array) => array.findIndex((it) => it.soc === value.soc) === index,
                );            };

            // Logic to get local exception counties
            const getLocalExceptionCounties = async (soc: string): Promise<LocalException[]> => {
                const localExceptions = await dataClient.getLocalExceptionsBySoc();
                if (!localExceptions || localExceptions.length == 0) {
                    return [];
                }
                const matches = localExceptions.filter((e) => e.soc === soc);

                const uniqueCounties = new Set();
                const uniqueMatches: LocalException[] = [];

                matches.forEach((match) => {
                    const { county, ...rest } = match;
                    const transformedCounty = convertToTitleCaseIfUppercase(county);

                    if (!uniqueCounties.has(transformedCounty)) {
                        uniqueCounties.add(transformedCounty);
                        uniqueMatches.push({
                            county: transformedCounty,
                            ...rest,
                        });
                    }
                });

                return uniqueMatches;            };

            // Logic to get training results
            const getTrainingResults = async (soc: string): Promise<TrainingResult[]> => {
                // const cipDefinitions = await dataClient.findCipDefinitionBySoc2018(soc);
                // const cipcodes = cipDefinitions.map((it) => it.cipcode);
                // const trainings = await findTrainingsBy(Selector.CIP_CODE, cipcodes);
                // return trainings.map((training: Training) => {
                //   return convertTrainingToTrainingResult(training, "", 0);
                // });
                const trainings = await searchTrainingsFactory(dataClient)({searchQuery: soc, limit:4})
                return trainings.data
              };

            // Use original logic to assemble the OccupationDetail object for each SOC
            return getOccupationDetailFromOnet(soc)
                .then(async (onetOccupationDetail: OccupationDetailPartial) => {
                    const [inDemand, counties, openJobsCount, education, medianSalary, relatedTrainings] = await Promise.all([
                        isInDemand(soc),
                        getLocalExceptionCounties(soc),
                        getOpenJobsCount(soc),
                        getEducationText(soc),
                        getSalaryEstimate(soc),
                        getTrainingResults(soc),
                    ]);
                    return {
                        ...onetOccupationDetail,
                        education: education,
                        inDemand: inDemand,
                        counties: counties.map((l) => l.county),
                        medianSalary: medianSalary,
                        openJobsCount: openJobsCount,
                        openJobsSoc: soc,
                        relatedTrainings: relatedTrainings,
                    };
                })
                .catch(async (error) => {
                    console.error("Error fetching occupation detail for SOC: " + soc + "; Error: ", error);

                    // Return a default OccupationDetail object
                    return {
                        soc: soc, // Keep the SOC code for which the error occurred
                        title: "Not Available", // Indicate that the title is not available
                        description: "Details not available due to an error.",
                        tasks: [],
                        education: "Unknown",
                        inDemand: false, // Assume not in demand if data is unavailable
                        counties: [],
                        medianSalary: null,
                        openJobsCount: null,
                        relatedOccupations: [],
                        relatedTrainings: [],
                    };                });
        });

        return Promise.all(occupationDetailsPromises);
    };
};
