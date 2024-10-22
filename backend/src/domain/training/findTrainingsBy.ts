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
    // const ceRecords = [
    //   {"@id":"https://sandbox.credentialengineregistry.org/resources/ce-58ea4f49-08ab-493d-b88d-cf36d507e536","@type":"ceterms:LearningOpportunityProfile","@context":"https://credreg.net/ctdl/schema/context/json","ceterms:ctid":"ce-58ea4f49-08ab-493d-b88d-cf36d507e536","ceterms:name":{"en-US":"ELDT Training"},"ceterms:ownedBy":["https://sandbox.credentialengineregistry.org/resources/ce-b4a6bf5d-103b-4548-877c-649f6f79fb01"],"ceterms:inLanguage":["en"],"ceterms:availableAt":[{"@type":"ceterms:Place","ceterms:postalCode":"07003","ceterms:addressRegion":{"en-US":"New Jersey"},"ceterms:streetAddress":{"en-US":"1339 Broad St"},"ceterms:addressLocality":{"en-US":"Bloomfield"}}],"ceterms:description":{"en-US":"If you do not yet hold a CLP, or if your CLP was issued on or after February 7th, 2022, you must complete entry-level driver training before you will be permitted to take your CDL skills test."},"ceterms:estimatedCost":[{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Total Cost"},"ceterms:price":4409.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Estimated cost of credential learning opportunity or assessment"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:AggregateCost","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Aggregate Cost"},"ceterms:targetNodeDescription":{"en-US":"Sum of direct costs."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Tuition"},"ceterms:price":3600.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Tuition cost for the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:Tuition","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Tuition"},"ceterms:targetNodeDescription":{"en-US":"Cost for teaching and instruction."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Fees"},"ceterms:price":450.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Fees associated with the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:MixedFees","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Mixed Fees"},"ceterms:targetNodeDescription":{"en-US":"The sum of fees that are not identified individually."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Books and Materials"},"ceterms:price":150.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Cost of books and materials for the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:LearningResource","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Learning Resource"},"ceterms:targetNodeDescription":{"en-US":"Cost for one or more learning resources."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Supplies"},"ceterms:price":110.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Cost of supplies for the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:TechnologyFee","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Technology Fee"},"ceterms:targetNodeDescription":{"en-US":"Cost for accessing technologies related to the learning opportunity or activity."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Miscellaneous"},"ceterms:price":99.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Miscellaneous costs for the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:ProgramSpecificFee","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Program Specific Fee"},"ceterms:targetNodeDescription":{"en-US":"Additional cost for participation with a specific program or course of study such as engineering, business, and nursing."}}}],"ceterms:isRequiredFor":[{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"License"}},{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"Master's Degree"}}],"ceterms:occupationType":[{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://www.onetcenter.org/taxonomy.html","ceterms:targetNode":"https://www.onetonline.org/link/summary/17-2021.00","ceterms:codedNotation":"17-2021.00","ceterms:frameworkName":{"en-US":"Standard Occupational Classification"},"ceterms:targetNodeName":{"en-US":"Agricultural Engineers"},"ceterms:targetNodeDescription":{"en-US":"Apply knowledge of engineering technology and biological science to agricultural problems concerned with power and machinery, electrification, structures, soil and water conservation, and processing of agricultural products."}},{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://www.onetcenter.org/taxonomy.html","ceterms:targetNode":"https://www.onetonline.org/link/summary/51-9191.00","ceterms:codedNotation":"51-9191.00","ceterms:frameworkName":{"en-US":"Standard Occupational Classification"},"ceterms:targetNodeName":{"en-US":"Adhesive Bonding Machine Operators and Tenders"},"ceterms:targetNodeDescription":{"en-US":"Operate or tend bonding machines that use adhesives to join items for further processing or to form a completed product. Processes include joining veneer sheets into plywood; gluing paper; or joining rubber and rubberized fabric parts, plastic, simulated leather, or other materials."}},{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://www.onetcenter.org/taxonomy.html","ceterms:targetNode":"https://www.onetonline.org/link/summary/17-2141.02","ceterms:codedNotation":"17-2141.02","ceterms:frameworkName":{"en-US":"Standard Occupational Classification"},"ceterms:targetNodeName":{"en-US":"Automotive Engineers"},"ceterms:targetNodeDescription":{"en-US":"Develop new or improved designs for vehicle structural members, engines, transmissions, or other vehicle systems, using computer-assisted design technology. Direct building, modification, or testing of vehicle or components."}}],"ceterms:subjectWebpage":"https://hawktruck.com","ceterms:isPreparationFor":[{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"Drivers License"}},{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"Truck Driver License"}},{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"Truck Driver Credentialing Agency"}}],"ceterms:estimatedDuration":[{"@type":"ceterms:DurationProfile","HasValue":true,"ceterms:description":{"en-US":"This is about how long it takes to earn this credential"},"ceterms:exactDuration":"P10W"}],"ceterms:hasSupportService":["https://sandbox.credentialengineregistry.org/resources/ce-17f866fb-dab8-4f50-b94b-9cc17fe62a94"],"ceterms:scheduleTimingType":[{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/ScheduleTiming","ceterms:targetNode":"scheduleTiming:Evening","ceterms:frameworkName":{"en-US":"Schedule Timing"},"ceterms:targetNodeName":{"en-US":"Evening"},"ceterms:targetNodeDescription":{"en-US":"Schedule is typically during evening hours."}}],"ceterms:lifeCycleStatusType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/LifeCycleStatus","ceterms:targetNode":"lifeCycle:Active","ceterms:frameworkName":{"en-US":"Life Cycle Status"},"ceterms:targetNodeName":{"en-US":"Active"},"ceterms:targetNodeDescription":{"en-US":"Resource is active, current, ongoing, offered, operational, or available."}}}
    // ]
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
          online: await credentialEngineUtils.hasOnlineOffering(certificate),
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

