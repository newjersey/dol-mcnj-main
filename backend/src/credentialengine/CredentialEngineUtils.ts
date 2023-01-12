import { credentialEngineAPI } from "./CredentialEngineAPI"

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
  getAllCredentials: async function (skip:number, take:number, sort: string) {
    const query = {
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
    const response = await credentialEngineAPI.getResults(query, skip, take, sort);
    return response.data;
  },

  getResourceByCtid: async function (ctid: string) {
    // TODO: Filter query by ctid
    const query = {
      'ceterms:credentialStatusType': {
        'ceterms:targetNode': 'credentialStat:Active'
      },
      'ceterms:requires': {
        'ceterms:targetAssessment': {
          'ceterms:availableOnlineAt': 'search:anyValue',
          'ceterms:availableAt': {
            'ceterms:addressRegion': [
              'New Jersey',
              'NJ'
            ]
          },
          'search:operator': 'search:orTerms'
        }
      }
    }

    const response = await credentialEngineAPI.getResults(query, 0, 1, sort);
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
