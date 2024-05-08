import {
  CetermsAccommodationType,
  CetermsAggregateData,
  CetermsConditionProfile, CetermsServiceType,
  CTDLResource,
  CtermsSupportServices
} from "../domain/credentialengine/CredentialEngine";
import {Occupation} from "../domain/occupations/Occupation";
import {Address} from "../domain/training/Training";
import {convertZipCodeToCounty} from "../domain/utils/convertZipCodeToCounty";
import {credentialEngineAPI} from "./CredentialEngineAPI";

export const credentialEngineUtils = {
  validateCtId: async function (id: string) : Promise<boolean> {
    const pattern = /^ce-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return pattern.test(id);
  },

  getCtidFromURL: async function (url: string) {
    try {
      console.log(`Getting CTID from URL: ${url}`);
      const lastSlashIndex: number = url.lastIndexOf("/");
      const ctid: string = url.substring(lastSlashIndex + 1);
      return ctid;
    } catch (error) {
      console.error(`Error extracting CTID from URL: ${url}, Error: ${error}`);
      throw error;
    }
  },


  // Function to fetch certificate data based on a valid CTID
  fetchCertificateData: async function(value: string): Promise<CTDLResource | null> {
    try {
      const ctid = await credentialEngineUtils.getCtidFromURL(value);
      const query = {
        "ceterms:ctid": ctid,
        "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d"
      };
      const response = await credentialEngineAPI.getResults(query, 0, 10, "^search:relevance");
      return response.data.data.length > 0 ? response.data.data[0] : null;
    } catch (error) {
      console.error(`Error fetching data for CTID: ${error}`);
      return null;
    }
  },

  // Function to validate and fetch CE data
  fetchValidCEData: async function(values: string[]): Promise<CTDLResource[]> {
    const ceDataPromises = values.map(async value => {
      if (!(await credentialEngineUtils.validateCtId(value))) {
        console.error(`Invalid CE ID: ${value}`);
        return null;
      }
      return await credentialEngineUtils.fetchCertificateData(value);
    });

    // Filter out `null` and assert that the resulting array contains only `CTDLResource` objects.
    return (await Promise.all(ceDataPromises)).filter((record): record is CTDLResource => record !== null);
  },

  getAvailableAtAddress: async  function (certificate: CTDLResource): Promise<Address> {
    const availableAt = certificate["ceterms:availableAt"]?.[0];
    const zipCode = availableAt?.["ceterms:postalCode"] ?? "";

    return {
      street_address: availableAt?.["ceterms:streetAddress"]?.["en-US"] ?? "",
      city: availableAt?.["ceterms:addressLocality"]?.["en-US"] ?? "",
      state: availableAt?.["ceterms:addressRegion"]?.["en-US"] ?? "",
      zipCode: availableAt?.["ceterms:postalCode"] ?? "",
      county: convertZipCodeToCounty(zipCode) ?? ""
    }
  },

  extractCipCode: async function (certificate: CTDLResource) {
    try {
      const instructionalProgramTypes = certificate["ceterms:instructionalProgramType"];
      if (Array.isArray(instructionalProgramTypes)) {
        for (const programType of instructionalProgramTypes) {
          if (programType["ceterms:frameworkName"]?.["en-US"] === "Classification of Instructional Programs") {
            return (programType["ceterms:codedNotation"] || "").replace(/[^\w\s]/g, "");
          }
        }
      }
      return ""; // Return empty string if no match is found
    } catch (error) {
      console.error(`Error extracting CIP code: ${error}`);
      throw error;
    }
  },

  extractOccupations: async function (certificate: CTDLResource): Promise<Occupation[]> {
    try {
      console.log("Extracting occupations...");
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
      console.error(`Error extracting occupations: ${error}`);
      throw error;
    }
  },

  extractCost: async function (certificate: CTDLResource, costType: string) {
    try {
      console.log(`Extracting cost of type ${costType}...`);
      const estimatedCosts = certificate["ceterms:estimatedCost"];
      if (Array.isArray(estimatedCosts) && estimatedCosts.length > 0) {
        for (const costProfile of estimatedCosts) {
          const directCostType = costProfile["ceterms:directCostType"];
          if (directCostType && directCostType["ceterms:targetNode"] === costType) {
            const price = costProfile["ceterms:price"];
            return price ? Number(price) : null;
          }
        }
      }
      return null;
    } catch (error) {
      console.error(`Error extracting cost for type ${costType}: ${error}`);
      throw error;
    }
  },

  sumOtherCosts: async function (certificate: CTDLResource) {
    try {
      const excludedCostTypes = [
        "costType:AggregateCost",
        "costType:Tuition",
        "costType:MixedFees",
        "costType:LearningResource",
        "costType:TechnologyFee",
      ];

      const estimatedCosts = certificate["ceterms:estimatedCost"];
      let otherCosts = 0;
      if (Array.isArray(estimatedCosts) && estimatedCosts.length > 0) {
        for (const costProfile of estimatedCosts) {
          const directCostType = costProfile["ceterms:directCostType"];
          const targetNode = directCostType ? directCostType["ceterms:targetNode"] : "";
          if (targetNode && !excludedCostTypes.includes(targetNode)) {
            const price = costProfile["ceterms:price"];
            if (price) {
              otherCosts += Number(price);
            }
          }
        }
      }
      return otherCosts;
    } catch (error) {
      console.error(`Error summing other costs: ${error}`);
      throw error;
    }
  },

  extractAverageSalary: async function (certificate: CTDLResource) {
    try {
      const averageSalaryData = certificate["ceterms:aggregateData"];
      if (!averageSalaryData) return null;

      const averageSalaryProfile = averageSalaryData.find((aggData: CetermsAggregateData) => aggData["ceterms:medianEarnings"] != null);

      return averageSalaryProfile ? averageSalaryProfile["ceterms:medianEarnings"] : null;
    } catch (error) {
      console.error(`Error extracting average salary: ${error}`);
      throw error;
    }
  },

  extractEmploymentData: async function (certificate: CTDLResource) {
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
      console.error(`Error extracting employment data: ${error}`);
      throw error;
    }
  },

  extractPrerequisites: async function (certificate: CTDLResource): Promise<string[] | null> {
    try {
      const prerequisites = certificate["ceterms:requires"]
        ?.filter(req => (req["ceterms:name"]?.["en-US"] ?? "") === "Requirements")
        .map(req => req["ceterms:description"]?.["en-US"])
        .filter((description): description is string => description !== undefined);

      return prerequisites && prerequisites.length > 0 ? prerequisites : null;
    } catch (error) {
      console.error(`Error extracting prerequisites: ${error}`);
      throw error;
    }
  },


  checkSupportService: async function (certificate: CTDLResource, targetNode: string): Promise<boolean> {
    const supportServices = certificate["ceterms:hasSupportService"] as CtermsSupportServices[] || [];

    return supportServices.some((service: CtermsSupportServices) =>
      service["ceterms:supportServiceType"]?.some((type: CetermsServiceType) => type["ceterms:targetNode"] === targetNode)
    );
  },

  checkAccommodation: async function (certificate: CTDLResource, targetNode: string): Promise<boolean> {
    const supportServices = certificate["ceterms:hasSupportService"] as CtermsSupportServices[] || [];

    return supportServices.some((service: CtermsSupportServices) =>
      service["ceterms:accommodationType"]?.some((type: CetermsAccommodationType) => type["ceterms:targetNode"] === targetNode)
    );
  },


  constructCertificationsString: async function (isPreparationForObject: CetermsConditionProfile[]): Promise<string> {
    if (!isPreparationForObject || isPreparationForObject.length === 0) return "";

    return isPreparationForObject
      .map((obj) => obj["ceterms:name"]?.["en-US"] ?? "")
      .filter((name) => name) // Filter out empty strings
      .join(", "); // Join the names with a comma and space as separator
  },

  getCalendarLengthId: async function (certificate: CTDLResource): Promise<number> {
    const estimatedDuration = certificate["ceterms:estimatedDuration"];
    if (!estimatedDuration || estimatedDuration.length === 0) return 0;
    const exactDuration = estimatedDuration[0]["ceterms:exactDuration"];
    if (!exactDuration) return 0;
    return await credentialEngineUtils.convertIso8601DurationToCalendarLengthId(exactDuration);
  },

  hasEveningSchedule: async function (certificate: CTDLResource) {
    try {
      const scheduleTimingTypes = certificate["ceterms:scheduleTimingType"];
      if (!scheduleTimingTypes) return false;

      const hasEvening = scheduleTimingTypes.some((timingType) => timingType["ceterms:targetNode"] === "scheduleTiming:Evening");

      return hasEvening;
    } catch (error) {
      console.error(`Error checking evening schedule: ${error}`);
      throw error;
    }
  },

  // Function to convert ISO 8601 duration to total hours
  convertIso8601DurationToTotalHours: async function (isoString: string) {
    const match = isoString.match(
      /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/,
    );
    if (!match) {
      return 0; // Return 0 if the string does not match the pattern
    }

    const years = parseInt(match[1] || "0", 10) * 365 * 24;
    const months = parseInt(match[2] || "0", 10) * 30 * 24;
    const weeks = parseInt(match[3] || "0", 10) * 7 * 24;
    const days = parseInt(match[4] || "0", 10) * 24;
    const hours = parseInt(match[5] || "0", 10);
    const minutes = parseInt(match[6] || "0", 10) / 60;
    const seconds = parseInt(match[7] || "0", 10) / 3600;

    return years + months + weeks + days + hours + minutes + seconds; // Sum up all components
  },

  convertIso8601DurationToCalendarLengthId: async function (isoString: string): Promise<number> {
    const match = isoString.match(
      /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/
    );
    if (!match) {
      return 0;
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
  },
}
