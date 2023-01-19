import { GetAllCertificates } from "../types";
import { Certificates } from "./CredentialEngineInterface";
import { api } from "./CredentialEngineConfig";

export const credentialEngineFactory = (): GetAllCertificates => {
  return async (
    skip: number,
    take: number,
    sort: string,
    // cancel: boolean
  ): Promise<Certificates> => {
    const gateway = `/assistant/search/ctdl`;

    const response = await api.request({
      url: `${gateway}`,
      method: "POST",
      data: {
        Query: {
          "@type": "ceterms:Certificate",
          "ceterms:credentialStatusType": {
            "ceterms:targetNode": "credentialStat:Active"
          },
          "ceterms:requires": {
            "ceterms:targetAssessment": {
              "ceterms:availableOnlineAt": "search:anyValue",
              "ceterms:availableAt": {
                "ceterms:addressRegion": [
                  "New Jersey",
                  "NJ"
                ]
              },
              "search:operator": "search:orTerms"
            }
          }
        },
        Skip: skip,
        Take: take,
        Sort: sort,
      },
      // retrieving the signal value by using the property name
      // signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
    });

    return response.data;
  };
};
