import * as Sentry from "@sentry/node";
import pLimit from "p-limit";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { CTDLResource } from "../credentialengine/CredentialEngine";
import { AllTrainingsResult } from "../training/TrainingResult";
import { AllTrainings } from "../types";
import { getAppBaseUrl } from "../../utils/getAppBaseUrl";
import redis from "../../infrastructure/redis/redisClient";

const PAGE_SIZE = 100;
const CONCURRENCY = 5;

export const allTrainings = (): AllTrainings => {
  return async (): Promise<AllTrainingsResult[]> => {
    const query = buildQuery();
    const env = process.env.NODE_ENV || "dev";
    const cacheKey = `all-trainings:${env}:${JSON.stringify(query)}`;

    // 1) Try Redis cache
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed: AllTrainingsResult[] = JSON.parse(cached);
        console.log("Returning cached results from Redis:", cacheKey, "len=", parsed.length);
        return parsed;
      }
    } catch (e) {
      console.warn("Redis GET failed, proceeding without cache:", e);
    }

    // 2) Build results fresh
    try {
      const results: AllTrainingsResult[] = [];
      const limit = pLimit(CONCURRENCY);

      const withRetry = async <T>(fn: () => Promise<T>, attempt = 1): Promise<T> => {
        try {
          return await fn();
        } catch (err) {
          if (attempt >= 3) throw err;
          const waitMs = 300 * Math.pow(2, attempt - 1);
          await new Promise((r) => setTimeout(r, waitMs));
          return withRetry(fn, attempt + 1);
        }
      };

      let skip = 0;
      const addressMemo = new Map<string, any[]>();
      const durationMemo = new Map<string, number>();

      const transform = async (learningOpportunity: CTDLResource): Promise<AllTrainingsResult> => {
        const training_id = (learningOpportunity["ceterms:ctid"] as string) || "";
        const title = learningOpportunity["ceterms:name"]?.["en-US"] || "";

        let address = addressMemo.get(training_id);
        if (!address) {
          address = await credentialEngineUtils.getAvailableAtAddresses(learningOpportunity);
          addressMemo.set(training_id, address);
        }

        let duration = durationMemo.get(training_id);
        if (duration == null) {
          duration = await credentialEngineUtils.getCalendarLengthId(learningOpportunity);
          durationMemo.set(training_id, duration);
        }

        const socName =
          learningOpportunity["ceterms:occupationType"]?.[0]?.["ceterms:targetNodeName"]?.["en-US"] ??
          "Not Available";
        const socCode =
          (learningOpportunity["ceterms:occupationType"]?.[0]?.["ceterms:codedNotation"] as string) ?? "999999";
        const socCodeReplaced = socCode.replace(/-/g, "").replace(/\.00$/, "");

        return {
          training_id,
          title,
          area: address?.[0]?.city ?? "",
          link: `${getAppBaseUrl()}/training/${training_id}`,
          duration,
          soc: socCodeReplaced,
          roi: 0,
          soc3: socCodeReplaced.substring(0, 3),
          id: `training#${training_id}`,
          method: "classroom",
          soc_name: socName,
          location: address?.[0]?.county ?? "",
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
          duration_units: "Weeks",
          duration_slider_val_min: duration.toString(),
          duration_slider_val_max: duration.toString(),
          duration_units_en: "Weeks",
          duration_units_es: "Semanas",
          duration_units_tl: "tuần",
          duration_units_zh: "周",
          duration_units_ja: "週間",
        };
      };

      while (true) {
        const pageData = await withRetry(async () => {
          const resp = await credentialEngineAPI.getResults(query, skip, PAGE_SIZE);
          return (resp.data?.data ?? []) as CTDLResource[];
        });

        if (!pageData.length) break;

        const pageResults = await Promise.all(pageData.map((item) => limit(() => transform(item))));
        results.push(...pageResults);

        if (pageData.length < PAGE_SIZE) break;
        skip += PAGE_SIZE;
      }

      // 3) Store in Redis (Node-Redis v4 syntax)
      try {
        await redis.set(cacheKey, JSON.stringify(results), "EX", 900); // Cache for 15 minutes
      } catch (e) {
        console.warn("Redis SET failed (cache will be cold):", e);
      }

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
    "@type": { "search:value": "ceterms:LearningOpportunityProfile", "search:matchType": "search:subClassOf" },
    "ceterms:lifeCycleStatusType": {
      "ceterms:targetNode": "lifeCycle:Active",
      "search:recordPublishedBy": process.env.CE_NJDOL_CTID,
    },
  };
}
