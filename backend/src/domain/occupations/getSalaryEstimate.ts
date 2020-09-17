import { DataClient } from "../DataClient";
import { GetSalaryEstimate } from "../types";

export const getSalaryEstimateFactory = (dataClient: DataClient): GetSalaryEstimate => {
  return async (soc: string): Promise<number | null> => {
    try {
      const dirtyText = await dataClient.getSalaryEstimateBySoc(soc);
      return parseInt(dirtyText.mediansalary.replace(",", ""));
    } catch {
      return null;
    }
  };
};
