import {
  GetOccupationDetail,
  GetOccupationDetailPartial,
  GetEducationText,
  GetSalaryEstimate,
  GetOpenJobsCount,
} from "../types";
import { OccupationDetail, OccupationDetailPartial } from "./Occupation";
import { DataClient } from "../DataClient";

export const getOccupationDetailFactory = (
  getOccupationDetailFromOnet: GetOccupationDetailPartial,
  getEducationText: GetEducationText,
  getSalaryEstimate: GetSalaryEstimate,
  getOpenJobsCount: GetOpenJobsCount,
  dataClient: DataClient
): GetOccupationDetail => {
  return async (soc: string): Promise<OccupationDetail> => {
    const isInDemand = async (soc: string): Promise<boolean> => {
      const inDemandOccupations = await dataClient.getOccupationsInDemand();
      return inDemandOccupations.map((it) => it.soc).includes(soc);
    };

    return getOccupationDetailFromOnet(soc)
      .then((onetOccupationDetail: OccupationDetailPartial) => {
        return Promise.all([
          isInDemand(soc),
          getOpenJobsCount(soc),
          getEducationText(soc),
          getSalaryEstimate(soc),
        ]).then(([inDemand, openJobsCount, education, medianSalary]) => {
          return {
            ...onetOccupationDetail,
            education: education,
            inDemand: inDemand,
            medianSalary: medianSalary,
            openJobsCount: openJobsCount,
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
          ]).then(([onetOccupationDetail, inDemand, openJobsCount, education, medianSalary]) => {
            return {
              ...onetOccupationDetail,
              soc: soc,
              education: education,
              inDemand: inDemand,
              medianSalary: medianSalary,
              openJobsCount: openJobsCount,
            };
          });
        } else {
          return Promise.all([
            dataClient.findSocDefinitionBySoc(soc),
            isInDemand(soc),
            getOpenJobsCount(soc),
            getEducationText(soc),
            getSalaryEstimate(soc),
            dataClient.getNeighboringOccupations(soc),
          ]).then(
            ([
              socDefinition,
              inDemand,
              openJobsCount,
              education,
              medianSalary,
              neighboringOccupations,
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
              };
            }
          );
        }
      });
  };
};
