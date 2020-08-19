import {DataClient} from "../training/DataClient";
import {GetInDemandOccupations} from "../types";
import {Occupation} from "./Occupation";

export const getInDemandOccupationsFactory = (dataClient: DataClient): GetInDemandOccupations => {
  return async (): Promise<Occupation[]> => {
    const inDemandOccupations = await dataClient.getInDemandOccupationTitles();

    return Promise.all(inDemandOccupations.map(async (occupationTitle) => {
      const initialCode = occupationTitle.soc.split('-')[0]
      const majorGroupSoc = initialCode + '-0000';

      const majorGroup = await dataClient.findOccupationTitleBySoc(majorGroupSoc);
      return {
        soc: occupationTitle.soc,
        title: occupationTitle.soctitle,
        majorGroup: majorGroup.soctitle
      }
    }))
  }
}