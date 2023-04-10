import { stripSurroundingQuotes } from "../utils/stripSurroundingQuotes";
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
  Ceterms,
  CetermsEstimatedCost,
  CetermsEstimatedDuration,
  CetermsInstructionalProgramType, CetermsIsPreparationFor,
  CetermsOccupationType,
  CetermsScheduleTimingType,
  CTDLResource
} from "../credentialengine/CredentialEngine";
import { util } from "prettier";
import skip = util.skip;


export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
    const inDemandCIPs = await dataClient.getCIPsInDemand();
    const inDemandCIPCodes = inDemandCIPs.map(c => c.cip)
    const ceRecords:any = []
    const prerequisites:any = []

    for (const value of values) {
      const ctid = await credentialEngineUtils.getCtidFromURL(value)
      const record = await credentialEngineAPI.getResourceByCTID(ctid);
      ceRecords.push(record);
    }
    return Promise.all(
      ceRecords.map(async (certificate : CTDLResource) => {
        let cip:any = null;
        let totalCost:any = null;
        let exactDuration:any = null;
        let prerequisites = null;
        let credential = null;
        let calendarLength:CalendarLength = CalendarLength.NULL;

        // GET provider record
        const ownedBy = certificate["ceterms:ownedBy"] ? certificate["ceterms:ownedBy"] : [];
        const ownedByCtid = await credentialEngineUtils.getCtidFromURL(ownedBy[0]);
        const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
        const ownedByAddresses:any[] = [];
        const providerContactPoints:any[] = [];

        const ownedByAddressObject = ownedByRecord["ceterms:address"];
        const availableOnlineAt = certificate["ceterms:availableOnlineAt"];
        const commonConditions = certificate["ceterms:commonConditions"];
        const estimatedCost = certificate["ceterms:estimatedCost"] as CetermsEstimatedCost[];
        const estimatedDuration = certificate["ceterms:estimatedDuration"] as CetermsEstimatedDuration[];
        const instructionalProgramType = certificate["ceterms:instructionalProgramType"] as CetermsInstructionalProgramType;
        const isPreparationFor = certificate["ceterms:isPreparationFor"] as CetermsIsPreparationFor[]
        const occupationType = certificate["ceterms:occupationType"] as CetermsOccupationType;
        const scheduleTimingType = certificate["ceterms:scheduleTimingType"] as CetermsScheduleTimingType;
        if (ownedByAddressObject != null) {
          for (const element of ownedByAddressObject) {
            if (element["@type"] == "ceterms:Place" && element["ceterms:streetAddress"] != null) {
              const addressContactPoints:any[] = [];

              const targetContactPointObject = element["ceterms:targetContactPoint"];
              if (targetContactPointObject != null) {
                for (const contactPoint of targetContactPointObject) {
                  const targetContactPoint = {
                    alternateName: element["ceterms:alternateName"],
                    contactType: element["ceterms:contactType"],
                    email: element["ceterms:email"],
                    faxNumber: element["ceterms:faxNumber"],
                    name: element["ceterms:name"],
                    socialMedia: element["ceterms:socialMedia"],
                    telephone: element["ceterms:telephone"]
                  };

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
                alternateName: element["ceterms:alternateName"],
                contactType: element["ceterms:contactType"],
                email: element["ceterms:email"],
                faxNumber: element["ceterms:faxNumber"],
                name: element["ceterms:name"],
                socialMedia: element["ceterms:socialMedia"],
                telephone: element["ceterms:telephone"]
              };

              providerContactPoints.push(targetContactPoint);
            }
          }
        }

        // GET prerequisites - could be in ceterms:CommonConditions, could be in ceterms:prerequisites
        if (commonConditions != null) {
          // TODO: Modify to handle multiple commonconditions, which can have multiple requirements
          const conditionUrl = commonConditions[0];
          const conditionCtid = await credentialEngineUtils.getCtidFromURL(conditionUrl);
          const conditionRecord = await credentialEngineAPI.getResourceByCTID(conditionCtid);
        }

        if (estimatedDuration != null) {
          const durationProfile = estimatedDuration[0];
          if (durationProfile != null) {
            exactDuration = durationProfile["ceterms:exactDuration"];
            calendarLength = convertDuration(exactDuration);
          }
        }

        // If record contains "ceterms:instructionalProgramType" object, get frameworkName and set values if CIP
        if (instructionalProgramType != null) {
          if (instructionalProgramType["ceterms:frameworkName"] != null) {
            const frameworkName = instructionalProgramType["ceterms:frameworkName"]["en-US"];
            if (frameworkName == "Classification of Instructional Programs") {
              cip = instructionalProgramType["ceterms:codedNotation"];
            }
            // TODO : handle other frameworkName values
          }
        }
        else if (estimatedCost != null) {
          /*          This is getting the first costProfile it sees under estimatedCost... we get a lot more
                    fields at our disposal here like costDetails, description, directCostType that we should
                    look through here*/

          // Look for total cost in estimatedCost
          // TODO: Modify to handle multiple costProfiles
          const costProfile = estimatedCost[0];
          if (costProfile["ceterms:currency"] != null) {
            if (costProfile["ceterms:currency"] == "US Dollar") {
              totalCost = Number(costProfile["ceterms:price"]);
            }
          }
        }

        if (occupationType != null) {
          // get SOCs from ceterms:occupationType instead of from the database

        }
        // fix bug here
        // GET credentials and certifications this prepares for
        /*if (isPreparationFor != null) {
          // TODO: Modify to handle multiple conditionProfiles
          const conditionProfile = isPreparationFor[0];
          if (conditionProfile != null) {
            // TODO: Modify to handle multiple targetCredentials per conditionProfile
            const targetCredential = conditionProfile["ceterms:targetCredential"]
            if (targetCredential != null) {
              const credentialUrl = targetCredential[0]
              const credentialCtid = await credentialEngineUtils.getCtidFromURL(credentialUrl);
              const credentialRecord = await credentialEngineAPI.getResourceByCTID(credentialCtid) as CTDLResource;
              if (credentialRecord["ceterms:name"] != null) {
                if (credentialRecord["ceterms:name"]["en-US"] != null) {
                  credential = credentialRecord["ceterms:name"]["en-US"];
                }
              }
            }
          }
        }*/

        // GET scheduling information - for example, evening courses
        if (scheduleTimingType != null) {
          console.log(JSON.stringify(scheduleTimingType, null, 2));
        }

        const matchingOccupations = (cip != null) ? await dataClient.findOccupationsByCip(cip) : []; // TODO: redod this
        const localExceptionCounties = (await dataClient.getLocalExceptions()) // TODO: investigate what are localexceptioncounties
          .filter((localException: LocalException) => localException.cipcode === cip)
          .map((localException: LocalException) =>
            convertToTitleCaseIfUppercase(localException.county)
          );

        const training = {
          id: certificate["ceterms:ctid"],
          name: certificate["ceterms:name"] ? certificate["ceterms:name"]["en-US"] : "",
          cipCode: cip,
          provider: {
            id: ownedByRecord["ceterms:ctid"],
            name: ownedByRecord['ceterms:name']['en-US'],
            url: ownedByRecord['ceterms:subjectWebpage'],
            email: ownedByRecord['ceterms:email']? ownedByRecord['ceterms:email'][0] : null,
            county: "",
            addresses: ownedByAddresses,
          },
          description: certificate["ceterms:description"] ? certificate["ceterms:description"]["en-US"] : "",
          certifications: credential,
          prerequisites: null, // TODO: ceterms:CommonConditions / ceterms:prerequisites,
          calendarLength: calendarLength, // TODO: figure out why this isn't working
          occupations: matchingOccupations.map((it) => ({
            title: it.title,
            soc: it.soc,
          })),
          inDemand: inDemandCIPCodes.includes(cip), // TODO: Test
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
        }
        console.log(training);
        return training;

      })
    );
  };
};

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
  const min = match[12] ? parseInt(match[12]) : 0;
  const sec = match[14] ? parseInt(match[14]) : 0;

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
