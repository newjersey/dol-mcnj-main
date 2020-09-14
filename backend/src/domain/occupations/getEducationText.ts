import { DataClient } from "../DataClient";
import { GetEducationText } from "../types";

export const getEducationTextFactory = (dataClient: DataClient): GetEducationText => {
  return async (soc: string): Promise<string> => {
    try {
      const dirtyText = await dataClient.getEducationTextBySoc(soc);
      return dirtyText.howtobecomeone.split("<p>")[1].split("</p>")[0];
    } catch {
      return "";
    }
  };
};
