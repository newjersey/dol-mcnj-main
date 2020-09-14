import { DataClient } from "../DataClient";
import { GetInDemandOccupations } from "../types";
import { Occupation } from "./Occupation";
import { NullableOccupationTitle, OccupationTitle } from "../training/Program";
import { stripOccupations } from "../utils/stripOccupations";

export const getInDemandOccupationsFactory = (dataClient: DataClient): GetInDemandOccupations => {
  const expand2010SocsTo2018 = async (
    occupationTitles: NullableOccupationTitle[]
  ): Promise<OccupationTitle[]> => {
    let expanded: OccupationTitle[] = [];
    for (const occupationTitle of occupationTitles) {
      if (!occupationTitle.soctitle) {
        const socs2018withBadTitles = await dataClient.find2018OccupationTitlesBySoc2010(
          occupationTitle.soc
        );
        const socs2018 = await Promise.all(
          socs2018withBadTitles.map(async (it) => await dataClient.findSocDefinitionBySoc(it.soc))
        );
        expanded = [...expanded, ...socs2018];
      } else {
        expanded.push({
          ...occupationTitle,
          soctitle: occupationTitle.soctitle as string,
        });
      }
    }

    return expanded;
  };

  return async (): Promise<Occupation[]> => {
    const inDemandOccupations = await dataClient.getInDemandOccupationTitles();
    const expandedInDemand = await expand2010SocsTo2018(inDemandOccupations);

    return Promise.all(
      expandedInDemand.map(async (occupationTitle) => {
        const initialCode = occupationTitle.soc.split("-")[0];
        const majorGroupSoc = initialCode + "-0000";

        const majorGroup = await dataClient.findSocDefinitionBySoc(majorGroupSoc);
        return {
          soc: occupationTitle.soc,
          title: occupationTitle.soctitle,
          majorGroup: stripOccupations(majorGroup.soctitle),
        };
      })
    );
  };
};
