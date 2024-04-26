import {CetermsAggregateData, CTDLResource} from "../domain/credentialengine/CredentialEngine";
import {Occupation} from "../domain/occupations/Occupation";

export const credentialEngineUtils = {

  getCtidFromURL: async function (url: string) {
    const lastSlashIndex: number = url.lastIndexOf("/");
    const ctid: string = url.substring(lastSlashIndex + 1);
    return ctid;
  },

  getHighlight: async function (inputString: string, query: string) {
    const words = inputString.split(' ');
    const queryIndex = words.findIndex(word => word.includes(query));

    if (queryIndex === -1) {
      // query is not found in the input string
      return words.slice(0, 19).join(' ');
    }

    const startIndex = Math.max(queryIndex - 10, 0);
    const endIndex = Math.min(queryIndex + 11, words.length);

    return words.slice(startIndex, endIndex).join(' ');
  },

  extractCipCode: async function (certificate: CTDLResource) {
    const instructionalProgramTypes = certificate["ceterms:instructionalProgramType"];
    if (Array.isArray(instructionalProgramTypes)) {
      for (const programType of instructionalProgramTypes) {
        if (
          programType["ceterms:frameworkName"]?.["en-US"] ===
          "Classification of Instructional Programs"
        ) {
          return (programType["ceterms:codedNotation"] || "").replace(/[^\w\s]/g, "");
        }
      }
    }
    return ""; // Return empty string if no match is found
  },

  extractOccupations: async function (certificate: CTDLResource): Promise<Occupation[]> {
    const occupationTypes = certificate["ceterms:occupationType"];
    if (!occupationTypes || occupationTypes.length === 0) return [];

    return occupationTypes
      .filter((occupation) =>
        occupation["ceterms:frameworkName"]?.["en-US"] === "Standard Occupational Classification" && // Ensure frameworkName is the desired one
        occupation["ceterms:codedNotation"] && // Check if codedNotation is present
        occupation["ceterms:targetNodeName"]?.["en-US"]) // Check if targetNodeName is present
      .map((occupation) => {
        const soc = occupation["ceterms:codedNotation"]?.replace(".00", ""); // Use optional chaining with replace
        const title = occupation["ceterms:targetNodeName"]?.["en-US"]; // Use optional chaining
        return { soc, title };
      })
      .filter((occupation): occupation is Occupation => !!occupation.soc && !!occupation.title);
  },

  extractCost: async function (certificate: CTDLResource, costType: string) {
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
  },

  sumOtherCosts: async function (certificate: CTDLResource) {
    const excludedCostTypes = [
      "costType:AggregateCost",
      "costType:Tuition",
      "costType:MixedFees",
      "costType:LearningResource",
      "costType:TechnologyFee"
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
  },

  extractAverageSalary: async function (certificate: CTDLResource) {
    const entrySalary = certificate["ceterms:aggregateData"] ? certificate["ceterms:aggregateData"]
        .filter((aggData: CetermsAggregateData) =>
            aggData["ceterms:name"]?.["en-US"] === "Median Earnings of Program Graduates in the Region - Upon Entry")
        [0]?.["ceterms:medianEarnings"] ?? null : null;
    return entrySalary;
  },

  extractPrerequisites: async function (certificate: CTDLResource): Promise<string[] | null> {
    const prerequisites = certificate["ceterms:requires"]
      ?.filter(req => (req["ceterms:name"]?.["en-US"] ?? "") === "Requirements")
      .map(req => req["ceterms:description"]?.["en-US"])
      .filter((description): description is string => description !== undefined); // Filter out undefined values

    return prerequisites && prerequisites.length > 0 ? prerequisites : null;
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
  }
}
