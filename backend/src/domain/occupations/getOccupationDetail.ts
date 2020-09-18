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
      const inDemandOccupations = await dataClient.getInDemandOccupationTitles();
      return inDemandOccupations.map((it) => it.soc).includes(soc);
    };

    const education = await getEducationText(soc);
    const medianSalary = await getSalaryEstimate(soc);

    return getOccupationDetailFromOnet(soc)
      .then(async (onetOccupationDetail: OccupationDetailPartial) => {
        return {
          ...onetOccupationDetail,
          education: education,
          inDemand: await isInDemand(soc),
          medianSalary: medianSalary,
          openJobsCount: await getOpenJobsCount(soc),
        };
      })
      .catch(async () => {
        const occupationTitles2010 = await dataClient.find2010OccupationTitlesBySoc2018(soc);

        if (occupationTitles2010.length === 1) {
          const soc2010 = occupationTitles2010[0].soc;
          const onetOccupationDetail = await getOccupationDetailFromOnet(soc2010);

          return {
            ...onetOccupationDetail,
            soc: soc,
            education: education,
            inDemand: await isInDemand(soc2010),
            medianSalary: medianSalary,
            openJobsCount: await getOpenJobsCount(soc2010),
          };
        } else {
          const socDefinition = await dataClient.findSocDefinitionBySoc(soc);

          return {
            soc: socDefinition.soc,
            title: socDefinition.soctitle,
            description: socDefinition.socdefinition,
            tasks: [],
            education: education,
            inDemand: await isInDemand(socDefinition.soc),
            medianSalary: medianSalary,
            openJobsCount: await getOpenJobsCount(socDefinition.soc),
          };
        }
      });
  };
};
