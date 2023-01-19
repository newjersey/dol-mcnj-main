import { credentialEngineAPI } from "./CredentialEngineAPI"

const baseQuery = {
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
}

export const credentialEngineUtils = {

  /**
   *
   * @param skip part of pagination, number of results to skip
   * @param take part of pagination, number of results to return
   * @param sort CE provides several sorting methods
   *
   * @return a collection of credentials from Credential Engine that are Active and in NJ or online.
   *
   */
  getAllRecords: async function (skip:number, take:number, sort: string) {
    const response = await credentialEngineAPI.getResults(baseQuery, skip, take, sort);
    return response.data;
  },

  getResourceByCipCode: async function (skip:number, take:number, sort: string) {
    const query = {
      '@type': [
        'ceterms:InstructionalProgramClassification',
      ]
    }

    const response = await credentialEngineAPI.getResults(query, skip, take, sort);
    return response.data;
  }

}
