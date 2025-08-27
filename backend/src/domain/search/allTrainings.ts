import * as Sentry from "@sentry/node";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineCacheService } from "../../infrastructure/redis/CredentialEngineCacheService";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import NodeCache from "node-cache";
import { AllTrainingsResult } from "../training/TrainingResult";
import { AllTrainings } from "../types";
import * as process from "node:process";

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
      ceRecordsResponse1 = await credentialEngineCacheService.getResults(query, 0, 1);
      const totalResults = ceRecordsResponse1.data.extra.TotalResults;
      const batchSize = 100;
      let allRecords: CTDLResource[] = [];

      const fetchBatch = async (skip: number) => {
        const response = await credentialEngineCacheService.getResults(query, skip, batchSize);
        return response.data.data as CTDLResource[];
      };

      const batchPromises = [];
      for (let skip = 0; skip < totalResults; skip += batchSize) {
        batchPromises.push(fetchBatch(skip));
      }

      const batchResults = await Promise.all(batchPromises);
      allRecords = batchResults.flat();

      const results = await Promise.all(allRecords.map(certificate => transformLearningOpportunityCTDLToTrainingResult(certificate)));
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
    "search:recordPublishedBy": process.env.CE_NJDOL_CTID
  };
}

async function transformLearningOpportunityCTDLToTrainingResult(learningOpportunity: CTDLResource): Promise<AllTrainingsResult> {
  try {
    const training_id = learningOpportunity["ceterms:ctid"] || "";
    const title = learningOpportunity["ceterms:name"]?.["en-US"] || "";
    const address = await credentialEngineUtils.getAvailableAtAddresses(learningOpportunity);
    //const cipCode = await credentialEngineUtils.extractCipCode(learningOpportunity);
    const socName = learningOpportunity["ceterms:occupationType"] && learningOpportunity["ceterms:occupationType"][0] && learningOpportunity["ceterms:occupationType"][0]["ceterms:targetNodeName"] && learningOpportunity["ceterms:occupationType"][0]["ceterms:targetNodeName"]["en-US"]
      ? learningOpportunity["ceterms:occupationType"][0]["ceterms:targetNodeName"]["en-US"] as string : 'Not Available';
    const socCode = learningOpportunity["ceterms:occupationType"] ? learningOpportunity["ceterms:occupationType"][0]["ceterms:codedNotation"] as string : '999999';
    const socCodeReplaced = socCode.replace(/-/g, '').replace(/\.00$/, '');
    const duration = await credentialEngineUtils.getCalendarLengthId(learningOpportunity);

    return {
      training_id: training_id,
      title: title,
      area: address.length > 0 ? address[0].city as string : "",
      link: `https://mycareer.nj.gov/training/${training_id}`,
      duration: duration,
      soc: socCodeReplaced,
      roi: 0,
      soc3:socCodeReplaced.substring(0, 3),
      id: `training#${training_id}`,
      method: `classroom`,
      soc_name: socName,
      location: address.length > 0 ? address[0].county as string : "",
      title_en: title,
      soc_name_en: socName,
      title_es: title,
      soc_name_es: socName,
      title_tl: title,
      soc_name_tl: socName,
      title_zh: title,
      soc_name_zh: socName,
      title_ja: title,
      soc_name_ja: socName,
      duration_units: `Weeks`,
      duration_slider_val_min: duration.toString(),
      duration_slider_val_max: duration.toString(),
      duration_units_en: `Weeks`,
      duration_units_es: `Semanas`,
      duration_units_tl: `tuần`,
      duration_units_zh: `周`,
      duration_units_ja: `週間`,
    };
  } catch (error) {
    console.error("Error transforming learning opportunity to trainingresult:", error);
    throw error;
  }
}
