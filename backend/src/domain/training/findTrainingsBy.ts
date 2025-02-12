import { DataClient } from "../DataClient";
import { FindTrainingsBy } from "../types";
import { Training } from "./Training";
import { Selector } from "./Selector";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { getLocalExceptionCounties } from "../utils/getLocalExceptionCounties";
import {
  CetermsConditionProfile,
  CTDLResource,
} from "../credentialengine/CredentialEngine";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

/**
 * Factory function to create a training finder function using a data client.
 * Fetches training data based on a given selector and values, utilizing caching for efficiency.
 *
 * @param {DataClient} dataClient - The data client used for fetching training data.
 * @returns {FindTrainingsBy} - A function to find trainings by given criteria.
 */
export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
    const cacheKey = `findTrainingsBy-${selector}-${values.join(",")}`;
    const cachedTrainings = cache.get<Training[]>(cacheKey);

    if (cachedTrainings) {
      console.info(`Cache hit for key: ${cacheKey}`);
      return cachedTrainings;
    }

    // Fetch in-demand CIP codes for tuition waiver statuses
    const inDemandCIPs = await dataClient.getCIPsInDemand();
    const inDemandCIPCodes = inDemandCIPs.map((c) => c.cipcode);

    // Fetch Credential Engine records based on provided values
    const ceRecords = await credentialEngineUtils.fetchValidCEData(values);

    if (ceRecords.length === 0) {
      console.error("404 Not found: No CE Records Found");
      throw new Error("Not Found");
    }

    // Process each CTDL resource record asynchronously
    const trainings = await Promise.all(
        ceRecords.map(async (record: CTDLResource) => {
          const provider = await credentialEngineUtils.getProviderData(record);
          const cipCode = await credentialEngineUtils.extractCipCode(record);

          const cipDefinition = await dataClient.findCipDefinitionByCip(cipCode);
          let outcomesDefinition = null;
          if (provider?.providerId) {
            outcomesDefinition = await dataClient.findOutcomeDefinition(provider.providerId, cipCode);
          } else {
            console.warn("Skipping outcomesDefinition lookup because providerId is missing or invalid");
          }

          // Filter out preparation conditions where data is not collected
          const filteredPreparationFor = (record["ceterms:isPreparationFor"] as CetermsConditionProfile[] || []).filter(
              (entry) => entry["ceterms:name"]?.["en-US"] !== "Data not collected"
          );

          // Construct credentials string from preparation data
          const credentials = await credentialEngineUtils.constructCredentialsString(filteredPreparationFor);

          return {
            ctid: record["ceterms:ctid"],
            name: record["ceterms:name"] ? record["ceterms:name"]["en-US"] : "",
            cipDefinition: cipDefinition ? cipDefinition[0] : null,
            provider: provider,
            availableAt: await credentialEngineUtils.getAvailableAtAddresses(record),
            description: record["ceterms:description"] ? record["ceterms:description"]["en-US"] : "",
            credentials,
            prerequisites: await credentialEngineUtils.extractPrerequisites(record),
            totalClockHours: await credentialEngineUtils.getTimeRequired(record),
            calendarLength: await credentialEngineUtils.getCalendarLengthId(record),
            occupations: await credentialEngineUtils.extractOccupations(record),
            inDemand: inDemandCIPCodes.includes(cipCode ?? ""),
            localExceptionCounty: await getLocalExceptionCounties(dataClient, cipCode),
            tuitionCost: await credentialEngineUtils.extractCost(record, "costType:Tuition"),
            feesCost: await credentialEngineUtils.extractCost(record, "costType:MixedFees"),
            booksMaterialsCost: await credentialEngineUtils.extractCost(record, "costType:LearningResource"),
            suppliesToolsCost: await credentialEngineUtils.extractCost(record, "costType:TechnologyFee"),
            otherCost: await credentialEngineUtils.extractCost(record, "costType:ProgramSpecificFee"),
            totalCost: await credentialEngineUtils.extractCost(record, "costType:AggregateCost"),
            deliveryTypes: await credentialEngineUtils.hasLearningDeliveryTypes(record),
            percentEmployed: outcomesDefinition ? formatPercentEmployed(outcomesDefinition.peremployed2) : null,
            averageSalary: outcomesDefinition ? formatAverageSalary(outcomesDefinition.avgquarterlywage2) : null,
            hasEveningCourses: await credentialEngineUtils.hasEveningSchedule(record),
            languages: await credentialEngineUtils.getLanguages(record),
            isWheelchairAccessible: await credentialEngineUtils.checkAccommodation(record, "accommodation:PhysicalAccessibility"),
            hasJobPlacementAssistance: await credentialEngineUtils.checkSupportService(record, "support:JobPlacement"),
            hasChildcareAssistance: await credentialEngineUtils.checkSupportService(record, "support:Childcare"),
          };
        })
    );

    // Cache the entire trainings array
    cache.set(cacheKey, trainings, 60 * 60);
    console.log(`Cache set for key: ${cacheKey}`);

    return trainings;
  };
};

// Indicator for missing or invalid numerical data
const NAN_INDICATOR = "-99999";

/**
 * Formats employment percentage, converting it to a number or returning null if invalid.
 * @param {string | null} perEmployed - The employment percentage as a string.
 * @returns {number | null} - Parsed percentage or null if invalid.
 */
const formatPercentEmployed = (perEmployed: string | null): number | null => {
  if (perEmployed === null || perEmployed === NAN_INDICATOR) {
    return null;
  }

  return parseFloat(perEmployed);
};

/**
 * Converts average quarterly wage into an annual salary.
 * @param {string | null} averageQuarterlyWage - The quarterly wage as a string.
 * @returns {number | null} - Annual salary estimate or null if invalid.
 */
const formatAverageSalary = (averageQuarterlyWage: string | null): number | null => {
  if (averageQuarterlyWage === null || averageQuarterlyWage === NAN_INDICATOR) {
    return null;
  }

  const QUARTERS_IN_A_YEAR = 4;
  return parseFloat(averageQuarterlyWage) * QUARTERS_IN_A_YEAR;
};
