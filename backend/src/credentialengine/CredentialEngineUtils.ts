import {
  CetermsAccommodationType,
  CetermsAggregateData,
  CetermsConditionProfile, CetermsContactPoint, CetermsPlace,
  CetermsServiceType, CetermsVersionIdentifier,
  CTDLResource,
  CtermsSupportServices
} from "../domain/credentialengine/CredentialEngine";
import { Occupation } from "../domain/occupations/Occupation";
import {Address, Provider} from "../domain/training/Training";
import { convertZipCodeToCounty } from "../domain/utils/convertZipCodeToCounty";
import { credentialEngineAPI } from "./CredentialEngineAPI";

const logError = (message: string, error: Error) => {
  console.error(`${message}: ${error.message}`);
};

const validateCtId = async (id: string): Promise<boolean> => {
  const pattern = /^ce-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  try {
    return pattern.test(id);
  } catch (error) {
    logError(`Error validating CTID: ${id}`, error as Error);
    throw error;
  }
};

const getCtidFromURL = async (url: string): Promise<string> => {
  try {
    console.log(`Getting CTID from URL: ${url}`);
    const lastSlashIndex = url.lastIndexOf("/");
    return url.substring(lastSlashIndex + 1);
  } catch (error) {
    logError(`Error extracting CTID from URL: ${url}`, error as Error);
    throw error;
  }
};

const fetchCertificateData = async (url: string): Promise<CTDLResource | null> => {
  try {
    const ctid = await getCtidFromURL(url);
    const query = {
      "ceterms:ctid": ctid,
      "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d"
    };
    const response = await credentialEngineAPI.getResults(query, 0, 10, "^search:relevance");
    response.data = {"data": [{"@id":"https://sandbox.credentialengineregistry.org/resources/ce-58ea4f49-08ab-493d-b88d-cf36d507e536","@type":"ceterms:LearningOpportunityProfile","@context":"https://credreg.net/ctdl/schema/context/json","ceterms:ctid":"ce-58ea4f49-08ab-493d-b88d-cf36d507e536","ceterms:name":{"en-US":"ELDT Training"},"ceterms:ownedBy":["https://sandbox.credentialengineregistry.org/resources/ce-b4a6bf5d-103b-4548-877c-649f6f79fb01"],"ceterms:inLanguage":["en"],"ceterms:availableAt":[{"@type":"ceterms:Place","ceterms:postalCode":"07003","ceterms:addressRegion":{"en-US":"New Jersey"},"ceterms:streetAddress":{"en-US":"1339 Broad St"},"ceterms:addressLocality":{"en-US":"Bloomfield"}}],"ceterms:description":{"en-US":"If you do not yet hold a CLP, or if your CLP was issued on or after February 7th, 2022, you must complete entry-level driver training before you will be permitted to take your CDL skills test."},"ceterms:estimatedCost":[{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Total Cost"},"ceterms:price":4409.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Estimated cost of credential learning opportunity or assessment"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:AggregateCost","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Aggregate Cost"},"ceterms:targetNodeDescription":{"en-US":"Sum of direct costs."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Tuition"},"ceterms:price":3600.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Tuition cost for the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:Tuition","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Tuition"},"ceterms:targetNodeDescription":{"en-US":"Cost for teaching and instruction."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Fees"},"ceterms:price":450.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Fees associated with the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:MixedFees","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Mixed Fees"},"ceterms:targetNodeDescription":{"en-US":"The sum of fees that are not identified individually."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Books and Materials"},"ceterms:price":150.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Cost of books and materials for the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:LearningResource","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Learning Resource"},"ceterms:targetNodeDescription":{"en-US":"Cost for one or more learning resources."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Supplies"},"ceterms:price":110.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Cost of supplies for the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:TechnologyFee","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Technology Fee"},"ceterms:targetNodeDescription":{"en-US":"Cost for accessing technologies related to the learning opportunity or activity."}}},{"@type":"ceterms:CostProfile","ceterms:name":{"en-US":"Miscellaneous"},"ceterms:price":99.0,"ceterms:currency":"USD","ceterms:costDetails":"https://hawktruck.com","ceterms:description":{"en-US":"Miscellaneous costs for the credential"},"ceterms:directCostType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/CostType","ceterms:targetNode":"costType:ProgramSpecificFee","ceterms:frameworkName":{"en-US":"Cost Type"},"ceterms:targetNodeName":{"en-US":"Program Specific Fee"},"ceterms:targetNodeDescription":{"en-US":"Additional cost for participation with a specific program or course of study such as engineering, business, and nursing."}}}],"ceterms:isRequiredFor":[{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"License"}},{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"Master's Degree"}}],"ceterms:occupationType":[{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://www.onetcenter.org/taxonomy.html","ceterms:targetNode":"https://www.onetonline.org/link/summary/17-2021.00","ceterms:codedNotation":"17-2021.00","ceterms:frameworkName":{"en-US":"Standard Occupational Classification"},"ceterms:targetNodeName":{"en-US":"Agricultural Engineers"},"ceterms:targetNodeDescription":{"en-US":"Apply knowledge of engineering technology and biological science to agricultural problems concerned with power and machinery, electrification, structures, soil and water conservation, and processing of agricultural products."}},{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://www.onetcenter.org/taxonomy.html","ceterms:targetNode":"https://www.onetonline.org/link/summary/51-9191.00","ceterms:codedNotation":"51-9191.00","ceterms:frameworkName":{"en-US":"Standard Occupational Classification"},"ceterms:targetNodeName":{"en-US":"Adhesive Bonding Machine Operators and Tenders"},"ceterms:targetNodeDescription":{"en-US":"Operate or tend bonding machines that use adhesives to join items for further processing or to form a completed product. Processes include joining veneer sheets into plywood; gluing paper; or joining rubber and rubberized fabric parts, plastic, simulated leather, or other materials."}},{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://www.onetcenter.org/taxonomy.html","ceterms:targetNode":"https://www.onetonline.org/link/summary/17-2141.02","ceterms:codedNotation":"17-2141.02","ceterms:frameworkName":{"en-US":"Standard Occupational Classification"},"ceterms:targetNodeName":{"en-US":"Automotive Engineers"},"ceterms:targetNodeDescription":{"en-US":"Develop new or improved designs for vehicle structural members, engines, transmissions, or other vehicle systems, using computer-assisted design technology. Direct building, modification, or testing of vehicle or components."}}],"ceterms:subjectWebpage":"https://hawktruck.com","ceterms:isPreparationFor":[{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"Drivers License"}},{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"Truck Driver License"}},{"@type":"ceterms:ConditionProfile","ceterms:name":{"en-US":"Truck Driver Credentialing Agency"}}],"ceterms:estimatedDuration":[{"@type":"ceterms:DurationProfile","HasValue":true,"ceterms:description":{"en-US":"This is about how long it takes to earn this credential"},"ceterms:exactDuration":"P10W"}],"ceterms:hasSupportService":["https://sandbox.credentialengineregistry.org/resources/ce-17f866fb-dab8-4f50-b94b-9cc17fe62a94"],"ceterms:scheduleTimingType":[{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/ScheduleTiming","ceterms:targetNode":"scheduleTiming:Evening","ceterms:frameworkName":{"en-US":"Schedule Timing"},"ceterms:targetNodeName":{"en-US":"Evening"},"ceterms:targetNodeDescription":{"en-US":"Schedule is typically during evening hours."}}],"ceterms:lifeCycleStatusType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/LifeCycleStatus","ceterms:targetNode":"lifeCycle:Active","ceterms:frameworkName":{"en-US":"Life Cycle Status"},"ceterms:targetNodeName":{"en-US":"Active"},"ceterms:targetNodeDescription":{"en-US":"Resource is active, current, ongoing, offered, operational, or available."}}}
      ]};
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    logError(`Error fetching data for CTID`, error as Error);
    return null;
  }
};

const fetchValidCEData = async (urls: string[]): Promise<CTDLResource[]> => {
  try {
    const ceDataPromises = urls.map(async url => {
      if (!(await validateCtId(url))) {
        console.error(`Invalid CE ID: ${url}`);
        return null;
      }
      return await fetchCertificateData(url);
    });

    return (await Promise.all(ceDataPromises)).filter((record): record is CTDLResource => record !== null);
  } catch (error) {
    logError(`Error fetching valid CE data`, error as Error);
    throw error;
  }
};

const getProviderData = async (certificate: CTDLResource) => {
  try {
   // const ownedBy = certificate["ceterms:ownedBy"]?.[0];
    // if (!ownedBy) throw new Error("OwnedBy field is missing");

    //const ownedByCtid = await getCtidFromURL(ownedBy);
    //const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
    const ownedByRecord = {"@id":"https://sandbox.credentialengineregistry.org/resources/ce-b4a6bf5d-103b-4548-877c-649f6f79fb01","@type":"ceterms:CredentialOrganization","@context":"https://credreg.net/ctdl/schema/context/json","ceterms:ctid":"ce-b4a6bf5d-103b-4548-877c-649f6f79fb01","ceterms:name":{"en-US":"BH Test Organization"},"ceterms:email":["bhauss@agatesoftware.com"],"ceterms:agentType":[{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/OrganizationType","ceterms:targetNode":"orgType:NonTraditional","ceterms:frameworkName":{"en-US":"Organization Type"},"ceterms:targetNodeName":{"en-US":"Alternative/Non-Traditional School"},"ceterms:targetNodeDescription":{"en-US":"Secondary (i.e., high school) that: 1) addresses needs of students which cannot typically be met in a regular school; 2) provides nontraditional education; 3) falls outside of the categories of regular, magnet/special program emphasis, or career and technical education."}}],"ceterms:description":{"en-US":"Class A CDL Training Program provides students with the skills to get a Class A CDL and become eligible for entry-level commercial driver positions."},"ceterms:subjectWebpage":"https://agatesoftware.com/","ceterms:agentSectorType":[{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/AgentSector","ceterms:targetNode":"agentSector:PrivateForProfit","ceterms:frameworkName":{"en-US":"Agent Sector"},"ceterms:targetNodeName":{"en-US":"Private For-Profit"},"ceterms:targetNodeDescription":{"en-US":"Sector that contains privately-owned organizations that operate for profit."}}],"ceterms:lifeCycleStatusType":{"@type":"ceterms:CredentialAlignmentObject","ceterms:framework":"https://credreg.net/ctdl/terms/LifeCycleStatus","ceterms:targetNode":"lifeCycle:Active","ceterms:frameworkName":{"en-US":"Life Cycle Status"},"ceterms:targetNodeName":{"en-US":"Active"},"ceterms:targetNodeDescription":{"en-US":"Resource is active, current, ongoing, offered, operational, or available."}}} as CTDLResource;
    // Extract the provider ID if it exists
    const isCetermsIdentifier = (
        identifier: any
    ): identifier is {
      "ceterms:identifierTypeName": { "en-US": string };
      "ceterms:identifierValueCode": string;
    } => {
      return (
          identifier &&
          identifier["ceterms:identifierTypeName"]?.["en-US"] &&
          typeof identifier["ceterms:identifierValueCode"] === "string"
      );
    };

    // Use the type guard inside the find method
    const providerId = ownedByRecord["ceterms:identifier"]?.find(
        (identifier) =>
            isCetermsIdentifier(identifier) &&
            identifier["ceterms:identifierTypeName"]["en-US"] === "NJDOL Provider ID"
    )?.["ceterms:identifierValueCode"] ?? null;

    return {
      ctid: ownedByRecord["ceterms:ctid"],
      providerId,
      name: ownedByRecord["ceterms:name"] ? ownedByRecord["ceterms:name"]["en-US"] : "Unknown",
      url: ownedByRecord["ceterms:subjectWebpage"],
      email: ownedByRecord["ceterms:email"]?.[0] ?? null,
      address: await getAddress(ownedByRecord),
    };
  } catch (error) {
    logError(`Error getting provider data`, error as Error);
    throw error;
  }
};

const getAddress = async (resource: CTDLResource): Promise<Address[]> => {
  try {
    const addresses = resource["ceterms:address"] ?? [];
    const result: Address[] = [];

    for (const address of addresses) {
      const zipCode = address["ceterms:postalCode"] ?? "";
      const baseAddress = {
        street_address: address["ceterms:streetAddress"]?.["en-US"] ?? "",
        city: address["ceterms:addressLocality"]?.["en-US"] ?? "",
        state: address["ceterms:addressRegion"]?.["en-US"] ?? "",
        zipCode,
        county: convertZipCodeToCounty(zipCode) ?? ""
      };

      const contactPoints = address["ceterms:targetContactPoint"] ?? [];
      if (contactPoints.length > 0) {
        result.push({
          ...baseAddress,
          targetContactPoints: contactPoints.map((contactPoint: CetermsContactPoint) => ({
            name: contactPoint["ceterms:name"]?.["en-US"] ?? "",
            telephone: contactPoint["ceterms:telephone"] ?? []
          }))
        });
      } else {
        result.push({
          ...baseAddress,
          targetContactPoints: []
        });
      }
    }

    return result;
  } catch (error) {
    logError(`Error getting ceterms:address`, error as Error);
    throw error;
  }
};
const getAvailableAtAddresses = async (certificate: CTDLResource): Promise<Address[]> => {
  try {
    const availableAt = certificate["ceterms:availableAt"] ?? [];

    return availableAt.map((location: CetermsPlace) => {
      const zipCode = location["ceterms:postalCode"] ?? "";

      return {
        street_address: location["ceterms:streetAddress"]?.["en-US"] ?? "",
        city: location["ceterms:addressLocality"]?.["en-US"] ?? "",
        state: location["ceterms:addressRegion"]?.["en-US"] ?? "",
        zipCode: zipCode,
        county: convertZipCodeToCounty(zipCode) ?? ""
      };
    });
  } catch (error) {
    logError(`Error getting available addresses`, error as Error);
    throw error;
  }
};


const extractCipCode = async (certificate: CTDLResource): Promise<string> => {
  try {
    const instructionalProgramTypes = certificate["ceterms:instructionalProgramType"];
    if (Array.isArray(instructionalProgramTypes)) {
      for (const programType of instructionalProgramTypes) {
        if (programType["ceterms:frameworkName"]?.["en-US"] === "Classification of Instructional Programs") {
          return (programType["ceterms:codedNotation"] || "").replace(/[^\w\s]/g, "");
        }
      }
    }
    return "";
  } catch (error) {
    logError(`Error extracting CIP code`, error as Error);
    throw error;
  }
};

const extractOccupations = async (certificate: CTDLResource): Promise<Occupation[]> => {
  try {
    const occupationTypes = certificate["ceterms:occupationType"];
    if (!occupationTypes || occupationTypes.length === 0) return [];

    return occupationTypes
        .filter((occupation) =>
            occupation["ceterms:frameworkName"]?.["en-US"] === "Standard Occupational Classification" &&
            occupation["ceterms:codedNotation"] &&
            occupation["ceterms:targetNodeName"]?.["en-US"]
        )
        .map((occupation) => {
          const soc = occupation["ceterms:codedNotation"]?.replace(".00", "");
          const title = occupation["ceterms:targetNodeName"]?.["en-US"];
          return { soc, title };
        })
        .filter((occupation): occupation is Occupation => !!occupation.soc && !!occupation.title);
  } catch (error) {
    logError(`Error extracting occupations`, error as Error);
    throw error;
  }
};

const extractCost = async (certificate: CTDLResource, costType: string): Promise<number | null> => {
  try {
    const estimatedCosts = certificate["ceterms:estimatedCost"];
    if (Array.isArray(estimatedCosts)) {
      for (const costProfile of estimatedCosts) {
        const directCostType = costProfile["ceterms:directCostType"];
        if (directCostType?.["ceterms:targetNode"] === costType) {
          const price = costProfile["ceterms:price"];
          return price ? Number(price) : null;
        }
      }
    }
    return null;
  } catch (error) {
    logError(`Error extracting cost for type ${costType}`, error as Error);
    throw error;
  }
};

const extractAverageSalary = async (certificate: CTDLResource): Promise<number | null> => {
  try {
    const averageSalaryData = certificate["ceterms:aggregateData"];
    if (!averageSalaryData) return null;

    const averageSalaryProfile = averageSalaryData.find(
        (aggData: CetermsAggregateData) => aggData["ceterms:medianEarnings"] !== undefined && aggData["ceterms:medianEarnings"] !== null
    );

    if (!averageSalaryProfile) return null;

    const medianEarnings = averageSalaryProfile["ceterms:medianEarnings"];
    if (typeof medianEarnings !== 'number') {
      throw new Error(`Median earnings is not a number: ${medianEarnings}`);
    }

    return medianEarnings;
  } catch (error) {
    logError(`Error extracting average salary`, error as Error);
    throw error;
  }
};

const extractEmploymentData = async (certificate: CTDLResource): Promise<number | null> => {
  try {
    const aggData = certificate["ceterms:aggregateData"];
    if (!aggData) return null;

    for (const data of aggData) {
      const jobObtained = data["ceterms:jobsObtained"]?.find(job => job["qdata:percentage"] != null);
      if (jobObtained?.["qdata:percentage"] != null) {
        return jobObtained["qdata:percentage"];
      }
    }
    return null;
  } catch (error) {
    logError(`Error extracting employment data`, error as Error);
    throw error;
  }
};

const extractPrerequisites = async (certificate: CTDLResource): Promise<string[] | null> => {
  try {
    const prerequisites = certificate["ceterms:requires"]
        ?.filter(req => (req["ceterms:name"]?.["en-US"] ?? "") === "Requirements")
        .map(req => req["ceterms:description"]?.["en-US"])
        .filter((description): description is string => description !== undefined);

    return prerequisites && prerequisites.length > 0 ? prerequisites : null;
  } catch (error) {
    logError(`Error extracting prerequisites`, error as Error);
    throw error;
  }
};

const checkSupportService = async (certificate: CTDLResource, targetNode: string): Promise<boolean> => {
  try {
    const supportServices = certificate["ceterms:hasSupportService"] as CtermsSupportServices[] || [];

    return supportServices.some((service: CtermsSupportServices) =>
        service["ceterms:supportServiceType"]?.some((type: CetermsServiceType) => type["ceterms:targetNode"] === targetNode)
    );
  } catch (error) {
    logError(`Error checking support service`, error as Error);
    throw error;
  }
};

const checkAccommodation = async (certificate: CTDLResource, targetNode: string): Promise<boolean> => {
  try {
    const supportServices = certificate["ceterms:hasSupportService"] as CtermsSupportServices[] || [];

    return supportServices.some((service: CtermsSupportServices) =>
        service["ceterms:accommodationType"]?.some((type: CetermsAccommodationType) => type["ceterms:targetNode"] === targetNode)
    );
  } catch (error) {
    logError(`Error checking accommodation`, error as Error);
    throw error;
  }
};

const constructCertificationsString = async (isPreparationForObject: CetermsConditionProfile[]): Promise<string> => {
  try {
    if (!isPreparationForObject || isPreparationForObject.length === 0) return "";

    return isPreparationForObject
        .map((obj) => obj["ceterms:name"]?.["en-US"] ?? "")
        .filter((name) => name) // Filter out empty strings
        .join(", "); // Join the names with a comma and space as separator
  } catch (error) {
    logError(`Error constructing certifications string`, error as Error);
    throw error;
  }
};

const getCalendarLengthId = async (certificate: CTDLResource): Promise<number> => {
  try {
    const estimatedDuration = certificate["ceterms:estimatedDuration"];
    if (!estimatedDuration || estimatedDuration.length === 0) return 0;
    const exactDuration = estimatedDuration[0]["ceterms:exactDuration"];
    if (!exactDuration) return 0;
    return await convertIso8601DurationToCalendarLengthId(exactDuration);
  } catch (error) {
    logError(`Error getting calendar length ID`, error as Error);
    throw error;
  }
};

const hasOnlineOffering = async (certificate: CTDLResource): Promise<boolean> => {
  try {
    const learningDeliveryTypes = certificate["ceterms:learningDeliveryType"] ?? [];
    return learningDeliveryTypes.some(
      (deliveryType: CetermsServiceType) => deliveryType["ceterms:targetNode"] === "deliveryType:OnlineOnly"
    );
  } catch (error) {
    logError(`Error checking for online offering`, error as Error);
    throw error;
  }
};

const hasEveningSchedule = async (certificate: CTDLResource): Promise<boolean> => {
  try {
    const scheduleTimingTypes = certificate["ceterms:scheduleTimingType"];
    if (!scheduleTimingTypes) return false;

    const hasEvening = scheduleTimingTypes.some((timingType) => timingType["ceterms:targetNode"] === "scheduleTiming:Evening");

    return hasEvening;
  } catch (error) {
    logError(`Error checking evening schedule`, error as Error);
    throw error;
  }
};

const getLanguages = async (certificate: CTDLResource): Promise<string[]> => {
  try {
    const languages = certificate["ceterms:inLanguage"];
    if (!languages || languages.length === 0) return [];

    return languages.map((languageTag: string) => DATA_VALUE_TO_LANGUAGE[languageTag] || languageTag);
  } catch (error) {
    logError(`Error getting languages`, error as Error);
    throw error;
  }
};

const convertIso8601DurationToTotalHours = async (isoString: string): Promise<number> => {
  try {
    const match = isoString.match(
        /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/,
    );
    if (!match) {
      throw new Error("Invalid ISO 8601 duration string");
    }

    const years = parseInt(match[1] || "0", 10) * 365 * 24;
    const months = parseInt(match[2] || "0", 10) * 30 * 24;
    const weeks = parseInt(match[3] || "0", 10) * 7 * 24;
    const days = parseInt(match[4] || "0", 10) * 24;
    const hours = parseInt(match[5] || "0", 10);
    const minutes = parseInt(match[6] || "0", 10) / 60;
    const seconds = parseInt(match[7] || "0", 10) / 3600;

    return years + months + weeks + days + hours + minutes + seconds;
  } catch (error) {
    logError(`Error converting ISO 8601 duration to total hours`, error as Error);
    throw error;
  }
};

const convertIso8601DurationToCalendarLengthId = async (isoString: string): Promise<number> => {
  try {
    const match = isoString.match(
        /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/
    );
    if (!match) {
      throw new Error("Invalid ISO 8601 duration string");
    }

    const years = parseInt(match[1]) || 0;
    const months = parseInt(match[2]) || 0;
    const weeks = parseInt(match[3]) || 0;
    const days = parseInt(match[4]) || 0;
    const hours = parseInt(match[5]) || 0;
    const minutes = parseInt(match[6]) || 0;
    const seconds = parseInt(match[7]) || 0;

    // Convert all to total days
    const totalDays = years * 365 + months * 30 + weeks * 7 + days + (hours / 24) + (minutes / 1440) + (seconds / 86400);

    if (totalDays < 1) return 1;
    if (totalDays <= 2) return 2;
    if (totalDays <= 7) return 3;
    if (totalDays <= 21) return 4;
    if (totalDays <= 77) return 5;
    if (totalDays <= 150) return 6;
    if (totalDays <= 365) return 7;
    if (totalDays <= 730) return 8;
    if (totalDays <= 1460) return 9;
    return 10;
  } catch (error) {
    logError(`Error converting ISO 8601 duration to calendar length ID`, error as Error);
    throw error;
  }
};

export const DATA_VALUE_TO_LANGUAGE: { [key: string]: string } = {
  ar: "Arabic",
  zh: "Chinese",
  fr: "French",
  "fr-HT": "French Creole",
  de: "German",
  el: "Greek",
  he: "Hebrew",
  hi: "Hindi",
  hu: "Hungarian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  pl: "Polish",
  pt: "Portuguese",
  ru: "Russian",
  es: "Spanish",
  tl: "Tagalog",
  vi: "Vietnamese",
  yi: "Yiddish",
};

export const credentialEngineUtils = {
  validateCtId,
  getCtidFromURL,
  fetchCertificateData,
  fetchValidCEData,
  getProviderData,
  getAddress,
  getAvailableAtAddresses,
  extractCipCode,
  extractOccupations,
  extractCost,
  extractAverageSalary,
  extractEmploymentData,
  extractPrerequisites,
  checkSupportService,
  checkAccommodation,
  constructCertificationsString,
  getCalendarLengthId,
  hasOnlineOffering,
  hasEveningSchedule,
  getLanguages,
  convertIso8601DurationToTotalHours,
  convertIso8601DurationToCalendarLengthId
};
