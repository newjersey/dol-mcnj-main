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

        const certifications = await credentialEngineUtils.constructCertificationsString(certificate["ceterms:isPreparationFor"] as CetermsConditionProfile[]);

        const training = {
          id: certificate["ceterms:ctid"],
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
          percentEmployed: await credentialEngineUtils.extractEmploymentData(certificate),
          averageSalary: await credentialEngineUtils.extractAverageSalary(certificate),
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
