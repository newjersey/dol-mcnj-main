import { convertZipCodeToCounty } from "../utils/convertZipCodeToCounty";
import { FindTrainingsBy } from "../types";
import { Training } from "./Training";
import { DataClient } from "../DataClient";
import { Selector } from "./Selector";
import { getLocalExceptionCounties } from "../utils/getLocalExceptionCounties";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import {
  CetermsConditionProfile,
  CTDLResource,
} from "../credentialengine/CredentialEngine";

export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
    const inDemandCIPs = await dataClient.getCIPsInDemand();
    const inDemandCIPCodes = inDemandCIPs.map((c) => c.cipcode);
    const ceRecords = await Promise.all(values.map(async (value) => {
      const ctid = await credentialEngineUtils.getCtidFromURL(value);
      console.log("Debug - CTID:", ctid);
      return await credentialEngineAPI.getResourceByCTID(ctid);
    }));

    return await Promise.all(
      ceRecords.map(async (certificate: CTDLResource) => {
        try {
          // Get provider record
          const ownedBy = certificate["ceterms:ownedBy"] || [];
          const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedBy[0]);
          const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);

          const ownedByAddresses = [];
          const providerContactPoints = [];

          const ownedByAddressObject = ownedByRecord["ceterms:address"];
          const availableOnlineAt = certificate["ceterms:availableOnlineAt"];
          const isPreparationForObject = certificate["ceterms:isPreparationFor"] as CetermsConditionProfile[];
          const address = await credentialEngineUtils.getAvailableAtAddress(certificate);

          if (ownedByAddressObject != null) {
            for (const element of ownedByAddressObject) {
              if (element["@type"] === "ceterms:Place" && element["ceterms:streetAddress"] != null) {
                const addr = {
                  name: element["ceterms:name"] ? element["ceterms:name"]["en-US"] : null,
                  street1: element["ceterms:streetAddress"]?.["en-US"] ?? null,
                  street2: "",
                  city: element["ceterms:addressLocality"]?.["en-US"] ?? null,
                  state: element["ceterms:addressRegion"]?.["en-US"] ?? null,
                  zipCode: element["ceterms:postalCode"],
                };
                ownedByAddresses.push(addr);
              } else if (element["@type"] === "ceterms:ContactPoint") {
                const targetContactPoint = {
                  alternateName: element["ceterms:alternateName"]?.["en-US"],
                  contactType: element["ceterms:contactType"]?.["en-US"],
                  email: element["ceterms:email"],
                  faxNumber: element["ceterms:faxNumber"],
                  name: element["ceterms:name"]?.["en-US"],
                  socialMedia: element["ceterms:socialMedia"],
                  telephone: element["ceterms:telephone"],
                };
                providerContactPoints.push(targetContactPoint);
              }
            }
          }

          const cipCode = await credentialEngineUtils.extractCipCode(certificate);
          const cipDefinition = await dataClient.findCipDefinitionByCip(cipCode);
          const certifications = await credentialEngineUtils.constructCertificationsString(isPreparationForObject);

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
        } catch (error) {
          console.error("Error processing certificate:", error);
          throw error;
        }
      })
    );
  };
};
