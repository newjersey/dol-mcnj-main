import { DataClient } from "../DataClient";
import { GetSalaryEstimate } from "../types";

/**
 * Factory function that creates a salary estimate calculator for New Jersey.
 * 
 * Fetches median salary data from OES (Occupational Employment Statistics) database
 * for occupations in New Jersey. Returns null if salary data is unavailable.
 * 
 * @param dataClient - Database client for querying OES salary data
 * @returns Function that retrieves median salary as integer for a given SOC code
 * 
 * @example
 * ```typescript
 * const getSalaryEstimate = getSalaryEstimateFactory(postgresClient);
 * const salary = await getSalaryEstimate('15-1252');
 * // Returns: 120000 (median annual salary in NJ)
 * ```
 */
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
