// Import necessary modules and functions
import { DataClient } from "../DataClient";
import { FindTrainingsBy } from "../types";
import { Training } from "./Training";
import { Selector } from "./Selector";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { convertZipCodeToCounty } from "../utils/convertZipCodeToCounty";
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
        const ownedBy = certificate["ceterms:ownedBy"] || [];
        const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedBy[0]);
        const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
        const availableOnlineAt = certificate["ceterms:availableOnlineAt"];
        const address = await credentialEngineUtils.getAvailableAtAddress(certificate);

        const cipCode = await credentialEngineUtils.extractCipCode(certificate);
        const cipDefinition = await dataClient.findCipDefinitionByCip(cipCode);
        const certifications = await credentialEngineUtils.constructCertificationsString(certificate["ceterms:isPreparationFor"] as CetermsConditionProfile[]);

        const training = {
          id: certificate["ceterms:ctid"],
          name: certificate["ceterms:name"] ? certificate["ceterms:name"]["en-US"] : "",
          cipDefinition: cipDefinition ? cipDefinition[0] : null,
          provider: {
            id: ownedByRecord["ceterms:ctid"],
            name: ownedByRecord["ceterms:name"]["en-US"],
            url: ownedByRecord["ceterms:subjectWebpage"],
            email: ownedByRecord["ceterms:email"] ? ownedByRecord["ceterms:email"][0] : null,
            county: convertZipCodeToCounty(address.zipCode),
          },
          availableAt: address,
          description: certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : "",
          certifications: certifications,
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
          otherCost: await credentialEngineUtils.sumOtherCosts(certificate),
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
