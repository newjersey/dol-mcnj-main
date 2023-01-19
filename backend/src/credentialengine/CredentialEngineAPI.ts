import { searchAPI } from "./CredentialEngineConfig";
import { getRecordAPI } from "./CredentialEngineConfig";
import { credentialEngineFactory } from "../domain/credentialengine/CredentialEngineFactory";

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
  }
}
