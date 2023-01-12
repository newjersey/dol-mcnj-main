import { api } from "./CredentialEngineConfig";

const gateway = `/assistant/search/ctdl`;

export const credentialEngineAPI = {
  /**
   *
   * @param query this should be a JSON-LD blob representing specific CE term collections.
   * @param skip part of pagination, number of results to skip
   * @param take part of pagination, number of results to return
   * @param sort CE provides several sorting methods
   * @param cancel boolean value for canceling API request
   *
   * @return a collection of results from Credential Engine.
   *
   */
  getAllCertificates: async function (skip: number, take: number, sort: string) {
    const response = await api.request({
      url: `${gateway}`,
      method: "post",
      data: {
        Query: {
          "@type": "ceterms:Certificate",
        },
        Skip: skip,
        Take: take,
        Sort: sort,
      },
      // retrieving the signal value by using the property name
      // signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
    });

    // return "Connection works.";
    return response.data.getAllCredentials;
  },

  getCertificate: async function () {
    const response = await api.request({
      url: `${gateway}`,
      method: "POST",
      data: {
        Query: {
          "@type": "ceterms:Certificate",
        },
        Skip: 0,
        Take: 5,
        Sort: "search:recordCreated",
      },
      // retrieving the signal value by using the property name
      // signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
    });

    return response.data.getAllCredentials;
  },
};
