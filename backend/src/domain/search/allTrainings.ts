import * as Sentry from "@sentry/node";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import NodeCache from "node-cache";
import { AllTrainingsResult } from "../training/TrainingResult";
import { AllTrainings } from "../types";

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 3600 });

export const allTrainings = (): AllTrainings => {
  return async (): Promise<AllTrainingsResult[]> => {
    const query = buildQuery();
    let ceRecordsResponse1;

    const cacheKey = 'all-trainings';
    const cachedResults: Promise<AllTrainingsResult[]> | undefined = cache.get(cacheKey);

    if (cachedResults) {
      console.log("Returning cached results for key:", cacheKey);
      return cachedResults;
    }

    try {
      ceRecordsResponse1 = await credentialEngineAPI.getResults(query, 0, 1, "^search:relevance");
      const totalResults = ceRecordsResponse1.data.extra.TotalResults;
      const batchSize = 100;
      let allRecords: CTDLResource[] = [];

      const fetchBatch = async (skip: number) => {
        const response = await credentialEngineAPI.getResults(query, skip, batchSize, "^search:relevance");
        return response.data.data as CTDLResource[];
      };

      const batchPromises = [];
      for (let skip = 0; skip < totalResults; skip += batchSize) {
        batchPromises.push(fetchBatch(skip));
      }

      const batchResults = await Promise.all(batchPromises);
      allRecords = batchResults.flat();

      const results = await Promise.all(allRecords.map(certificate => transformCertificateToTraining(certificate)));
      cache.set(cacheKey, results);
      return results;

    } catch (error) {
      Sentry.captureException(error);
      console.error("Error fetching results from Credential Engine API:", error);
      throw new Error("Failed to fetch results from Credential Engine API.");
    }
  };
};

function buildQuery() {
  return {
    "@type": {
      "search:value": "ceterms:LearningOpportunityProfile",
      "search:matchType": "search:subClassOf"
    },
    "ceterms:lifeCycleStatusType": {
      "ceterms:targetNode": "lifeCycle:Active"
    },
    "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d"
  };
}

async function transformCertificateToTraining(certificate: CTDLResource): Promise<AllTrainingsResult> {
  try {
    const address = await credentialEngineUtils.getAvailableAtAddresses(certificate);
    const cipCode = await credentialEngineUtils.extractCipCode(certificate);
    const socName = certificate["ceterms:occupationType"] && certificate["ceterms:occupationType"][0] && certificate["ceterms:occupationType"][0]["ceterms:targetNodeName"] && certificate["ceterms:occupationType"][0]["ceterms:targetNodeName"]["en-US"]
      ? certificate["ceterms:occupationType"][0]["ceterms:targetNodeName"]["en-US"] as string : 'Not Available';
    const socCode = certificate["ceterms:occupationType"] ? certificate["ceterms:occupationType"][0]["ceterms:codedNotation"] as string : '999999';
    const socCodeReplaced = socCode.replace(/-/g, '').replace(/\.00$/, '');

    return {
      training_id: certificate["ceterms:ctid"] || "",
      title: certificate["ceterms:name"]?.["en-US"] || "",
      area: address.length > 0 ? address[0].city as string : "",
      link: `https://mycareer.nj.gov/training/${cipCode}`,
      duration: 15.0, //TODO: replace with actual duration
      soc: socCodeReplaced,
      roi: 0,
      soc3:socCodeReplaced.substring(0, 3),
      id: `training#${cipCode}`,
      method: `classroom`,
      soc_name: socName,
      location: address.length > 0 ? address[0].county as string : "",
      title_en: certificate["ceterms:name"]?.["en-US"] || "",
      soc_name_en: socName,
      title_es: certificate["ceterms:name"]?.["en-US"] || "",
      soc_name_es: socName,
      title_tl: certificate["ceterms:name"]?.["en-US"] || "",
      soc_name_tl: socName,
      title_zh: certificate["ceterms:name"]?.["en-US"] || "",
      soc_name_zh: socName,
      title_ja: certificate["ceterms:name"]?.["en-US"] || "",
      soc_name_ja: socName,
      duration_units: `Weeks`,
      duration_slider_val_min: `15.0`,
      duration_slider_val_max: `15.0`,
      duration_units_en: `Weeks`,
      duration_units_es: `Semanas`,
      duration_units_tl: `tuần`,
      duration_units_zh: `周`,
      duration_units_ja: `週間`,
    };
  } catch (error) {
    console.error("Error transforming certificate to training:", error);
    throw error;
  }
}