import {CTDLResource} from "../domain/credentialengine/CredentialEngine";

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

  extractTotalCost: async function (certificate: CTDLResource) {
    const estimatedCostObject = certificate["ceterms:estimatedCost"];
    if (Array.isArray(estimatedCostObject) && estimatedCostObject.length > 0) {
      for (const costObject of estimatedCostObject) {
        const name = costObject["ceterms:name"];
        if (name && name["en-US"] === "Total Cost") {
          const price = costObject["ceterms:price"];
          return price ? Number(price) : null;
        }
      }
    }
    return null;
  },

  extractTuitionCost: async function (certificate: CTDLResource) {

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
