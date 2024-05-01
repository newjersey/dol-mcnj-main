import NodeCache from "node-cache";
import { SearchTrainings } from "../types";
import * as Sentry from "@sentry/node";
import { TrainingData } from "../training/TrainingResult";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import { CalendarLength } from "../CalendarLength";
import {
  getAvailableAtAddress,
} from "../training/findTrainingsBy";
import {DataClient} from "../DataClient";
import {getLocalExceptionCounties} from "../utils/getLocalExceptionCounties";

// Initializing a simple in-memory cache
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });
interface TermValue {
  "search:value": string;
  "search:matchType": string;
}

interface CodedNotation {
  "ceterms:codedNotation": TermValue;
}

interface SearchTerm {
  "ceterms:name"?: TermValue | string;
  "ceterms:description"?: TermValue | string;
  "ceterms:ownedBy"?: {
    "ceterms:name": TermValue;
  };
  "ceterms:occupationType"?: CodedNotation;
  "ceterms:instructionalProgramType"?: CodedNotation;
  "ceterms:availableOnlineAt"?: string;
  "ceterms:availableAt"?: {
    "ceterms:addressRegion": TermValue[];
  };
  "ceterms:credentialStatusType"?: {
    "ceterms:targetNode": string;
  };
  "search:recordPublishedBy"?: string;
  "search:operator": string;
}

interface TermGroup {
  "search:value": SearchTerm[];
  "search:operator": string;
}

interface Query {
  "@type": TermValue;
  "search:termGroup": TermGroup;
}


export const searchTrainingsFactory = (dataClient: DataClient): SearchTrainings => {
  return async (params): Promise<TrainingData> => {
    const inDemandCIPs = await dataClient.getCIPsInDemand();
    const inDemandCIPCodes = inDemandCIPs?.map((c) => c.cipcode);

    const page = params.page || 1;
    const limit = params.limit || 10;
    let sort;
    switch (params.sort) {
      case "asc":
        sort = "ceterms:name";
        break;
      case "desc":
        sort = "^ceterms:name";
        break;
      case "price_asc":
      case "price_desc":
      case "EMPLOYMENT_RATE":
        sort = params.sort; // Just save the sorting preference
        break;
      case "best_match":
        sort = "^search:relevance";
        break;
      default:
        sort = "^search:relevance";
        break;
    }
    const cacheKey = `searchQuery-${params.searchQuery}-${page}-${limit}-${sort}`;
    if (cache.has(cacheKey)) {
      const cachedResults = cache.get<TrainingData>(cacheKey);
      console.log("Returning cached results");
      if (cachedResults === undefined) {
        throw new Error("Cached results are unexpectedly undefined.");
      }
      return cachedResults;
    }

    const isSOC = /^\d{2}-?\d{4}(\.00)?$/.test(params.searchQuery);
    const isCIP = /^\d{2}\.?\d{4}$/.test(params.searchQuery);

    const query: Query = {
      "@type": {
        "search:value": "ceterms:Credential",
        "search:matchType": "search:subClassOf"
      },
      "search:termGroup": {
        "search:operator": "search:andTerms",  // Logical grouping at the highest level
        "search:value": [
          {
            "search:operator": "search:orTerms",  // Logical grouping for these terms
            "ceterms:name": params.searchQuery,
            "ceterms:description":  params.searchQuery,
            "ceterms:ownedBy": {
              "ceterms:name": {
                "search:value": params.searchQuery,
                "search:matchType": "search:contains"
              }
            },
            "ceterms:occupationType": isSOC ? { "ceterms:codedNotation": {"search:value": params.searchQuery, "search:matchType": "search:startsWith"} } : undefined,
            "ceterms:instructionalProgramType": isCIP ? { "ceterms:codedNotation": {"search:value": params.searchQuery, "search:matchType": "search:startsWith"} } : undefined,
          },
          {
            "search:operator": "search:orTerms",  // Logical grouping for these terms
            "ceterms:availableOnlineAt": "search:anyValue",
            "ceterms:availableAt": {
              "ceterms:addressRegion": [
                {
                  "search:value": "NJ",
                  "search:matchType": "search:exactMatch"
                },
                {
                  "search:value": "jersey",
                  "search:matchType": "search:exactMatch"
                }
              ]
            }
          },
          {
            "search:operator": "search:andTerms",  // Logical grouping for these terms
            "ceterms:credentialStatusType": {
              "ceterms:targetNode": "credentialStat:Active"
            },
            "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d"
          }
        ]
      }
    };


    const skip = (page - 1) * limit;
    const take = limit;
    const queryObj = JSON.parse(JSON.stringify(query));
    console.log(JSON.stringify(queryObj));

    const ceRecordsResponse = await credentialEngineAPI
      .getResults(queryObj, skip, take, sort)
      .catch((error) => {
        Sentry.captureException(error);
        console.log(error);
        throw new Error("Failed to fetch results from Credential Engine API");
      });
    const totalResults = ceRecordsResponse.data.extra.TotalResults;
    const totalPages = Math.ceil(totalResults / limit);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;
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
        const desc = certificate["ceterms:description"]
          ? certificate["ceterms:description"]["en-US"]
          : null;
        let highlight = "";
        if (desc) {
          highlight = await credentialEngineUtils.getHighlight(desc, params.searchQuery);
        }

        const ownedBy = certificate["ceterms:ownedBy"] ? certificate["ceterms:ownedBy"] : [];
        const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedBy[0]);
        const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
        const ownedByAddressObject = ownedByRecord["ceterms:address"];
        const ownedByAddresses = [];
        const address = getAvailableAtAddress(certificate);
        if (ownedByAddressObject != null) {
          for (const element of ownedByAddressObject) {
            if (element["@type"] == "ceterms:Place" && element["ceterms:addressLocality"] != null) {
              const address = {
                city: element["ceterms:addressLocality"]
                  ? element["ceterms:addressLocality"]["en-US"]
                  : null,
                zipCode: element["ceterms:postalCode"],
              };
              ownedByAddresses.push(address);
            }
          }
        }

        const cipCode = await credentialEngineUtils.extractCipCode(certificate);

        return {
          id: certificate["ceterms:ctid"] ? certificate["ceterms:ctid"] : "",
          name: certificate["ceterms:name"] ? certificate["ceterms:name"]["en-US"] : "",
          cipCode: await credentialEngineUtils.extractCipCode(certificate),
          totalCost: await credentialEngineUtils.extractCost(certificate, "costType:AggregateCost"),
          percentEmployed: await credentialEngineUtils.extractEmploymentData(certificate),
          calendarLength: CalendarLength.NULL,
          localExceptionCounty: await getLocalExceptionCounties(dataClient, cipCode),

          /*
            socCodes: training.occupations.map((o) => o.soc),
            languages: training.languages,
          */

          online: certificate["ceterms:availableOnlineAt"] != null ? true : false,
          providerId: ownedByCtid,
          providerName: ownedByRecord["ceterms:name"]["en-US"],
          // cities: ownedByAddresses.map((a) => a.city),
          // zipCodes: ownedByAddresses.map((a) => a.zipCode),
          availableAt: address,
          inDemand: inDemandCIPCodes.includes(cipCode ?? ""),
          highlight: highlight,
          socCodes: [],
          hasEveningCourses: false,
          languages: "",
          isWheelchairAccessible: false,
          hasJobPlacementAssistance: false,
          hasChildcareAssistance: false,
          totalClockHours: null,
        };
      }),
    );

    if (sort === "price_asc" || sort === "price_desc") {
      results.sort((a, b) => sort === "price_asc" ? (a.totalCost || 0) - (b.totalCost || 0) : (b.totalCost || 0) - (a.totalCost || 0));
    } else if (sort === "EMPLOYMENT_RATE") {
      results.sort((a, b) => (b.percentEmployed || 0) - (a.percentEmployed || 0));
    }

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
        previousPage: hasPreviousPage ? page - 1 : null,
      },
    };
    // Cache the final results before returning
    cache.set(cacheKey, data);
    return data;
  };
};
