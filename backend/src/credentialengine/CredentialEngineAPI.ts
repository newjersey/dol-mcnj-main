import { searchAPI } from "./CredentialEngineConfig";
import { getRecordAPI } from "./CredentialEngineConfig";

const searchGateway = `/assistant/search/ctdl`;
const graphGateway = `/graph`;
const resourcesGateway = `/resources`;

export const credentialEngineAPI = {
  /**
   *
   * @param query this should be a JSON-LD blob representing specific CE term collections.
   * @param skip part of pagination, number of results to skip
   * @param take part of pagination, number of results to return
   * @param sort CE provides several sorting methods
   *
   * @return a collection of results from Credential Engine.
   *
   */
   
  getResults: async function (query: object, skip: number, take: number, sort: string) {
    const response = await searchAPI.request({
      url: `${searchGateway}`,
      method: "post",
      data: {
        Query: query,
        Skip: skip,
        Take: take,
        Sort: sort,
      },
      // retrieving the signal value by using the property name
      // signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
    });

    // return "Connection works.";
    return response;
  },

  getGraphByCTID: async function (ctid: string) {
    const response = await getRecordAPI({
      url: `${graphGateway}/${ctid}`,
      method: "get",
    });

    return response.data;
  },

  getResourceByCTID: async function (ctid: string) {
    const response = await getRecordAPI({
      url: `${resourcesGateway}/${ctid}`,
      method: "get",
    });

    return response.data;
  },

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
