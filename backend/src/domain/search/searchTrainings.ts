import { stripUnicode } from "../utils/stripUnicode";
import { FindTrainingsBy, SearchTrainings } from "../types";
import { TrainingResult } from "../training/TrainingResult";
import { Training } from "../training/Training";
import { SearchClient } from "./SearchClient";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";

import { Selector } from "../training/Selector";
import { CTDLResource } from "../credentialengine/CredentialEngine";

export const searchTrainingsFactory = (
  findTrainingsBy: FindTrainingsBy,
  searchClient: SearchClient
): SearchTrainings => {
  return async (searchQuery: string): Promise<TrainingResult[]> => {
    const query = `{
      "@type": [
            "ceterms:ApprenticeshipCertificate",
            "ceterms:AssociateDegree",
            "ceterms:BachelorDegree",
            "ceterms:Badge",
            "ceterms:Certificate",
            "ceterms:CertificateOfCompletion",
            "ceterms:Certification",
            "ceterms:Degree",
            "ceterms:DigitalBadge",
            "ceterms:Diploma",
            "ceterms:DoctoralDegree",
            "ceterms:GeneralEducationDevelopment",
            "ceterms:JourneymanCertificate",
            "ceterms:License",
            "ceterms:MasterCertificate",
            "ceterms:MasterDegree",
            "ceterms:MicroCredential",
            "ceterms:OpenBadge",
            "ceterms:ProfessionalDoctorate",
            "ceterms:QualityAssuranceCredential",
            "ceterms:ResearchDoctorate",
            "ceterms:SecondarySchoolDiploma"
      ],
      "ceterms:credentialStatusType": {
            "ceterms:targetNode": "credentialStat:Active"
          },
      "search:termGroup": {
        "search:value": [
          {
            "ceterms:name": "${searchQuery}",
                    "ceterms:description": "${searchQuery}",
                    "ceterms:ownedBy": {
                        "ceterms:name": "${searchQuery}"
                    },
            "search:operator": "search:orTerms"
          },
          {
            "ceterms:availableOnlineAt": "search:anyValue",
            "ceterms:ownedBy": {
              "ceterms:address": {
                "ceterms:addressRegion": [
                  {
                    "search:value": "NJ",
                    "search:matchType": "search:exactMatch"
                  },
                  {
                    "search:value": "jersey"
                  }
                ]
              }
            },
            "ceterms:offeredBy": {
              "ceterms:address": {
                "ceterms:addressRegion": [
                  {
                    "search:value": "NJ",
                    "search:matchType": "search:exactMatch"
                  },
                  {
                    "search:value": "jersey"
                  }
                ]
              }
            },
            "ceterms:availableAt": {
              "ceterms:address": {
                "ceterms:addressRegion": [
                  {
                    "search:value": "NJ",
                    "search:matchType": "search:exactMatch"
                  },
                  {
                    "search:value": "jersey"
                  }
                ]
              }
            },
            "search:operator": "search:orTerms"
          }
        ],
        "search:operator": "search:andTerms"
      }
    }`

    const skip = 0;
    const take = 10;
    const sort = "^search:relevance";
    const queryObj = JSON.parse(query);
    const ceRecordsResponse = await credentialEngineAPI.getResults(queryObj, skip, take, sort);

    const ceRecords = ceRecordsResponse.data.data as CTDLResource[];
    /*     console.log("HELLO");
        console.log(ceRecords);*/

    const trainings = await findTrainingsBy(
      Selector.ID,
      ceRecords.map((it) => it["@id"])
    )
    console.log(JSON.stringify(trainings, null, 2));


    return Promise.all(
      trainings.map(async (training: Training) => {
        /*let highlight = "";
        let rank = 0;

        if (searchQuery) {
          highlight = await searchClient.getHighlight(training.id, searchQuery);
        }

        if (searchResults) {
          const foundRank = searchResults.find((it) => it.id === training.id)?.rank;
          if (foundRank) {
            rank = foundRank;
          }
        }*/


        const highlight = await credentialEngineUtils.getHighlight(training.description, searchQuery);

        return {
          id: training.id,
          name: training.name,
          cipCode: training.cipCode,
          totalCost: training.totalCost,
          percentEmployed: training.percentEmployed,
          calendarLength: training.calendarLength,
          localExceptionCounty: training.localExceptionCounty,
          online: training.online,
          providerId: training.provider.id,
          providerName: training.provider.name,
          cities: training.provider.addresses ? training.provider.addresses.map(a => a.city) : [],
          zipCodes: training.provider.addresses ? training.provider.addresses.map(a => a.zipCode) : [],
          inDemand: training.inDemand,
          highlight: highlight ? highlight : "",
          //rank: rank,
          rank: 0,
          socCodes: training.occupations.map((o) => o.soc),
          hasEveningCourses: training.hasEveningCourses,
          languages: training.languages,
          isWheelchairAccessible: training.isWheelchairAccessible,
          hasJobPlacementAssistance: training.hasJobPlacementAssistance,
          hasChildcareAssistance: training.hasChildcareAssistance,
        };
      })
    );
  };
};
