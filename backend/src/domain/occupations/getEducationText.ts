import { DataClient } from "../DataClient";
import { GetEducationText } from "../types";

/**
 * Factory function that creates an education requirement text generator.
 * 
 * Fetches and extracts education requirements from OES (Occupational Employment Statistics) data.
 * Parses HTML to extract clean education text. Returns empty string if data unavailable.
 * 
 * @param dataClient - Database client for querying OES occupation and education data
 * @returns Function that retrieves formatted education text for a given SOC code
 * 
 * @example
 * ```typescript
 * const getEducationText = getEducationTextFactory(postgresClient);
 * const text = await getEducationText('15-1252');
 * // Returns: "Software developers typically need a bachelor's degree in computer science..."
 * ```
 */
export const getEducationTextFactory = (dataClient: DataClient): GetEducationText => {
  return async (soc: string): Promise<string> => {
    try {
      const oesCode = (await dataClient.getOESOccupationBySoc(soc)).soc;
      const dirtyText = await dataClient.getEducationTextBySoc(oesCode);
      return dirtyText.howtobecomeone.split("<p>")[1].split("</p>")[0];
    } catch {
      return "";
    }
  };
};
