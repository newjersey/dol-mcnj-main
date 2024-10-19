import { convertToTitleCaseIfUppercase } from "./convertToTitleCaseIfUppercase";
import { LocalException } from "../training/Program";
import { DataClient } from "../DataClient";

export async function getLocalExceptionCounties(dataClient: DataClient, cipCode: string): Promise<string[]> {
  const localExceptions = await dataClient.getLocalExceptionsByCip();
  return localExceptions
    .filter((localException: LocalException) => localException.cipcode === cipCode)
    .map((localException: LocalException) => convertToTitleCaseIfUppercase(localException.county));
}
