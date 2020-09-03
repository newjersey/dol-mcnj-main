import { GetOccupationDetail } from "../types";
import { OccupationDetail } from "./Occupation";
import { DataClient } from "../training/DataClient";

export const getOccupationDetailFactory = (
  getOccupationDetailFromOnet: GetOccupationDetail,
  dataClient: DataClient
): GetOccupationDetail => {
  return async (soc: string): Promise<OccupationDetail> => {
    return getOccupationDetailFromOnet(soc)
      .then((onetOccupationDetail: OccupationDetail) => {
        return onetOccupationDetail;
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
          };
        } else {
          const socDefinition = await dataClient.findSocDefinitionBySoc(soc);

          return {
            soc: socDefinition.soc,
            title: socDefinition.soctitle,
            description: socDefinition.socdefinition,
          };
        }
      });
  };
};
