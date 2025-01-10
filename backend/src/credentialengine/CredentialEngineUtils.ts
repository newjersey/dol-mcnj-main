import {
  CetermsAccommodationType,
  CetermsAggregateData,
  CetermsConditionProfile,
  CetermsContactPoint,
  CetermsPlace,
  CetermsServiceType,
  CTDLResource,
} from "../domain/credentialengine/CredentialEngine";
import { Occupation } from "../domain/occupations/Occupation";
import {Address, Provider} from "../domain/training/Training";
import { convertZipCodeToCounty } from "../domain/utils/convertZipCodeToCounty";
import { credentialEngineAPI } from "./CredentialEngineAPI";
import { DeliveryType } from "../domain/DeliveryType";
import { processInBatches } from "../utils/concurrencyUtils";

const logError = (message: string, error: Error) => {
  console.error(`${message}: ${error.message}`);
};

import { AxiosError } from "axios";
import NodeCache from "node-cache";

const providerCache = new NodeCache({ stdTTL: 3600 });

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number,
  context?: string // Optional: Name of the calling function or additional context
): Promise<T> => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.status === 503 &&
        attempt < retries - 1
      ) {
        console.error(
          `503 Error on attempt ${attempt + 1} in ${
            context || "retryWithBackoff"
          }. Retrying in ${delay}ms.`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
        delay *= 2; // Exponential backoff
      } else {
        console.error(
          `Error in ${context || "retryWithBackoff"}: ${error}`
        );
        throw error; // Propagate non-503 errors
      }
    }
  }

  throw new Error(
    `503 Error after ${retries} attempts in ${context || "retryWithBackoff"}`
  );
};



const validateCtId = async (id: string): Promise<boolean> => {
  const pattern = /^ce-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  try {
    return pattern.test(id);
  } catch (error) {
    logError(`Error validating CTID: ${id}`, error as Error);
    throw error;
  }
};

const getCtidFromURL = async (url: string): Promise<string> => {
  try {
    const lastSlashIndex = url.lastIndexOf("/");
    return url.substring(lastSlashIndex + 1);
  } catch (error) {
    logError(`Error extracting CTID from URL: ${url}`, error as Error);
    throw error;
  }
};

const fetchCertificateData = async (url: string): Promise<CTDLResource | null> => {
  try {
    const ctid = await getCtidFromURL(url);
    const query = {
      "ceterms:ctid": ctid,
      "search:recordPublishedBy": "ce-cc992a07-6e17-42e5-8ed1-5b016e743e9d",
    };
    const response = await credentialEngineAPI.getResults(query, 0, 10);
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    logError(`Error fetching data for CTID`, error as Error);
    return null;
  }
};

const fetchValidCEData = async (urls: string[]): Promise<CTDLResource[]> => {
  try {
    const processFn = async (url: string): Promise<CTDLResource | null> => {
      // Validate CTID before processing
      if (!(await validateCtId(url))) {
        console.error(`Invalid CE ID: ${url}`);
        return null;
      }

      // Fetch certificate data with retry and exponential backoff
      return await retryWithBackoff(
        () => fetchCertificateData(url),
        3, // Max retries
        1000, // Initial delay in ms
        `fetchValidCEData for URL: ${url}`
      );
    };

    // Use processInBatches for concurrency and retries
    const results = await processInBatches<CTDLResource | null>(
      urls,
      processFn,
      3, // Concurrency limit
      3, // Max retries per batch task
      1000 // Initial delay for backoff
    );

    // Filter out null results
    return results.filter((record): record is CTDLResource => record !== null);
  } catch (error) {
    logError(`Error fetching valid CE data`, error as Error);
    throw error;
  }
};

/**
 * Fetch provider data for a given certificate.
 * Utilizes a cache to avoid repeated HTTP requests for the same provider.
 * @param {CTDLResource} certificate - The certificate object containing provider information.
 * @returns {Promise<object | null>} - The provider data or null if unavailable.
 */
async function getProviderData(certificate: CTDLResource): Promise<Provider | null> {
  try {
    // Check if "ownedBy" exists in the certificate
    const ownedByUrl = certificate["ceterms:ownedBy"]?.[0];
    if (!ownedByUrl) {
      console.warn("OwnedBy field is missing in the certificate.");
      return null;
    }

    // Extract the CTID from the "ownedBy" URL
    const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedByUrl);

    // Validate the CTID format
    if (!(await credentialEngineUtils.validateCtId(ownedByCtid))) {
      throw new Error(`Invalid CTID format: ${ownedByCtid}`);
    }

    // Check if the data is already in the cache
    const cachedProvider = providerCache.get(ownedByCtid);
    if (cachedProvider) {
      console.log(`Cache hit for provider CTID: ${ownedByCtid}`);
      return cachedProvider as Provider;
    }

    console.log(`Cache miss for provider CTID: ${ownedByCtid}. Fetching data...`);

    // Fetch the provider record using the CTID
    const providerRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);

    if (!providerRecord) {
      console.warn(`Provider record not found for CTID: ${ownedByCtid}`);
      return null;
    }

    // Extract provider details using utility functions
    const providerId = providerRecord["ceterms:identifier"]?.find(
      (identifier: {
        "ceterms:identifierTypeName": { "en-US": string };
        "ceterms:identifierValueCode": string;
      }) =>
        identifier["ceterms:identifierTypeName"]?.["en-US"] === "NJDOL Provider ID"
    )?.["ceterms:identifierValueCode"];

    const providerData: Provider = {
      ctid: providerRecord["ceterms:ctid"] || "",
      providerId: providerId || "",
      name: providerRecord["ceterms:name"]?.["en-US"] || "Unknown Provider",
      url: providerRecord["ceterms:subjectWebpage"] || "",
      email: providerRecord["ceterms:email"]?.[0] || "",
      addresses: await credentialEngineUtils.getAddress(providerRecord), // No additional mapping required
    };

    // Cache the provider data using the CTID as the key
    providerCache.set(ownedByCtid, providerData);
    console.log(`Cached provider data for CTID: ${ownedByCtid}`);

    return providerData;
  } catch (error) {
    console.error("Error fetching provider data:", error);
    return null;
  }
}
const getAddress = async (resource: CTDLResource): Promise<Address[]> => {
  try {
    const addresses = resource["ceterms:address"] ?? [];
    return addresses.map((address) => {
      const zipCode = address["ceterms:postalCode"] ?? "";
      return {
        "@type": "ceterms:Place", // Add required @type field
        street_address: address["ceterms:streetAddress"]?.["en-US"] ?? "",
        city: address["ceterms:addressLocality"]?.["en-US"] ?? "",
        state: address["ceterms:addressRegion"]?.["en-US"] ?? "",
        zipCode,
        county: convertZipCodeToCounty(zipCode) ?? "",
        targetContactPoints: (address["ceterms:targetContactPoint"] || []).map(
          (contactPoint: CetermsContactPoint) => ({
            name: contactPoint["ceterms:name"]?.["en-US"] ?? "",
            contactType: contactPoint["ceterms:contactType"]?.["en-US"] ?? "",
            email: contactPoint["ceterms:email"] ?? [],
            telephone: contactPoint["ceterms:telephone"] ?? [],
          })
        ),
      } as Address;
    });
  } catch (error) {
    logError(`Error getting ceterms:address`, error as Error);
    throw error;
  }
};


const getAvailableAtAddresses = async (certificate: CTDLResource): Promise<Address[]> => {
  try {
    const availableAt = certificate["ceterms:availableAt"] ?? [];

    return availableAt.map((location: CetermsPlace) => {
      const zipCode = location["ceterms:postalCode"] ?? "";

      // Map contact points if they exist
      const targetContactPoints = (location["ceterms:targetContactPoint"] || []).map(
        (contactPoint: CetermsContactPoint) => ({
          name: contactPoint["ceterms:name"]?.["en-US"] ?? "Name not specified",
          contactType: contactPoint["ceterms:contactType"]?.["en-US"] ?? "Type not specified",
          email: contactPoint["ceterms:email"] ?? [],
          telephone: contactPoint["ceterms:telephone"] ?? [],
        })
      );

      return {
        "@type": "ceterms:Place",
        street_address: location["ceterms:streetAddress"]?.["en-US"] ?? "",
        city: location["ceterms:addressLocality"]?.["en-US"] ?? "",
        state: location["ceterms:addressRegion"]?.["en-US"] ?? "",
        zipCode,
        county: convertZipCodeToCounty(zipCode) ?? "",
        targetContactPoints, // Add the contact points
      } as Address;
    });
  } catch (error) {
    logError(`Error getting available addresses`, error as Error);
    throw error;
  }
};

const extractCipCode = async (certificate: CTDLResource): Promise<string> => {
  try {
    const instructionalProgramTypes = certificate["ceterms:instructionalProgramType"];
    if (Array.isArray(instructionalProgramTypes)) {
      for (const programType of instructionalProgramTypes) {
        if (
          programType["ceterms:frameworkName"]?.["en-US"] ===
          "Classification of Instructional Programs"
        ) {
          return (programType["ceterms:codedNotation"] || "").replace(/[^\w\s]/g, "");
        }
      }
    }
    return "";
  } catch (error) {
    logError(`Error extracting CIP code`, error as Error);
    throw error;
  }
};

const extractOccupations = async (certificate: CTDLResource): Promise<Occupation[]> => {
  try {
    const occupationTypes = certificate["ceterms:occupationType"];
    if (!occupationTypes || occupationTypes.length === 0) return [];

    return occupationTypes
      .filter(
        (occupation) =>
          occupation["ceterms:frameworkName"]?.["en-US"] ===
            "Standard Occupational Classification" &&
          occupation["ceterms:codedNotation"] &&
          occupation["ceterms:targetNodeName"]?.["en-US"],
      )
      .map((occupation) => {
        const soc = occupation["ceterms:codedNotation"]?.replace(".00", "");
        const title = occupation["ceterms:targetNodeName"]?.["en-US"];
        return { soc, title };
      })
      .filter((occupation): occupation is Occupation => !!occupation.soc && !!occupation.title);
  } catch (error) {
    logError(`Error extracting occupations`, error as Error);
    throw error;
  }
};

const extractCost = async (certificate: CTDLResource, costType: string): Promise<number | null> => {
  try {
    const estimatedCosts = certificate["ceterms:estimatedCost"];
    if (Array.isArray(estimatedCosts)) {
      for (const costProfile of estimatedCosts) {
        const directCostType = costProfile["ceterms:directCostType"];
        if (directCostType?.["ceterms:targetNode"] === costType) {
          const price = costProfile["ceterms:price"];
          return price ? Number(price) : null;
        }
      }
    }
    return null;
  } catch (error) {
    logError(`Error extracting cost for type ${costType}`, error as Error);
    throw error;
  }
};

const extractAverageSalary = async (certificate: CTDLResource): Promise<number | null> => {
  try {
    const averageSalaryData = certificate["ceterms:aggregateData"];
    if (!averageSalaryData) return null;

    const averageSalaryProfile = averageSalaryData.find(
      (aggData: CetermsAggregateData) =>
        aggData["ceterms:medianEarnings"] !== undefined &&
        aggData["ceterms:medianEarnings"] !== null,
    );

    if (!averageSalaryProfile) return null;

    const medianEarnings = averageSalaryProfile["ceterms:medianEarnings"];
    if (typeof medianEarnings !== "number") {
      throw new Error(`Median earnings is not a number: ${medianEarnings}`);
    }

    return medianEarnings;
  } catch (error) {
    logError(`Error extracting average salary`, error as Error);
    throw error;
  }
};

const extractEmploymentData = async (certificate: CTDLResource): Promise<number | null> => {
  try {
    const aggData = certificate["ceterms:aggregateData"];
    if (!aggData) return null;

    for (const data of aggData) {
      const jobObtained = data["ceterms:jobsObtained"]?.find(
        (job) => job["qdata:percentage"] != null,
      );
      if (jobObtained?.["qdata:percentage"] != null) {
        return jobObtained["qdata:percentage"];
      }
    }
    return null;
  } catch (error) {
    logError(`Error extracting employment data`, error as Error);
    throw error;
  }
};

const extractPrerequisites = async (certificate: CTDLResource): Promise<string[] | null> => {
  try {
    const prerequisites = certificate["ceterms:requires"]
      ?.filter((req) => (req["ceterms:name"]?.["en-US"] ?? "") === "Prerequisites")
      .map((req) => req["ceterms:description"]?.["en-US"])
      .filter((description): description is string => description !== undefined);

    return prerequisites && prerequisites.length > 0 ? prerequisites : null;
  } catch (error) {
    logError(`Error extracting prerequisites`, error as Error);
    throw error;
  }
};

const checkSupportService = async (
  certificate: CTDLResource,
  targetNode: string,
): Promise<boolean> => {
  try {
    const supportServices = certificate["ceterms:hasSupportService"] || [];

    for (const serviceUrl of supportServices) {
      if (!serviceUrl) continue;

      const ctid = serviceUrl.split("/").pop();
      if (!ctid) continue;

      try {
        const linkedServiceRecord = await credentialEngineAPI.getResourceByCTID(ctid);

        if (!linkedServiceRecord) continue;

        const serviceTypes = linkedServiceRecord["ceterms:supportServiceType"] || [];
        if (
          serviceTypes.some((type: CetermsServiceType) => type["ceterms:targetNode"] === targetNode)
        ) {
          return true;
        }
      } catch (error) {
        console.error(`Error for support service check, skipping CTID: ${ctid}`);
      }
    }
    return false;
  } catch (error) {
    if (error instanceof Error) {
      logError(`Error checking support service`, error);
    } else {
      console.error(`Unknown error checking support service`);
    }
    return false; // Return false if errors occur
  }
};


const checkAccommodation = async (
  certificate: CTDLResource,
  targetNode: string,
): Promise<boolean> => {
  try {
    const supportServices = certificate["ceterms:hasSupportService"] || [];

    for (const serviceUrl of supportServices) {
      if (!serviceUrl) continue;

      const ctid = serviceUrl.split("/").pop();
      console.log("")
      if (!ctid) continue;

      try {
        const linkedServiceRecord = await retryWithBackoff(
          () => credentialEngineAPI.getResourceByCTID(ctid),
          3, // Retries
          1000, // Initial delay in ms
        );

        if (!linkedServiceRecord) continue;

        const accommodationTypes = linkedServiceRecord["ceterms:accommodationType"] || [];
        if (
          accommodationTypes.some(
            (type: CetermsAccommodationType) => type["ceterms:targetNode"] === targetNode,
          )
        ) {
          return true;
        }
      } catch (error) {
          console.error(`Error for accommodation check, skipping CTID: ${ctid}`);
      }
    }
    return false;
  } catch (error) {
    if (error instanceof Error) {
      logError(`Error checking accommodation`, error);
    } else {
      console.error(`Unknown error checking accommodation`);
    }
    return false; // Return false if errors occur
  }
};


const constructCredentialsString = async (
  isPreparationForObject: CetermsConditionProfile[],
): Promise<string> => {
  try {
    if (!isPreparationForObject || isPreparationForObject.length === 0) return "";

    return isPreparationForObject
      .map((obj) => obj["ceterms:name"]?.["en-US"] ?? "")
      .filter((name) => name) // Filter out empty strings
      .join(", "); // Join the names with a comma and space as separator
  } catch (error) {
    logError(`Error constructing credentials string`, error as Error);
    throw error;
  }
};

const getTimeRequired = async (certificate: CTDLResource): Promise<number> => {
  try {
    const estimatedDuration = certificate["ceterms:estimatedDuration"];
    if (!estimatedDuration || estimatedDuration.length === 0) return 0;
    const exactDuration = estimatedDuration[0]["ceterms:timeRequired"];
    if (!exactDuration) return 0;
    return await convertIso8601DurationToTotalHours(exactDuration);
  } catch (error) {
    logError(`Error getting calendar length ID`, error as Error);
    throw error;
  }
};

const getCalendarLengthId = async (certificate: CTDLResource): Promise<number> => {
  try {
    const estimatedDuration = certificate["ceterms:estimatedDuration"];
    if (!estimatedDuration || estimatedDuration.length === 0) return 0;
    const exactDuration = estimatedDuration[0]["ceterms:exactDuration"];
    if (!exactDuration) return 0;
    return await convertIso8601DurationToCalendarLengthId(exactDuration);
  } catch (error) {
    logError(`Error getting calendar length ID`, error as Error);
    throw error;
  }
};

const hasLearningDeliveryTypes = (certificate: CTDLResource): Promise<DeliveryType[]> => {
  try {
    const deliveryTypes = certificate["ceterms:deliveryType"] ?? [];

    // Map and filter the types to ensure only valid DeliveryType values are returned
    const mappedTypes: DeliveryType[] = deliveryTypes
      .map((deliveryType) => {
        switch (deliveryType["ceterms:targetNode"]) {
          case "deliveryType:InPerson":
            return DeliveryType.InPerson;
          case "deliveryType:OnlineOnly":
            return DeliveryType.OnlineOnly;
          case "deliveryType:BlendedDelivery":
            return DeliveryType.BlendedDelivery;
          default:
            // Log unknown types and skip them
            console.warn(`Unknown delivery type: ${JSON.stringify(deliveryType)}`);
            return undefined; // Return undefined for unknown types
        }
      })
      .filter((type): type is DeliveryType => !!type); // Type guard to filter out undefined values

    return Promise.resolve(mappedTypes);
  } catch (error) {
    logError("Error checking for learning delivery types", error as Error);
    throw error;
  }
};

const hasEveningSchedule = async (certificate: CTDLResource): Promise<boolean> => {
  try {
    const scheduleTimingTypes = certificate["ceterms:scheduleTimingType"];
    if (!scheduleTimingTypes) return false;

    const hasEvening = scheduleTimingTypes.some(
      (timingType) => timingType["ceterms:targetNode"] === "scheduleTiming:Evening",
    );

    return hasEvening;
  } catch (error) {
    logError(`Error checking evening schedule`, error as Error);
    throw error;
  }
};

const getLanguages = async (certificate: CTDLResource): Promise<string[]> => {
  try {
    const languages = certificate["ceterms:inLanguage"];
    if (!languages || languages.length === 0) return [];

    return languages.map(
      (languageTag: string) => DATA_VALUE_TO_LANGUAGE[languageTag] || languageTag,
    );
  } catch (error) {
    logError(`Error getting languages`, error as Error);
    throw error;
  }
};

const convertIso8601DurationToTotalHours = async (isoString: string): Promise<number> => {
  try {
    const match = isoString.match(
      /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/,
    );
    if (!match) {
      throw new Error("Invalid ISO 8601 duration string");
    }

    const years = parseInt(match[1] || "0", 10) * 365 * 24;
    const months = parseInt(match[2] || "0", 10) * 30 * 24;
    const weeks = parseInt(match[3] || "0", 10) * 7 * 24;
    const days = parseInt(match[4] || "0", 10) * 24;
    const hours = parseInt(match[5] || "0", 10);
    const minutes = parseInt(match[6] || "0", 10) / 60;
    const seconds = parseInt(match[7] || "0", 10) / 3600;

    return years + months + weeks + days + hours + minutes + seconds;
  } catch (error) {
    logError(`Error converting ISO 8601 duration to total hours`, error as Error);
    throw error;
  }
};

const convertIso8601DurationToCalendarLengthId = async (isoString: string): Promise<number> => {
  try {
    const match = isoString.match(
      /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/,
    );
    if (!match) {
      throw new Error("Invalid ISO 8601 duration string");
    }

    const years = parseInt(match[1]) || 0;
    const months = parseInt(match[2]) || 0;
    const weeks = parseInt(match[3]) || 0;
    const days = parseInt(match[4]) || 0;
    const hours = parseInt(match[5]) || 0;
    const minutes = parseInt(match[6]) || 0;
    const seconds = parseInt(match[7]) || 0;

    // Convert all to total days
    const totalDays =
      years * 365 + months * 30 + weeks * 7 + days + hours / 24 + minutes / 1440 + seconds / 86400;

    if (totalDays < 1) return 1;
    if (totalDays <= 2) return 2;
    if (totalDays <= 7) return 3;
    if (totalDays <= 21) return 4;
    if (totalDays <= 77) return 5;
    if (totalDays <= 150) return 6;
    if (totalDays <= 365) return 7;
    if (totalDays <= 730) return 8;
    if (totalDays <= 1460) return 9;
    return 10;
  } catch (error) {
    logError(`Error converting ISO 8601 duration to calendar length ID`, error as Error);
    throw error;
  }
};

export const DATA_VALUE_TO_LANGUAGE: { [key: string]: string } = {
  ar: "Arabic",
  zh: "Chinese",
  en: "English",
  "en-US": "English",
  te: "Telugu",
  fr: "French",
  "fr-HT": "French Creole",
  de: "German",
  el: "Greek",
  he: "Hebrew",
  hi: "Hindi",
  hu: "Hungarian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  pl: "Polish",
  pt: "Portuguese",
  ru: "Russian",
  es: "Spanish",
  tl: "Tagalog",
  vi: "Vietnamese",
  yi: "Yiddish",
};

export const credentialEngineUtils = {
  validateCtId,
  getCtidFromURL,
  fetchCertificateData,
  fetchValidCEData,
  getProviderData,
  getAddress,
  getAvailableAtAddresses,
  extractCipCode,
  extractOccupations,
  extractCost,
  extractAverageSalary,
  extractEmploymentData,
  extractPrerequisites,
  checkSupportService,
  checkAccommodation,
  constructCredentialsString,
  getTimeRequired,
  getCalendarLengthId,
  hasLearningDeliveryTypes,
  hasEveningSchedule,
  getLanguages,
  convertIso8601DurationToTotalHours,
  convertIso8601DurationToCalendarLengthId,
};
