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
      const price = estimatedCostObject[0]["ceterms:price"];
      return price ? Number(price) : null; // Convert price to number, return null if conversion fails or price is undefined
    }
    return null; // Return null if no estimatedCostObject is found
  }
}
