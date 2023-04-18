import { stripUnicode } from "../utils/stripUnicode";
import { FindTrainingsBy, SearchTrainings } from "../types";
import { TrainingResult } from "../training/TrainingResult";
import { Training } from "../training/Training";
import { SearchClient } from "./SearchClient";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";

import { Selector } from "../training/Selector";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import { CalendarLength } from "../CalendarLength";
import any = jasmine.any;

export const searchTrainingsFactory = (
  findTrainingsBy: FindTrainingsBy,
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
    const take = 5;
    const sort = "^search:relevance";
    const queryObj = JSON.parse(query);
    const ceRecordsResponse = await credentialEngineAPI.getResults(queryObj, skip, take, sort);

    const ceRecords = ceRecordsResponse.data.data as CTDLResource[];
      console.log(ceRecords.map(r => r["ceterms:ctid"]));

/*    const trainings = await findTrainingsBy(
      Selector.ID,
      ceRecords.map((it) => it["@id"])
    )
    console.log(JSON.stringify(trainings, null, 2));*/


    return Promise.all(
      ceRecords.map(async (certificate: CTDLResource) => {
        const desc = certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : null;
        let highlight:string = "";
        if (desc) {
          highlight = await credentialEngineUtils.getHighlight(desc, searchQuery);
        }

        const ownedBy = certificate["ceterms:ownedBy"] ? certificate["ceterms:ownedBy"] : [];
        const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedBy[0]);
        const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
        const ownedByAddressObject = ownedByRecord["ceterms:address"];
        const ownedByAddresses:any[] = [];

        if (ownedByAddressObject != null) {
          for (const element of ownedByAddressObject) {
            if (element["@type"] == "ceterms:Place") {

              const address = {
                city: element["ceterms:addressLocality"] ? element["ceterms:addressLocality"]["en-US"] : null,
                zipCode: element["ceterms:postalCode"],
              }
              ownedByAddresses.push(address);
            }
          }
        }


        const result = {
          id: certificate["ceterms:ctid"] ? certificate["ceterms:ctid"] : "",
          name: certificate["ceterms:name"] ? certificate["ceterms:name"]["en-US"] : "",
          cipCode: "",
          totalCost: 0,
          percentEmployed: 0,
          calendarLength: CalendarLength.NULL,
          localExceptionCounty: [],

         /*
          inDemand: training.inDemand,
          socCodes: training.occupations.map((o) => o.soc),
          languages: training.languages,
         */

          online: certificate["ceterms:availableOnlineAt"] != null ? true : false,
          providerId: ownedByCtid,
          providerName: ownedByRecord['ceterms:name']['en-US'],
          cities: ownedByAddresses.map(a => a.city),
          zipCodes: ownedByAddresses.map(a => a.zipCode),
          inDemand: false,
          highlight: highlight,
          socCodes: [],
          hasEveningCourses: false,
          languages: [],
          isWheelchairAccessible: false,
          hasJobPlacementAssistance: false,
          hasChildcareAssistance: false,
        };

        console.log(JSON.stringify(result));
        return result;
      })
    );
  };
};
