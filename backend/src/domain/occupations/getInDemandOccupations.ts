import { DataClient } from "../DataClient";
import { GetInDemandOccupations } from "../types";
import { InDemandOccupation, Occupation } from "./Occupation";
import { stripOccupations } from "../utils/stripOccupations";
import { NullableOccupation } from "../training/Program";
import {convertToTitleCaseIfUppercase} from "../utils/convertToTitleCaseIfUppercase";

export const getInDemandOccupationsFactory = (dataClient: DataClient): GetInDemandOccupations => {
  const removeDuplicateSocs = (occupationTitles: Occupation[]): Occupation[] => {
    return occupationTitles.filter(
        (value, index, array) => array.findIndex((it) => it.soc === value.soc) === index
    );
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

  return async (): Promise<InDemandOccupation[]> => {
    const inDemandOccupations = await dataClient.getOccupationsInDemand();
    const expandedInDemand: (Occupation & { counties?: string[] })[] = removeDuplicateSocs(
        await expand2010SocsTo2018(inDemandOccupations)
    );

    // Get local exceptions (SOCs and corresponding counties)
    const localExceptions = await dataClient.getLocalExceptionsBySoc();

    // Add counties to local exceptions in the expandedInDemand array
    for (const exception of localExceptions) {
      const matchingOccupation = expandedInDemand.find((occupation) => occupation.soc === exception.soc);
      if (matchingOccupation) {
        if (!matchingOccupation.counties) {
          matchingOccupation.counties = [];
        }
        matchingOccupation.counties.push(exception.county);
      } else {
        expandedInDemand.push({
          soc: exception.soc,
          title: exception.title,
          counties: [exception.county],
        });
      }
    }

    return Promise.all(
        expandedInDemand.map(async (occupationTitle) => {
          const initialCode = occupationTitle.soc.split("-")[0];
          const majorGroupSoc = initialCode + "-0000";

          const majorGroup = await dataClient.findSocDefinitionBySoc(majorGroupSoc);

          // Remove duplicate counties
          const uniqueCounties = [...new Set(occupationTitle.counties?.map((c) => convertToTitleCaseIfUppercase(c)))];

          return {
            soc: occupationTitle.soc,
            title: occupationTitle.title,
            majorGroup: stripOccupations(majorGroup.title),
            counties: uniqueCounties,
          };
        })
    );
  };
};
