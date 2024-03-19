import NodeCache from 'node-cache';
import { FindTrainingsBy, SearchTrainings } from "../types";
import * as Sentry from "@sentry/node";
import { TrainingData } from "../training/TrainingResult";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import { CalendarLength } from "../CalendarLength";

// Initializing a simple in-memory cache
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

export const searchTrainingsFactory = (
  findTrainingsBy: FindTrainingsBy,): SearchTrainings => {
  return async (params): Promise<TrainingData> => {
    const page = params.page || 1
    const limit = params.limit || 10
    const cacheKey = `searchQuery-${params.searchQuery}-${page}-${limit}`;
    if(cache.has(cacheKey)) {
      const cachedResults = cache.get<TrainingData>(cacheKey);
      console.log("Returning cached results");
      if (cachedResults === undefined) {
        throw new Error('Cached results are unexpectedly undefined.');
      }
      return cachedResults;

    }
    const query = `
      {
        "search:termGroup": {
          "search:value": [
            {
              "ceterms:name": "${params.searchQuery}",
              "ceterms:description": "${params.searchQuery}",
              "ceterms:ownedBy": {
                        "ceterms:name": "${params.searchQuery}"
                    },
              "search:operator": "search:orTerms"
            },
            {
              "ceterms:availableOnlineAt": "search:anyValue",
              "ceterms:availableAt": {
                "ceterms:address": {
                  "ceterms:addressRegion": [
                    {
                      "search:value": "NJ",
                      "search:value": "jersey",
                      "search:matchType": "search:exactMatch"
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

    const skip = (page-1) * limit;
    const take = limit;
    const sort = "^search:relevance";
    const queryObj = JSON.parse(query);
    
    
    const ceRecordsResponse = await credentialEngineAPI.getResults(queryObj, skip, take, sort).catch(error => {
      Sentry.captureException(error);
      throw new Error("Failed to fetch results from Credential Engine API");
    });
    const totalResults = ceRecordsResponse.data.extra.TotalResults
    const totalPages = Math.ceil(totalResults / limit)
    const hasPreviousPage = page > 1; 
    const hasNextPage = page < totalPages
    const ceRecords = ceRecordsResponse.data.data as CTDLResource[];

      // console.log(ceRecords.map(r => r["ceterms:ctid"]));

/*    const trainings = await findTrainingsBy(
      Selector.ID,
      ceRecords.map((it) => it["@id"])
    )
    console.log(JSON.stringify(trainings, null, 2));*/


// Transform and cache each training result
    
    const results = await Promise.all(
      ceRecords.map(async (certificate: CTDLResource) => {
        const desc = certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : null;
        let highlight = "";
        if (desc) {
          highlight = await credentialEngineUtils.getHighlight(desc, params.searchQuery);
        }

        const ownedBy = certificate["ceterms:ownedBy"] ? certificate["ceterms:ownedBy"] : [];
        const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedBy[0]);
        const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
        const ownedByAddressObject = ownedByRecord["ceterms:address"];
        const ownedByAddresses:any[] = [];

        if (ownedByAddressObject != null) {
          for (const element of ownedByAddressObject) {
            if (element["@type"] == "ceterms:Place" && element["ceterms:addressLocality"] != null) {

              const address = {
                city: element["ceterms:addressLocality"] ? element["ceterms:addressLocality"]["en-US"] : null,
                zipCode: element["ceterms:postalCode"],
              }
              ownedByAddresses.push(address);
            }
          }
        }


        return {
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
          totalClockHours: 0 // TODO: Implement Total Clock Hours replacement
        };
      })
    );

    const data = {
      data: results,
      meta: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalResults,
        itemsPerPage: limit,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        nextPage: hasNextPage ? page + 1 : null,
        previousPage: hasPreviousPage ? page -1 : null
      }
  }
    // Cache the final results before returning
    cache.set(cacheKey, data);
    return data
  };
};
