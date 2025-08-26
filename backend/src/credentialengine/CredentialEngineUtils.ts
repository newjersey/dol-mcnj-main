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
import { credentialEngineCacheService } from "../infrastructure/redis/CredentialEngineCacheService";
import { DeliveryType } from "../domain/DeliveryType";
// import { processInBatches } from "../utils/concurrencyUtils";
import { AxiosError } from "axios";
import redis from "../infrastructure/redis/redisClient";

/**
 * Logs errors in a consistent format.
 * @param message - Description of the error context.
 * @param error - The caught error object.
 */
const logError = (message: string, error: Error) => {
  console.error(`${message}: ${error.message}`);
};

/**
 * Retries a function with exponential backoff for handling transient API failures.
 * @param fn - Function returning a promise to retry.
 * @param retries - Maximum number of retries.
 * @param delay - Initial delay in milliseconds.
 * @param context - Optional description for logging.
 * @returns The resolved value of `fn`, or throws an error after exhausting retries.
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number,
  context?: string // Optional: Name of the calling function or additional context
): Promise<T> => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      console.log(`Attempt ${attempt + 1} for ${context || "Unknown"} with delay ${delay}ms`);
      const result = await fn();
      console.log(`✅ Request succeeded in ${attempt + 1} attempt(s).`);
      return result;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 503) {
        // Log more details on each 503 error
        console.error(`503 Error (Attempt ${attempt + 1}): ${error.response?.statusText || "Unknown"} for ${context || "Unknown"}`);
        console.error(`Response: ${JSON.stringify(error.response?.data)}`);

        if (attempt < retries - 1) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          attempt++;
          delay *= 2; // Exponential backoff
        } else {
          console.error(`Exhausted all retries. Giving up after ${retries} attempts.`);
          throw new Error(`503 Error after ${retries} attempts in ${context || "retryWithBackoff"}`);
        }
      } else {
        console.error(`Error in ${context || "retryWithBackoff"}: ${error as Error}`);
        throw error; // Propagate non-503 errors
      }
    }
  }
  // In case retries run out
  throw new Error(`503 Error after ${retries} attempts in ${context || "retryWithBackoff"}`);
};



/**
 * Validates a Credential Transparency Identifier (CTID) format.
 * @param id - CTID to validate.
 * @returns `true` if valid, `false` otherwise.
 */
const validateCtId = async (id: string): Promise<boolean> => {
  const pattern = /^ce-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  try {
    return pattern.test(id);
  } catch (error) {
    logError(`Error validating CTID: ${id}`, error as Error);
    throw error;
  }
};

/**
 * Extracts the CTID from a Credential Engine URL.
 * @param url - The Credential Engine resource URL.
 * @returns The extracted CTID as a string.
 */
const getCtidFromURL = async (url: string): Promise<string> => {
  try {
    // Find the last slash and extract everything after it as the CTID
    const lastSlashIndex = url.lastIndexOf("/");
    return url.substring(lastSlashIndex + 1);
  } catch (error) {
    logError(`Error extracting CTID from URL: ${url}`, error as Error);
    throw error;
  }
};


/**
 * Fetches and verifies a Credential Engine envelope by full URL.
 * Returns the decoded resource if it's published by NJDOL and passes the optional filter.
 */
export async function fetchNJDOLResource(
  envelopeUrl: string,
  filterFn?: (resource: CTDLResource) => boolean
): Promise<CTDLResource | null> {
  try {
    const ctid = envelopeUrl.split("/").pop();
    if (!ctid) {
      console.error(`Invalid envelope URL: ${envelopeUrl}`);
      return null;
    }

    const envelope = await credentialEngineCacheService.getEnvelopeByCTID(ctid);
    const publishedBy = envelope?.published_by;
    const expectedPublisher = process.env.CE_NJDOL_CTID;

    if (publishedBy !== expectedPublisher) {
      console.warn(`CTID ${ctid} not published by NJDOL. Found: ${publishedBy}`);
      return null;
    }

    const resourceGraph = envelope?.decoded_resource?.["@graph"];
    if (!Array.isArray(resourceGraph)) return null;

    // If filterFn is provided, return the first matching node
    if (filterFn) {
      const match = resourceGraph.find((node) => filterFn(node));
      if (!match) {
        console.warn(`No resource in @graph passed filterFn for CTID: ${ctid}`);
        return null;
      }
      return match;
    }

    // Fallback: if only one node, return it
    if (resourceGraph.length === 1) {
      return resourceGraph[0];
    }


// If multiple nodes and no filterFn, warn and return null
    console.warn(`Ambiguous graph structure in envelope for CTID ${ctid} — multiple nodes, no filter`);
    return null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Failed to fetch or process envelope from ${envelopeUrl}:`, err.message);
    } else {
      console.error(`Unknown error while fetching envelope from ${envelopeUrl}`);
    }
    return null;
  }
}




/**
 * Fetches provider data associated with a given resource.
 * Utilizes a cache (Redis) to avoid repeated HTTP requests for the same provider.
 * @param resource - The resource object containing provider information.
 * @returns The provider data or null if unavailable.
 */
async function getProviderData(resource: CTDLResource): Promise<Provider | null> {
  try {
    const ownedByUrl = resource["ceterms:ownedBy"]?.[0];
    if (!ownedByUrl) {
      console.warn("OwnedBy field is missing in the certificate.");
      return null;
    }

    const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedByUrl);

    // First, check Redis cache
    const cachedProvider = await redis.get(ownedByCtid);
    if (cachedProvider) {
      console.log(`✅ Cache hit for provider CTID: ${ownedByCtid}`);
      return JSON.parse(cachedProvider);
    }

    // Fetch provider data from API with caching
    const providerData = await credentialEngineCacheService.getResourceByCTID(ownedByCtid);
    if (!providerData) {
      return null;
    }

    const provider: Provider = {
      ctid: providerData["ceterms:ctid"] || "",
      providerId: providerData["ceterms:identifierValueCode"] || "",
      name: providerData["ceterms:name"]?.["en-US"] || "Unknown Provider",
      url: providerData["ceterms:subjectWebpage"] || "",
      email: providerData["ceterms:email"]?.[0] || "",
      addresses: await credentialEngineUtils.getAddress(providerData),
    };

    // Cache the provider data for 3 hours in Redis and NodeCache
    await redis.set(ownedByCtid, JSON.stringify(provider), 'EX', 7200); // Cache for 2 hours


    return provider;
  } catch (error) {
    console.error(`Error fetching provider for ${resource["ceterms:ownedBy"]?.[0]}: `, error);
    return null;
  }
}



/**
 * Retrieves address information from a given CTDL resource.
 * @param resource - The CTDL resource containing address data.
 * @returns A list of structured Address objects.
 */
const getAddress = async (resource: CTDLResource): Promise<Address[]> => {
  try {
    const addresses = resource["ceterms:address"] ?? [];
    return addresses.map((address) => {
      const zipCode = address["ceterms:postalCode"] ?? "";
      return {
        "@type": "ceterms:Place", // Specifies the type of entity
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

/**
 * Retrieves the available addresses where the resource is offered.
 * @param resource - The CTDL resource containing availableAt location data.
 * @returns A list of structured Address objects.
 */
const getAvailableAtAddresses = async (resource: CTDLResource): Promise<Address[]> => {
  try {
    const availableAt = resource["ceterms:availableAt"] ?? [];

    return availableAt.map((location: CetermsPlace) => {
      const zipCode = location["ceterms:postalCode"] ?? "";

      // Map contact points if they exist
      const targetContactPoints = (location["ceterms:targetContactPoint"] || []).map(
        (contactPoint: CetermsContactPoint) => ({
          name: contactPoint["ceterms:name"]?.["en-US"] ?? null,
          contactType: contactPoint["ceterms:contactType"]?.["en-US"] ?? null,
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
        targetContactPoints,
      } as Address;
    });
  } catch (error) {
    logError(`Error getting available addresses`, error as Error);
    throw error;
  }
};

/**
 * Extracts the CIP (Classification of Instructional Programs) code from a CTDL resource.
 * @param resource - The CTDL resource containing instructional program data.
 * @returns The CIP code as a string, or an empty string if not found.
 */
const extractCipCode = async (resource: CTDLResource): Promise<string> => {
  try {
    const instructionalProgramTypes = resource["ceterms:instructionalProgramType"];
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

const extractOccupations = async (resource: CTDLResource): Promise<Occupation[]> => {
  try {
    const occupationTypes = resource["ceterms:occupationType"];
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

/**
 * Extracts the cost of a specific type from a CTDL resource.
 * @param resource - The CTDL resource containing cost data.
 * @param costType - The type of cost to extract.
 * @returns The cost value or null if not found.
 */
const extractCost = async (resource:CTDLResource, costType:string) => {
  try {
    const estimatedCosts = resource["ceterms:estimatedCost"];
    if (Array.isArray(estimatedCosts)) {
      for (const costProfile of estimatedCosts) {
        const directCostType = costProfile["ceterms:directCostType"];
        if (directCostType?.["ceterms:targetNode"] === costType) {
          const price = costProfile["ceterms:price"];
          // Ensure `0` is treated as a valid value and returned
          return price !== null && price !== undefined ? price : null;
        }
      }
    }
    return null; // Return null if no matching cost type is found
  } catch (error) {
    console.error(`Error extracting cost for type ${costType}:`, error);
    return null;
  }
};

/**
 * Retrieves the average salary from a CTDL resource.
 * Note that Credential Engine does not have a meanEarnings or averageEarnings term, so we use medianEarnings
 * But the data collected from the provider is actually MEAN salary, not median
 * @param resource - The CTDL resource containing salary data.
 * @returns The median earnings value or null if not found.
 */
const extractAverageSalary = async (resource: CTDLResource): Promise<number | null> => {
  try {
    const averageSalaryData = resource["ceterms:aggregateData"];
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

/**
 * Extracts employment data from a CTDL resource.
 * @param resource - The CTDL resource containing employment data.
 * @returns The percentage of jobs obtained, or null if not found.
 */
const extractEmploymentData = async (resource: CTDLResource): Promise<number | null> => {
  try {
    const aggData = resource["ceterms:aggregateData"];
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

/**
 * Extracts prerequisite requirements from a CTDL resource.
 * @param certificate - The CTDL resource containing prerequisite data.
 * @returns An array of prerequisite descriptions or null if none are found.
 */
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

/**
 * Checks if a resource has a specific support service.
 * Iterates through the list of support services linked to the resource
 * and verifies if any of them match the given target node.
 *
 * @param resource - The CTDL resource containing support service references.
 * @param targetNode - The target support service type to check for.
 * @returns A boolean indicating whether the support service is present.
 */
/*TODO: Modify this so that it returns a list of support services to be filtered elsewhere so that this only has to be
called once per reacord - same with accommodations, which can be merged into here*/
const checkSupportService = async (resource: CTDLResource, targetNode: string): Promise<boolean> => {
  try {
    const supportServices = resource["ceterms:hasSupportService"] || [];

    for (const serviceUrl of supportServices) {
      if (!serviceUrl) continue;

      const ctid = serviceUrl.split("/").pop();
      if (!ctid) continue;

      try {
        const linkedServiceRecord = await credentialEngineCacheService.getResourceByCTID(ctid);

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

/**
 * Checks if a resource provides a specific type of accommodation.
 * Uses retry logic with exponential backoff to handle temporary failures.
 *
 * @param resource - The CTDL resource containing accommodation references.
 * @param targetNode - The specific accommodation type to check for.
 * @returns A boolean indicating whether the accommodation type is available.
 */
const checkAccommodation = async (resource: CTDLResource, targetNode: string,): Promise<boolean> => {
  try {
    const supportServices = resource["ceterms:hasSupportService"] || [];

    for (const serviceUrl of supportServices) {
      if (!serviceUrl) continue;

      const ctid = serviceUrl.split("/").pop();
      console.log("")
      if (!ctid) continue;

      try {
        const linkedServiceRecord = await retryWithBackoff(
          () => credentialEngineCacheService.getResourceByCTID(ctid),
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
    return false;
  }
};

/**
 * Constructs a comma-separated string of credentials that a program prepares for.
 *
 * @param isPreparationForObject - An array of condition profiles representing credentials.
 * @returns A formatted string containing credential names.
 */
const constructCredentialsString = async (isPreparationForObject: CetermsConditionProfile[]): Promise<string> => {
  try {
    if (!isPreparationForObject || isPreparationForObject.length === 0) return "";

    return isPreparationForObject
      .map((obj) => obj["ceterms:name"]?.["en-US"] ?? "")
      .filter((name) => name) // Filter out empty strings
      .join(", ");
  } catch (error) {
    logError(`Error constructing credentials string`, error as Error);
    throw error;
  }
};

/**
 * Retrieves the estimated time required for a resource in total hours.
 * Converts the ISO 8601 duration format into a numerical value.
 *
 * @param resource - The CTDL resource containing estimated duration data.
 * @returns The total number of hours required.
 */
const getTimeRequired = async (resource: CTDLResource): Promise<number> => {
  try {
    const estimatedDuration = resource["ceterms:estimatedDuration"];
    if (!estimatedDuration || estimatedDuration.length === 0) return 0;
    const exactDuration = estimatedDuration[0]["ceterms:timeRequired"];
    if (!exactDuration) return 0;
    return await convertIso8601DurationToTotalHours(exactDuration);
  } catch (error) {
    logError(`Error getting calendar length ID`, error as Error);
    throw error;
  }
};

/**
 * Determines the calendar length ID based on the estimated duration of the resource.
 * Converts the ISO 8601 duration into an equivalent calendar length ID.
 *
 * @param resource - The CTDL resource containing duration data.
 * @returns A calendar length ID representing the duration.
 */
const getCalendarLengthId = async (resource: CTDLResource): Promise<number> => {
  try {
    const estimatedDuration = resource["ceterms:estimatedDuration"];
    if (!estimatedDuration || estimatedDuration.length === 0) return 0;
    const exactDuration = estimatedDuration[0]["ceterms:exactDuration"];
    if (!exactDuration) return 0;
    return await convertIso8601DurationToCalendarLengthId(exactDuration);
  } catch (error) {
    logError(`Error getting calendar length ID`, error as Error);
    throw error;
  }
};

/**
 * Retrieves the delivery types of a resource, filtering for valid options.
 *
 * @param resource - The CTDL resource containing delivery type data.
 * @returns An array of valid delivery types.
 */
const hasLearningDeliveryTypes = (resource: CTDLResource): Promise<DeliveryType[]> => {
  try {
    const deliveryTypes = resource["ceterms:deliveryType"] ?? [];

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

/**
 * Checks if a resource offers evening scheduling.
 *
 * @param resource - The CTDL resource containing schedule information.
 * @returns A boolean indicating whether evening schedules are available.
 */
const hasEveningSchedule = async (resource: CTDLResource): Promise<boolean> => {
  try {
    const scheduleTimingTypes = resource["ceterms:scheduleTimingType"];
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

/**
 * Retrieves the languages in which a resource is offered.
 * Maps language codes to human-readable names where available.
 *
 * @param resource - The CTDL resource containing language information.
 * @returns An array of language names.
 */
const getLanguages = async (resource: CTDLResource): Promise<string[]> => {
  try {
    const languages = resource["ceterms:inLanguage"];
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

/**
 * Converts an ISO 8601 duration string into a predefined calendar length ID.
 * This function maps total duration in days to a discrete length category.
 *
 * @param isoString - The ISO 8601 duration string (e.g., "P2Y3M5D").
 * @returns A numeric ID corresponding to the calendar length category.
 */
const convertIso8601DurationToCalendarLengthId = async (isoString: string): Promise<number> => {
  try {
    // Regular expression to match ISO 8601 duration components.
    const match = isoString.match(
      /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/,
    );
    if (!match) {
      throw new Error("Invalid ISO 8601 duration string");
    }

    // Extract values and convert to total days
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

    // Map total days to predefined calendar length ID categories.
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

/**
 * Mapping of ISO 639-1 language codes to their human-readable language names.
 */
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

/**
 * Checks whether the decoded resource contains a Learning Opportunity Profile.
 * @param resource - The decoded CTDL resource (as a JWT-decoded object).
 * @returns True if at least one graph node is of type ceterms:LearningOpportunityProfile.
 */
/**
 * Checks whether a decoded_resource contains a LearningOpportunityProfile.
 * Can be used as a filterFn for fetchNJDOLResource().
 *
 * @param resource - The decoded_resource object from the envelope.
 * @returns True if any node in @graph has type LearningOpportunityProfile.
 */
export function isLearningOpportunityProfile(resource: Pick<CTDLResource, "@type">): boolean {
  const type = resource?.["@type"];
  if (Array.isArray(type)) {
    return type.includes("ceterms:LearningOpportunityProfile");
  }
  return type === "ceterms:LearningOpportunityProfile";
}

export const credentialEngineUtils = {
  validateCtId,
  getCtidFromURL,
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
  isLearningOpportunityProfile,
};
