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
          getOpenJobsCount(soc),
          getEducationText(soc),
          getSalaryEstimate(soc),
          getTrainingResults(soc),
        ]).then(([inDemand, openJobsCount, education, medianSalary, relatedTrainings]) => {
          return {
            ...onetOccupationDetail,
            education: education,
            inDemand: inDemand,
            medianSalary: medianSalary,
            openJobsCount: openJobsCount,
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
            getOpenJobsCount(soc2010),
            getEducationText(soc),
            getSalaryEstimate(soc),
            getTrainingResults(soc),
          ]).then(
            ([
              onetOccupationDetail,
              inDemand,
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
                medianSalary: medianSalary,
                openJobsCount: openJobsCount,
                relatedTrainings: relatedTrainings,
              };
            }
          );
        } else {
          return Promise.all([
            dataClient.findSocDefinitionBySoc(soc),
            isInDemand(soc),
            getOpenJobsCount(soc),
            getEducationText(soc),
            getSalaryEstimate(soc),
            dataClient.getNeighboringOccupations(soc),
            getTrainingResults(soc),
          ]).then(
            ([
              socDefinition,
              inDemand,
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
