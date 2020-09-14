import { GetOccupationDetail, GetOccupationDetailPartial, GetEducationText } from "../types";
import { OccupationDetail, OccupationDetailPartial } from "./Occupation";
import { DataClient } from "../DataClient";

export const getOccupationDetailFactory = (
  getOccupationDetailFromOnet: GetOccupationDetailPartial,
  getEducationText: GetEducationText,
  dataClient: DataClient
): GetOccupationDetail => {
  return async (soc: string): Promise<OccupationDetail> => {
    const education = await getEducationText(soc);
    return getOccupationDetailFromOnet(soc)
      .then((onetOccupationDetail: OccupationDetailPartial) => {
        return {
          ...onetOccupationDetail,
          education: education,
        };
      })
      .catch(async () => {
        const occupationTitles2010 = await dataClient.find2010OccupationTitlesBySoc2018(soc);

        if (occupationTitles2010.length === 1) {
          const onetOccupationDetail = await getOccupationDetailFromOnet(
            occupationTitles2010[0].soc
          );

          return {
            ...onetOccupationDetail,
            soc: soc,
            education: education,
          };
        } else {
          const socDefinition = await dataClient.findSocDefinitionBySoc(soc);

          return {
            soc: socDefinition.soc,
            title: socDefinition.soctitle,
            description: socDefinition.socdefinition,
            tasks: [],
            education: education,
          };
        }
      });
  };
};
