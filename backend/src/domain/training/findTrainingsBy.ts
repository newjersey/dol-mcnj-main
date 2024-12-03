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

        //const provider = {"@id":"https://sandbox.credentialengineregistry.org/resources/ce-b4a6bf5d-103b-4548-877c-649f6f79fb01","@type":"ceterms:CredentialOrganization","@context":"https://credreg.net/ctdl/schema/context/json","ceterms:ctid":"ce-b4a6bf5d-103b-4548-877c-649f6f79fb01","ceterms:name":{"en-US":"BH Test Organization"},"ceterms:email":["bhauss@agatesoftware.com"],"ceterms:agentType":[{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/OrganizationType","ceterms:targetNode":"orgType:NonTraditional","ceterms:frameworkName":{"en-US":"Organization Type"},"ceterms:targetNodeName":{"en-US":"Alternative/Non-Traditional School"},"ceterms:targetNodeDescription":{"en-US":"Secondary (i.e., high school) that: 1) addresses needs of students which cannot typically be met in a regular school; 2) provides nontraditional education; 3) falls outside of the categories of regular, magnet/special program emphasis, or career and technical education."}}],"ceterms:description":{"en-US":"Class A CDL Training Program provides students with the skills to get a Class A CDL and become eligible for entry-level commercial driver positions."},"ceterms:subjectWebpage":"https://agatesoftware.com/","ceterms:agentSectorType":[{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/AgentSector","ceterms:targetNode":"agentSector:PrivateForProfit","ceterms:frameworkName":{"en-US":"Agent Sector"},"ceterms:targetNodeName":{"en-US":"Private For-Profit"},"ceterms:targetNodeDescription":{"en-US":"Sector that contains privately-owned organizations that operate for profit."}}],"ceterms:lifeCycleStatusType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/LifeCycleStatus","ceterms:targetNode":"lifeCycle:Active","ceterms:frameworkName":{"en-US":"Life Cycle Status"},"ceterms:targetNodeName":{"en-US":"Active"},"ceterms:targetNodeDescription":{"en-US":"Resource is active, current, ongoing, offered, operational, or available."}}};

        const cipCode = await credentialEngineUtils.extractCipCode(certificate);
        const cipDefinition = await dataClient.findCipDefinitionByCip(cipCode);

        const outcomesDefinition = await dataClient.findOutcomeDefinition(cipCode, provider.providerId);

        const credentials = await credentialEngineUtils.constructCredentialsString(certificate["ceterms:isPreparationFor"] as CetermsConditionProfile[]);

        const training = {
          ctid: certificate["ceterms:ctid"],
          name: certificate["ceterms:name"] ? certificate["ceterms:name"]["en-US"] : "",
          cipDefinition: cipDefinition ? cipDefinition[0] : null,
          provider: provider,
          availableAt: await credentialEngineUtils.getAvailableAtAddresses(certificate),
          description: certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : "",
          credentials,
          prerequisites: await credentialEngineUtils.extractPrerequisites(certificate),
          totalClockHours: await credentialEngineUtils.getTimeRequired(certificate),
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
          deliveryTypes: await credentialEngineUtils.hasLearningDeliveryTypes(certificate),
          // percentEmployed: await credentialEngineUtils.extractEmploymentData(certificate),
          percentEmployed: outcomesDefinition ? formatPercentEmployed(outcomesDefinition.peremployed2) : null,
          // averageSalary: await credentialEngineUtils.extractAverageSalary(certificate),
          averageSalary: outcomesDefinition ? formatAverageSalary(outcomesDefinition.avgquarterlywage2) : null,
          hasEveningCourses: await credentialEngineUtils.hasEveningSchedule(certificate),
          languages: await credentialEngineUtils.getLanguages(certificate),
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

export const formatLanguages = (languages: string | null): string[] => {
  if (languages == null || languages.length === 0) return [];
  const languagesWithoutQuotes = languages.replace(/["\s]+/g, "");
  return languagesWithoutQuotes.split(",");
};

