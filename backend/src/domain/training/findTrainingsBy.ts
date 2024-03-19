import { convertToTitleCaseIfUppercase } from "../utils/convertToTitleCaseIfUppercase";
import { FindTrainingsBy } from "../types";
import { Training } from "./Training";
import { CalendarLength } from "../CalendarLength";
import { LocalException } from "./Program";
import { DataClient } from "../DataClient";
import { Selector } from "./Selector";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import {
  CetermsConditionProfile,
  CetermsEstimatedDuration,
  CetermsCredentialAlignmentObject,
  CetermsScheduleTimingType,
  CTDLResource
} from "../credentialengine/CredentialEngine";

export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
    const inDemandCIPs = await dataClient.getCIPsInDemand();
    const inDemandCIPCodes = inDemandCIPs.map(c => c.cipcode)
    const ceRecords:any = []

    for (const value of values) {
      const ctid = await credentialEngineUtils.getCtidFromURL(value)
      const record = await credentialEngineAPI.getResourceByCTID(ctid);
      ceRecords.push(record);
    }
    return Promise.all(
      ceRecords.map(async (certificate : CTDLResource) => {
        let totalCost:any = null;
        let exactDuration:any = null;
        let calendarLength:CalendarLength = CalendarLength.NULL;

        // GET provider record
        const ownedBy = certificate["ceterms:ownedBy"] ? certificate["ceterms:ownedBy"] : [];
        const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedBy[0]);
        const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
        const ownedByAddresses:any[] = [];
        const providerContactPoints:any[] = [];

        const ownedByAddressObject = ownedByRecord["ceterms:address"];
        const availableOnlineAt = certificate["ceterms:availableOnlineAt"];
        const estimatedCostObject = certificate["ceterms:estimatedCost"] ?? [];
        const estimatedDuration = certificate["ceterms:estimatedDuration"] as CetermsEstimatedDuration[];
        const isPreparationForObject = certificate["ceterms:isPreparationFor"] as CetermsConditionProfile[];
        const occupationType = certificate["ceterms:occupationType"] as CetermsCredentialAlignmentObject[];
        const scheduleTimingType = certificate["ceterms:scheduleTimingType"] as CetermsScheduleTimingType;
        if (ownedByAddressObject != null) {
          for (const element of ownedByAddressObject) {
            if (element["@type"] == "ceterms:Place" && element["ceterms:streetAddress"] != null) {
              const addressContactPoints:any[] = [];

              const targetContactPointObject = element["ceterms:targetContactPoint"];
              if (targetContactPointObject != null) {
                for (const contactPoint of targetContactPointObject) {
                  const targetContactPoint = {
                    alternateName: element["ceterms:alternateName"]["en-US"],
                    contactType: element["ceterms:contactType"]["en-US"],
                    email: element["ceterms:email"],
                    faxNumber: element["ceterms:faxNumber"],
                    name: element["ceterms:name"]["en-US"],
                    socialMedia: element["ceterms:socialMedia"],
                    telephone: element["ceterms:telephone"]
                  };
                  console.log(JSON.stringify(targetContactPoint));
                  addressContactPoints.push(targetContactPoint);
                }
              }

              const address = {
                name: element["ceterms:name"] ? element["ceterms:name"]["en-US"] : null,
                street1: element["ceterms:streetAddress"] ? element["ceterms:streetAddress"]["en-US"] : null,
                street2: "",
                city: element["ceterms:addressLocality"] ? element["ceterms:addressLocality"]["en-US"] : null,
                state: element["ceterms:addressRegion"] ? element["ceterms:addressRegion"]["en-US"] : null,
                zipCode: element["ceterms:postalCode"],
                targetContactPoints: addressContactPoints
              }
              ownedByAddresses.push(address);
            }
            else if (element["@type"] == "ceterms:ContactPoint") {
              const targetContactPoint = {
                alternateName: element["ceterms:alternateName"]["en-US"],
                contactType: element["ceterms:contactType"]["en-US"],
                email: element["ceterms:email"],
                faxNumber: element["ceterms:faxNumber"],
                name: element["ceterms:name"]["en-US"],
                socialMedia: element["ceterms:socialMedia"],
                telephone: element["ceterms:telephone"]
              };

              providerContactPoints.push(targetContactPoint);
            }
          }
        }

        if (estimatedDuration != null) {
          const durationProfile = estimatedDuration[0];
          if (durationProfile != null) {
            exactDuration = durationProfile["ceterms:exactDuration"];
            if (exactDuration) {
              calendarLength = convertDuration(exactDuration)
            }
          }
        }

        const instructionalProgramTypes = certificate["ceterms:instructionalProgramType"];
        let cipCode = ""; // Default to empty string if no match is found

        if (instructionalProgramTypes && Array.isArray(instructionalProgramTypes)) {
          for (const programType of instructionalProgramTypes) {
            if (programType["ceterms:frameworkName"]?.["en-US"] === "Classification of Instructional Programs") {
              cipCode = (programType["ceterms:codedNotation"] || "").replace(/[^\w\s]/g, ""); // Strip punctuation              break; // Stop looping once a match is found
            }
          }
        }

        if (estimatedCostObject && estimatedCostObject.length > 0) {
          const price = estimatedCostObject[0]["ceterms:price"];
          totalCost = price ? Number(price) : null; // Convert price to number, null if conversion fails or price is undefined
        }

        if (occupationType != null) {
          // get SOCs from ceterms:occupationType instead of from the database

        }

        const certifications = isPreparationForObject
          .map(obj => obj["ceterms:name"]?.["en-US"] ?? '')
          .filter(name => name) // Filter out empty strings to ensure we only include valid names
          .join(', '); // Join the names with a comma and space as separator

        // GET scheduling information - for example, evening courses
        if (scheduleTimingType != null) {
          console.log(JSON.stringify(scheduleTimingType, null, 2));
        }

        const prerequisites = certificate["ceterms:requires"]?.filter(req =>
          (req["ceterms:name"]?.["en-US"] ?? "") === "Requirements"
        ).map(req => req["ceterms:description"]?.["en-US"]);


        const matchingOccupations = (cipCode != null) ? await dataClient.findOccupationsByCip(cipCode) : [];
        const localExceptionCounties = (await dataClient.getLocalExceptionsByCip())
          .filter((localException: LocalException) => localException.cipcode === cipCode)
          .map((localException: LocalException) =>
            convertToTitleCaseIfUppercase(localException.county)
          );

        const training = {
          id: certificate["ceterms:ctid"],
          name: certificate["ceterms:name"] ? certificate["ceterms:name"]["en-US"] : "",
          cipCode: cipCode,
          provider: {
            id: ownedByRecord["ceterms:ctid"],
            name: ownedByRecord['ceterms:name']['en-US'],
            url: ownedByRecord['ceterms:subjectWebpage'],
            email: ownedByRecord['ceterms:email']? ownedByRecord['ceterms:email'][0] : null,
            county: "",
            addresses: ownedByAddresses,
          },
          description: certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : "",
          certifications: certifications,
          prerequisites: prerequisites,
          calendarLength: calendarLength, // TODO: figure out why this isn't working
          occupations: matchingOccupations.map((it) => ({
            title: it.title,
            soc: it.soc,
          })),
          inDemand: inDemandCIPCodes.includes(cipCode ?? ""),
          localExceptionCounty: localExceptionCounties, // TODO: Test
          tuitionCost: 0, // TODO: pull from costProfile - ceterms:directCostType with name "Tuition"
          feesCost: 0, // TODO: pull from costProfile
          booksMaterialsCost: 0, // TODO: pull from costProfile
          suppliesToolsCost: 0, // TODO: pull from costProfile
          otherCost: 0, // TODO: pull from costProfile
          totalCost: totalCost ? (totalCost): 0,
          online: availableOnlineAt != null ? true : false,
          percentEmployed: 0, // TODO: Get from QData?
          averageSalary: 0, // TODO: Get from QData?
          hasEveningCourses: false, // TODO: https://credreg.net/ctdl/terms/#scheduleTimingType
          languages: certificate["ceterms:inLanguage"]? certificate["ceterms:inLanguage"][0] : null,
          isWheelchairAccessible: false, // TODO: this field doesn't exist in CE!
          hasJobPlacementAssistance: false, // TODO: this field doesn't exist in CE!
          hasChildcareAssistance: false, // TODO: this field doesn't exist in CE!
          // TODO: Implement total clock hours
        }
        console.log(JSON.stringify(training));
        return training;

      })
    );
  };
};
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
  const match = duration.match(/^P(([0-9]+)Y)?(([0-9]+)M)?(([0-9]+)W)?(([0-9]+)D)?T?(([0-9]+)H)?(([0-9]+)M)?(([0-9]+)S)?$/);
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
  let calendarLength:CalendarLength = CalendarLength.NULL;

  if (years > 4) {
    calendarLength = CalendarLength.MORE_THAN_FOUR_YEARS
  }
  else if (years >= 3 && years <=4) {
    calendarLength = CalendarLength.THREE_TO_FOUR_YEARS;
  }
  else if ((years == 1 && months > 0) || (years >= 1 && years < 3))
    calendarLength = CalendarLength.THIRTEEN_MONTHS_TO_TWO_YEARS;
  else if (years == 0 && (months >= 6 && months <= 11)) {
    calendarLength = CalendarLength.SIX_TO_TWELVE_MONTHS;
  }
  else if (years == 0 && (months >= 3 && months <= 5)) {
    calendarLength = CalendarLength.THREE_TO_FIVE_MONTHS;
  }
  else if ((years == 0 && months == 0 && weeks >=3 && weeks <= 12) || months >= 1 && months < 3) {
    calendarLength = CalendarLength.FOUR_TO_ELEVEN_WEEKS;

  }
  else if (years == 0 && months == 0 && (weeks >= 2 && weeks < 4)) {
    calendarLength = CalendarLength.TWO_TO_THREE_WEEKS;
  }
  else if ((years == 0 && months == 0 && weeks == 0 && days >= 3) || (years == 0 && months == 0 && weeks == 1 && days == 0)) {
    calendarLength = CalendarLength.THREE_TO_SEVEN_DAYS;
  }
  else if ((years == 0 && months == 0 && weeks == 0 && (days == 1 || days == 2))) {
    calendarLength = CalendarLength.ONE_TO_TWO_DAYS;
  }
  else if ((years == 0 && months == 0 && weeks == 0 && days == 0) && (hours > 0)) {
    calendarLength = CalendarLength.LESS_THAN_ONE_DAY;
  }
  return calendarLength;
}
