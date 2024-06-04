
import zipcodeJson from "../utils/zip-county.json";
import zipcodes from "zipcodes";
export function buildQuery(params: {
  searchQuery: string,
  county?: string,
  miles?: number,
  zipcode?: string
}) {
  const isSOC = /^\d{2}-?\d{4}(\.00)?$/.test(params.searchQuery);
  const isCIP = /^\d{2}\.?\d{4}$/.test(params.searchQuery);
  const isZipCode = zipcodes.lookup(params.searchQuery);
  const isCounty = Object.keys(zipcodeJson.byCounty).includes(params.searchQuery);

  const miles = params.miles;
  const zipcode = params.zipcode;

  let zipcodesList: string[] | zipcodes.ZipCode[] = []

  if (isZipCode) {
    zipcodesList = [params.searchQuery]
  } else if (isCounty) {
    zipcodesList = zipcodeJson.byCounty[params.searchQuery as keyof typeof zipcodeJson.byCounty]
  }

  if (params.county) {
    zipcodesList = zipcodeJson.byCounty[params.county as keyof typeof zipcodeJson.byCounty]
  }

  if (miles && miles > 0 && zipcode) {
    const zipcodesInRadius = zipcodes.radius(zipcode, miles);
    zipcodesList = zipcodesInRadius;
  }

  return {
    "@type": {
      "search:value": "ceterms:Credential",
      "search:matchType": "search:subClassOf",
    },
    "search:termGroup": {
      "search:operator": "search:andTerms",
      "search:value": [
        {
          "search:operator": "search:orTerms",
          ...(isSOC || isCIP || !!isZipCode || isCounty ? {} : {
            "ceterms:name": params.searchQuery,
            "ceterms:description": params.searchQuery,
            "ceterms:ownedBy": { "ceterms:name": { "search:value": params.searchQuery, "search:matchType": "search:contains" } }
          }),
          "ceterms:occupationType": isSOC ? {
            "ceterms:codedNotation": { "search:value": params.searchQuery, "search:matchType": "search:startsWith" }
          } : undefined,
          "ceterms:instructionalProgramType": isCIP ? {
            "ceterms:codedNotation": { "search:value": params.searchQuery, "search:matchType": "search:startsWith" }
          } : undefined
        },{
          "ceterms:availableAt": {
            "ceterms:postalCode": zipcodesList
          }
        },
        {
          "search:operator": "search:andTerms",
          "ceterms:credentialStatusType": {
            "ceterms:targetNode": "credentialStat:Active",
          },
          "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d",
        },
      ],
    },
  };
}