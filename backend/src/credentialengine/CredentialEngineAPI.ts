import { searchAPI } from "./CredentialEngineConfig";
import { getRecordAPI } from "./CredentialEngineConfig";

// API endpoint paths for various Credential Engine data types
const searchGateway = `/assistant/search/ctdl`;
const graphGateway = `/graph`;
const resourcesGateway = `/resources`;

const DEFAULT_TAKE = 10; // Default number of results per request for pagination

export const credentialEngineAPI = {


  /**
   * Retrieves a list of results from the Credential Engine API based on a search query.
   *
   * @param query - A JSON-LD blob representing specific Credential Engine term collections.
   * @param skip - Number of results to skip for pagination.
   * @param take - Number of results to return (default: 10).
   * @returns A collection of search results from Credential Engine.
   */
  getResults: async function (query: object, skip: number, take: number = DEFAULT_TAKE) {
    try {
      const response = await searchAPI.request({
        url: `${searchGateway}`,
        method: "post",
        data: {
          Query: query,
          Skip: skip,
          Take: take,
          Sort: "^search:relevance"
          // IncludeResultsMetadata: true // Uncomment if metadata is needed
        },
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Search API failed for query:`, JSON.stringify(query), 'Error:', errorMessage);
      
      // Return empty results structure to prevent complete failure
      return {
        data: { data: [], extra: { TotalResults: 0 } },
        status: 503,
        statusText: 'Service Unavailable',
        headers: {},
        config: {},
      };
    }
  },

  /**
   * Fetches a graphical representation of a Credential Engine record by CTID.
   *
   * @param ctid - The Credential Transparency Identifier (CTID) of the resource.
   * @returns The graphical representation of the requested resource.
   */
  getGraphByCTID: async function (ctid: string) {
    const response = await getRecordAPI({
      url: `${graphGateway}/${ctid}`,
      method: "get",
    });

    return response.data;
  },

  /**
   * Fetches a Credential Engine resource by its CTID.
   *
   * @param ctid - The Credential Transparency Identifier (CTID) of the resource.
   * @returns The detailed resource data.
   */
  getResourceByCTID: async function (ctid: string) {
    try {
      const response = await getRecordAPI({
        url: `${resourcesGateway}/${ctid}`,
        method: "get",
      });

      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`⚠️ Failed to fetch resource ${ctid}, using fallback data:`, errorMessage);
      return null; // Return null for missing/unavailable resources
    }
  },

  getEnvelopeByCTID: async (ctid: string) => {
    try {
      const url = `/ce-registry/envelopes/${ctid}`;
      const response = await getRecordAPI.get(url);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`⚠️ Failed to fetch envelope ${ctid}:`, errorMessage);
      return null; // Return null for missing/unavailable envelopes
    }
  }

  // TODO: Discuss how we can use Cips for better results
  // getResultByCips: async function (cips: string[]) {
  //   if(cips.length === 0) return []
  //   const query = `
  //   {
  //     "ceterms:instructionalProgramType": {
  //       "ceterms:codedNotation": ${JSON.stringify(cips)}
  //     },
  //     "ceterms:availableOnlineAt": "search:anyValue",
  //     "ceterms:availableAt": {
  //          "ceterms:addressRegion": [
  //            {
  //              "search:value": "NJ",
  //              "search:value": "jersey",
  //              "search:matchType": "search:exactMatch"
  //            }
  //          ]
  //      },
  //     "ceterms:credentialStatusType": {
  //         "ceterms:targetNode": "credentialStat:Active"
  //       },
  //     "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d"
  //   } 
  //   `
  //   const result = await this.getResults(JSON.parse(query), 0, 4, "")
  //   return result.data.data
  // }
}
