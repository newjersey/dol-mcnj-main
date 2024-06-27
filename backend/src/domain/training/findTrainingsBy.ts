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

// Main factory function to find trainings by given criteria
export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
    const inDemandCIPs = await dataClient.getCIPsInDemand();
    const inDemandCIPCodes = inDemandCIPs.map((c) => c.cipcode);

    const ceRecords = await credentialEngineUtils.fetchValidCEData(values);
    if (ceRecords.length === 0) {
      console.error('404 Not found: No CE Records Found')
      throw new Error('Not Found');
    }

    return await Promise.all(
      ceRecords.map(async (certificate: CTDLResource) => {
        const provider = await credentialEngineUtils.getProviderData(certificate);
        const availableOnlineAt = certificate["ceterms:availableOnlineAt"];

        const cipCode = await credentialEngineUtils.extractCipCode(certificate);
        const cipDefinition = await dataClient.findCipDefinitionByCip(cipCode);

        const outcomesDefinition = await dataClient.findOutcomeDefinition(cipCode, provider.providerId);

        const certifications = await credentialEngineUtils.constructCertificationsString(certificate["ceterms:isPreparationFor"] as CetermsConditionProfile[]);

        const training = {
          ctid: certificate["ceterms:ctid"],
          name: certificate["ceterms:name"] ? certificate["ceterms:name"]["en-US"] : "",
          cipDefinition: cipDefinition ? cipDefinition[0] : null,
          provider,
          availableAt: await credentialEngineUtils.getAvailableAtAddresses(certificate),
          description: certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : "",
          certifications,
          prerequisites: await credentialEngineUtils.extractPrerequisites(certificate),
          totalClockHours: null,
          calendarLength: await credentialEngineUtils.getCalendarLengthId(certificate),
          occupations: await credentialEngineUtils.extractOccupations(certificate),
          inDemand: inDemandCIPCodes.includes(cipCode ?? ""),
          localExceptionCounty: await getLocalExceptionCounties(dataClient, cipCode),
          tuitionCost: await credentialEngineUtils.extractCost(certificate, "costType:Tuition"),
          feesCost: await credentialEngineUtils.extractCost(certificate, "costType:MixedFees"),
          booksMaterialsCost: await credentialEngineUtils.extractCost(certificate, "costType:LearningResource"),
          suppliesToolsCost: await credentialEngineUtils.extractCost(certificate, "costType:TechnologyFee"),
          otherCost: await credentialEngineUtils.extractCost(certificate, "costType:ProgramSpecificFee"),
          totalCost: await credentialEngineUtils.extractCost(certificate, "costType:AggregateCost"),
          online: availableOnlineAt != null,
          // percentEmployed: await credentialEngineUtils.extractEmploymentData(certificate),
          percentEmployed: outcomesDefinition ? formatPercentEmployed(outcomesDefinition.peremployed2) : null,
          // averageSalary: await credentialEngineUtils.extractAverageSalary(certificate),
          averageSalary: outcomesDefinition ? formatAverageSalary(outcomesDefinition.avgquarterlywage2) : null,
          hasEveningCourses: await credentialEngineUtils.hasEveningSchedule(certificate),
          languages: certificate["ceterms:inLanguage"] ? certificate["ceterms:inLanguage"][0] : null,
          isWheelchairAccessible: await credentialEngineUtils.checkAccommodation(certificate, "accommodation:PhysicalAccessibility"),
          hasJobPlacementAssistance: await credentialEngineUtils.checkSupportService(certificate, "support:JobPlacement"),
          hasChildcareAssistance: await credentialEngineUtils.checkSupportService(certificate, "support:Childcare")
        };

        return training;
      })
    );
  };
};

const NAN_INDICATOR = "-99999";

const formatPercentEmployed = (perEmployed: string | null): number | null => {
  if (perEmployed === null || perEmployed === NAN_INDICATOR) {
    return null;
  }

  return parseFloat(perEmployed);
};

const formatAverageSalary = (averageQuarterlyWage: string | null): number | null => {
  if (averageQuarterlyWage === null || averageQuarterlyWage === NAN_INDICATOR) {
    return null;
  }

  const QUARTERS_IN_A_YEAR = 4;
  return parseFloat(averageQuarterlyWage) * QUARTERS_IN_A_YEAR;
};
