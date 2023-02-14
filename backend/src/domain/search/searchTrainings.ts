import { stripUnicode } from "../utils/stripUnicode";
import { FindTrainingsBy, SearchTrainings } from "../types";
import { TrainingResult } from "../training/TrainingResult";
import { Training } from "../training/Training";
import { SearchClient } from "./SearchClient";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";

import { Selector } from "../training/Selector";

export const searchTrainingsFactory = (
  findTrainingsBy: FindTrainingsBy,
  searchClient: SearchClient
): SearchTrainings => {
  return async (searchQuery: string): Promise<TrainingResult[]> => {
/*    console.log(searchQuery);
    const searchResults = await searchClient.search(searchQuery);
    const trainings = await findTrainingsBy(
      Selector.,
      searchResults.map((it) => it.id)
    );*/

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
        "ceterms:name": "${searchQuery}",
        "ceterms:description": "${searchQuery}",
        "ceterms:ownedBy": {
          "ceterms:name": "${searchQuery}"
        },
        "search:operator": "search:orTerms",
        "ceterms:availableOnlineAt": "search:anyValue",
        "ceterms:availableAt": {
            "ceterms:addressRegion": [
                "New Jersey",
                {
                    "search:value": "NJ",
                    "search:matchType": "search:exactMatch"
                }
            ]
        },
        "ceterms:requires": {
            "ceterms:targetLearningOpportunity": {
                "ceterms:availableAt": {
                    "ceterms:name": "${searchQuery}",
                    "ceterms:addressRegion": [
                        "New Jersey",
                        {
                            "search:value": "NJ",
                            "search:matchType": "search:exactMatch"
                        }
                    ]
                }
            }
        },
        "ceterms:offeredBy": {
            "ceterms:name": "${searchQuery}",
            "ceterms:address": {
                "ceterms:addressRegion": [
                    "New Jersey",
                    {
                        "search:value": "NJ",
                        "search:matchType": "search:exactMatch"
                    }
                ]
            }
        }     
      }
    }`
    const skip = 0;
    const take = 3;
    const sort = "^search:recordCreated";
    const ceRecordsResponse = await credentialEngineAPI.getResults(query, skip, take, sort);
    const trainings = ceRecordsResponse.data.data

    return Promise.all(
      trainings.map(async (training: Training) => {
/*        let highlight = "";
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
          city: training.provider.address.city,
          zipCode: training.provider.address.zipCode,
          county: training.provider.county,
          inDemand: training.inDemand,
          highlight: stripUnicode(highlight),
          rank: rank,
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
