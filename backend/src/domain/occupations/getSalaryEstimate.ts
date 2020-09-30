import { DataClient } from "../DataClient";
import { GetSalaryEstimate } from "../types";

export const getSalaryEstimateFactory = (dataClient: DataClient): GetSalaryEstimate => {
  return async (soc: string): Promise<number | null> => {
    try {
      const oesCode = (await dataClient.getOESOccupationBySoc(soc)).soc;
      const dirtyText = await dataClient.getSalaryEstimateBySoc(oesCode);
      return parseInt(dirtyText.mediansalary.replace(",", ""));
    } catch {
      return null;
    }
  };
};
