import { convertToTitleCaseIfUppercase } from "../utils/convertToTitleCaseIfUppercase";
import { FindTrainingsBy } from "../types";
import { Address, Training } from "./Training";
import { CalendarLength } from "../CalendarLength";
import { LocalException } from "./Program";
import { DataClient } from "../DataClient";
import { Selector } from "./Selector";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import {
  CetermsConditionProfile,
  /*  CetermsEstimatedDuration,
  CetermsCredentialAlignmentObject,*/
  CetermsScheduleTimingType,
  CTDLResource,
} from "../credentialengine/CredentialEngine";

function extractCipCode(certificate: CTDLResource): string {
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
  return ""; // Return empty string if no match is found
}

export function getAvailableAtAddress(certificate: CTDLResource): Address {
  const availableAt = certificate["ceterms:availableAt"]?.[0];
  return {
    street_address: availableAt?.["ceterms:streetAddress"]?.["en-US"] ?? "",
    city: availableAt?.["ceterms:addressRegion"]?.["en-US"] ?? "",
    zipCode: availableAt?.["ceterms:postalCode"] ?? "",
  };
}

function extractTotalCost(certificate: CTDLResource): number | null {
  const estimatedCostObject = certificate["ceterms:estimatedCost"];
  if (Array.isArray(estimatedCostObject) && estimatedCostObject.length > 0) {
    const price = estimatedCostObject[0]["ceterms:price"];
    return price ? Number(price) : null; // Convert price to number, return null if conversion fails or price is undefined
  }
  return null; // Return null if no estimatedCostObject is found
}

export function calculateTotalClockHoursFromEstimatedDuration(certificate: CTDLResource): number {
  const estimatedDuration = certificate["ceterms:estimatedDuration"];
  if (!estimatedDuration || estimatedDuration.length === 0) return 0;
  const exactDuration = estimatedDuration[0]["ceterms:exactDuration"];
  return exactDuration ? convertIso8601ToTotalHours(exactDuration) : 0;
}

function constructCertificationsString(isPreparationForObject: CetermsConditionProfile[]): string {
  if (!isPreparationForObject || isPreparationForObject.length === 0) return "";

  return isPreparationForObject
    .map((obj) => obj["ceterms:name"]?.["en-US"] ?? "")
    .filter((name) => name) // Filter out empty strings
    .join(", "); // Join the names with a comma and space as separator
}

export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
    const inDemandCIPs = await dataClient.getCIPsInDemand();
    const inDemandCIPCodes = inDemandCIPs.map((c) => c.cipcode);
    const ceRecords = [];

    for (const value of values) {
      const ctid = await credentialEngineUtils.getCtidFromURL(value);
      const record = await credentialEngineAPI.getResourceByCTID(ctid);
      ceRecords.push(record);
    }
    return Promise.all(
      ceRecords.map(async (certificate: CTDLResource) => {
        // GET provider record
        const ownedBy = certificate["ceterms:ownedBy"] ? certificate["ceterms:ownedBy"] : [];
        const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedBy[0]);
        const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
        const ownedByAddresses = [];
        const providerContactPoints = [];

        const ownedByAddressObject = ownedByRecord["ceterms:address"];
        const availableOnlineAt = certificate["ceterms:availableOnlineAt"];
        const isPreparationForObject = certificate[
          "ceterms:isPreparationFor"
        ] as CetermsConditionProfile[];
        const scheduleTimingType = certificate[
          "ceterms:scheduleTimingType"
        ] as CetermsScheduleTimingType;
        const address = getAvailableAtAddress(certificate);
        if (ownedByAddressObject != null) {
          for (const element of ownedByAddressObject) {
            if (element["@type"] == "ceterms:Place" && element["ceterms:streetAddress"] != null) {
              const address = {
                name: element["ceterms:name"] ? element["ceterms:name"]["en-US"] : null,
                street1: element["ceterms:streetAddress"]
                  ? element["ceterms:streetAddress"]["en-US"]
                  : null,
                street2: "",
                city: element["ceterms:addressLocality"]
                  ? element["ceterms:addressLocality"]["en-US"]
                  : null,
                state: element["ceterms:addressRegion"]
                  ? element["ceterms:addressRegion"]["en-US"]
                  : null,
                zipCode: element["ceterms:postalCode"],
              };
              ownedByAddresses.push(address);
            } else if (element["@type"] == "ceterms:ContactPoint") {
              const targetContactPoint = {
                alternateName: element["ceterms:alternateName"]["en-US"],
                contactType: element["ceterms:contactType"]["en-US"],
                email: element["ceterms:email"],
                faxNumber: element["ceterms:faxNumber"],
                name: element["ceterms:name"]["en-US"],
                socialMedia: element["ceterms:socialMedia"],
                telephone: element["ceterms:telephone"],
              };

              providerContactPoints.push(targetContactPoint);
            }
          }
        }

        const cipCode = extractCipCode(certificate);
        const totalCost = extractTotalCost(certificate);
        const totalClockHours = calculateTotalClockHoursFromEstimatedDuration(certificate);
        const certifications = constructCertificationsString(isPreparationForObject);

        // GET scheduling information - for example, evening courses
        if (scheduleTimingType != null) {
          console.log(JSON.stringify(scheduleTimingType, null, 2));
        }

        const prerequisites = certificate["ceterms:requires"]
          ?.filter((req) => (req["ceterms:name"]?.["en-US"] ?? "") === "Requirements")
          .map((req) => req["ceterms:description"]?.["en-US"]);

        const matchingOccupations =
          cipCode != null ? await dataClient.findOccupationsByCip(cipCode) : [];
        const localExceptionCounties = (await dataClient.getLocalExceptionsByCip())
          .filter((localException: LocalException) => localException.cipcode === cipCode)
          .map((localException: LocalException) =>
            convertToTitleCaseIfUppercase(localException.county),
          );

        const training = {
          id: certificate["ceterms:ctid"],
          name: certificate["ceterms:name"] ? certificate["ceterms:name"]["en-US"] : "",
          cipCode: cipCode,
          provider: {
            id: ownedByRecord["ceterms:ctid"],
            name: ownedByRecord["ceterms:name"]["en-US"],
            url: ownedByRecord["ceterms:subjectWebpage"],
            email: ownedByRecord["ceterms:email"] ? ownedByRecord["ceterms:email"][0] : null,
            county: "",
          },
          availableAt: address,
          description: certificate["ceterms:description"]
            ? certificate["ceterms:description"]["en-US"]
            : "",
          certifications: certifications,
          prerequisites: prerequisites,
          totalClockHours: totalClockHours,
          //calendarLength: null,
          occupations: matchingOccupations.map((it) => ({
            title: it.title,
            soc: it.soc,
          })),
          inDemand: inDemandCIPCodes.includes(cipCode ?? ""),
          localExceptionCounty: localExceptionCounties, // TODO: Test
          tuitionCost: 0,
          feesCost: 0,
          booksMaterialsCost: 0,
          suppliesToolsCost: 0,
          otherCost: 0,
          totalCost: totalCost ? totalCost : 0,
          online: availableOnlineAt != null ? true : false,
          percentEmployed: 0, // TODO: IGX doesn't provide this data
          averageSalary: 0, // TODO: IGX doesn't provide this data
          hasEveningCourses: false, // TODO: https://credreg.net/ctdl/terms/#scheduleTimingType
          languages: certificate["ceterms:inLanguage"]
            ? certificate["ceterms:inLanguage"][0]
            : null,
          isWheelchairAccessible: false, // TODO: IGX doesn't provide this data
          hasJobPlacementAssistance: false, // TODO: this field doesn't exist in CE!
          hasChildcareAssistance: false, // TODO: this field doesn't exist in CE!
        };
        return training;
      }),
    );
  };
};

// Function to convert ISO 8601 duration to total hours
function convertIso8601ToTotalHours(isoString: string): number {
  const match = isoString.match(
    /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/,
  );
  if (!match) {
    return 0; // Return 0 if the string does not match the pattern
  }

  const years = parseInt(match[1] || "0", 10) * 365 * 24;
  const months = parseInt(match[2] || "0", 10) * 30 * 24;
  const weeks = parseInt(match[3] || "0", 10) * 7 * 24;
  const days = parseInt(match[4] || "0", 10) * 24;
  const hours = parseInt(match[5] || "0", 10);
  const minutes = parseInt(match[6] || "0", 10) / 60;
  const seconds = parseInt(match[7] || "0", 10) / 3600;

  return years + months + weeks + days + hours + minutes + seconds; // Sum up all components
}

/*
const NAN_INDICATOR = "-99999";

const formatCounty = (county: string): string => {
  const SELECT_ONE = "Select One";
  if (!county || county === SELECT_ONE) {
    return "";
  }

  return `${county} County`;
};


const formatPercentEmployed = (perEmployed: string | null): number | null => {
  if (perEmployed === null || perEmployed === NAN_INDICATOR) {
    return null;
  }

  return parseFloat(perEmployed);
};
*/

/*
const formatAverageSalary = (averageQuarterlyWage: string | null): number | null => {
  if (averageQuarterlyWage === null || averageQuarterlyWage === NAN_INDICATOR) {
    return null;
  }

  const QUARTERS_IN_A_YEAR = 4;
  return parseFloat(averageQuarterlyWage) * QUARTERS_IN_A_YEAR;
};


const formatPrerequisites = (prereq: string | null): string => {
  if (!prereq) return "";

  if (prereq.match(/None/i)) {
    return "";
  }

  return stripSurroundingQuotes(prereq);
};

export const mapStrNumToBool = (value: string | null): boolean => {
  return value === "1";
};

export const formatLanguages = (languages: string | null): string[] => {
  if (languages == null || languages.length === 0) return [];
  const languagesWithoutQuotes = languages.replace(/["\s]+/g, "");
  return languagesWithoutQuotes.split(",");
};


 */

// Converts a time duration in ISO 8601 format to CalendarLength Id
export const convertDuration = (duration: string): number => {
  const match = duration.match(
    /^P(([0-9]+)Y)?(([0-9]+)M)?(([0-9]+)W)?(([0-9]+)D)?T?(([0-9]+)H)?(([0-9]+)M)?(([0-9]+)S)?$/,
  );
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const years = match[2] ? parseInt(match[2]) : 0;
  const months = match[4] ? parseInt(match[4]) : 0;
  const weeks = match[6] ? parseInt(match[6]) : 0;
  const days = match[8] ? parseInt(match[8]) : 0;
  const hours = match[10] ? parseInt(match[10]) : 0;
  /*  const min = match[12] ? parseInt(match[12]) : 0;
  const sec = match[14] ? parseInt(match[14]) : 0;*/

  //console.log(`${years}y ${months}m ${weeks}w`);
  let calendarLength: CalendarLength = CalendarLength.NULL;

  if (years > 4) {
    calendarLength = CalendarLength.MORE_THAN_FOUR_YEARS;
  } else if (years >= 3 && years <= 4) {
    calendarLength = CalendarLength.THREE_TO_FOUR_YEARS;
  } else if ((years == 1 && months > 0) || (years >= 1 && years < 3))
    calendarLength = CalendarLength.THIRTEEN_MONTHS_TO_TWO_YEARS;
  else if (years == 0 && months >= 6 && months <= 11) {
    calendarLength = CalendarLength.SIX_TO_TWELVE_MONTHS;
  } else if (years == 0 && months >= 3 && months <= 5) {
    calendarLength = CalendarLength.THREE_TO_FIVE_MONTHS;
  } else if (
    (years == 0 && months == 0 && weeks >= 3 && weeks <= 12) ||
    (months >= 1 && months < 3)
  ) {
    calendarLength = CalendarLength.FOUR_TO_ELEVEN_WEEKS;
  } else if (years == 0 && months == 0 && weeks >= 2 && weeks < 4) {
    calendarLength = CalendarLength.TWO_TO_THREE_WEEKS;
  } else if (
    (years == 0 && months == 0 && weeks == 0 && days >= 3) ||
    (years == 0 && months == 0 && weeks == 1 && days == 0)
  ) {
    calendarLength = CalendarLength.THREE_TO_SEVEN_DAYS;
  } else if (years == 0 && months == 0 && weeks == 0 && (days == 1 || days == 2)) {
    calendarLength = CalendarLength.ONE_TO_TWO_DAYS;
  } else if (years == 0 && months == 0 && weeks == 0 && days == 0 && hours > 0) {
    calendarLength = CalendarLength.LESS_THAN_ONE_DAY;
  }
  return calendarLength;
};
