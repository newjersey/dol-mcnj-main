import { stripSurroundingQuotes } from "../utils/stripSurroundingQuotes";
import { convertToTitleCaseIfUppercase } from "../utils/convertToTitleCaseIfUppercase";
import { FindTrainingsBy } from "../types";
import { Training } from "./Training";
import { CalendarLength } from "../CalendarLength";
import { LocalException } from "./Program";
import { DataClient } from "../DataClient";
import { Selector } from "./Selector";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";


export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
   const inDemandCIPs = await dataClient.getCIPsInDemand();
    const inDemandCIPCodes = inDemandCIPs.map(c => c.cip)

    const query = {
      'ceterms:credentialStatusType': {
        'ceterms:targetNode': 'credentialStat:Active'
      },
      'ceterms:requires': {
        'ceterms:targetAssessment': {
          'ceterms:availableOnlineAt': 'search:anyValue',
          'ceterms:availableAt': {
            'ceterms:addressRegion': [
              'New Jersey',
              'NJ'
            ]
          },
          'search:operator': 'search:orTerms'
        }
      }
    }
    const skip = 0;
    const take = 3;
    const sort = "^search:recordCreated";
    const ceRecordsResponse = await credentialEngineAPI.getResults(query, skip, take, sort);
    const ceRecords = ceRecordsResponse.data.data;

    return Promise.all(
      ceRecords.map(async (certificate : any) => {
        console.log(`RECORDS RESPONSE: ${JSON.stringify(certificate, null, 2)}`)
        let cip:any = null;
        let totalCost:any = null;
        let exactDuration:any = null;
        let calendarLength:CalendarLength = CalendarLength.NULL;

        const ownedBy = certificate["ceterms:ownedBy"][0];
        const ownedByCtid:string = await credentialEngineUtils.getCtidFromURL(ownedBy);
        const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);

        const availableOnlineAt = certificate["ceterms:availableOnlineAt"];
        const estimatedCost = certificate["ceterms:estimatedCost"];
        const estimatedDuration = certificate["ceterms:estimatedDuration"];
        const financialAssistance = certificate["ceterms:financialAssistance"];
        const instructionalProgramType = certificate["ceterms:instructionalProgramType"];
        const learningDeliveryType = certificate["ceterms:learningDeliveryType"];
        const occupationType = certificate["ceterms:occupationType"];
        const scheduleTimingType = certificate["ceterms:scheduleTimingType"];
        const targetLearningOpportunity = certificate["ceterms:targetLearningOpportunity"];

        if (estimatedDuration != null) {
          const durationProfile = estimatedDuration[0];
          if (durationProfile != null) {
            exactDuration = durationProfile["ceterms:exactDuration"];
            calendarLength = convertDuration(exactDuration)
          }
        }

        // If record contains "ceterms:instructionalProgramType" object, get frameworkName and set values if CIP or SOC
        if (instructionalProgramType != null) {
          if (instructionalProgramType["ceterms:frameworkName"].equals("Classification of Instructional Programs")) {
            cip = instructionalProgramType["ceterms:codedNotation"].toString();
            // TODO: check if SOC available and implement lookup from db crosswalk
          }
        }

        if (targetLearningOpportunity != null) {
          // Look for total cost in targetLearningOpportunity
          const estimatedCostForTarget = targetLearningOpportunity["estimatedCost"];
          if (estimatedCostForTarget != null) {
            totalCost = Number(estimatedCostForTarget["ceterms:price"]);
          }
        }
        else if (estimatedCost != null) {
          // Look for total cost in estimatedCost
          const costProfile = estimatedCost[0];
          if (costProfile != null) {
            if (costProfile["ceterms:currency"].equals("US Dollar")) {
              totalCost = Number(costProfile["ceterms:price"])
            }
          }
        } else {
          // Conflicting data!!!
        }

/*        if (occupationType != null) {

        }*/

        if (scheduleTimingType != null) {
          console.log(JSON.stringify(scheduleTimingType, null, 2));
        }

        const matchingOccupations = (cip != null) ? await dataClient.findOccupationsByCip(cip) : [];
        const localExceptionCounties = (await dataClient.getLocalExceptions())
          .filter((localException: LocalException) => localException.cipcode === cip)
          .map((localException: LocalException) =>
            convertToTitleCaseIfUppercase(localException.county)
          );

        const training = {
          id: certificate["ceterms:ctid"],
          name: certificate["ceterms:name"],
          cipCode: cip,
          provider: {
            id: ownedByRecord["ceterms:ctid"],
            name: ownedByRecord['ceterms:name']['en-US'],
            url: ownedByRecord['ceterms:subjectWebpage'],

            contactName: "",
            contactTitle: "",
            phoneNumber: "",
            phoneExtension: "",
            county: "",
            address: {
              street1: "",
              street2: "",
              city: "",
              state: "",
              zipCode: "",
            },
          },
          description: certificate['ceterms:description']['en-US'],
          certifications: "",
          prerequisites: "", // ceterms:CommonConditions,
          calendarLength: calendarLength, // WHY ISN't THIS WORKING
          occupations: matchingOccupations.map((it) => ({
            title: it.title,
            soc: it.soc,
          })),
          inDemand: inDemandCIPCodes.includes(cip),
          localExceptionCounty: localExceptionCounties,
          tuitionCost: 0,
          feesCost: 0,
          booksMaterialsCost: 0,
          suppliesToolsCost: 0,
          otherCost: 0,
          totalCost: parseFloat(totalCost),
          online: availableOnlineAt != null ? true : false,
          percentEmployed: 0,
          averageSalary: 0,
          hasEveningCourses: false,
          languages: certificate["ceterms:inLanguage"],
          isWheelchairAccessible: false,
          hasJobPlacementAssistance: false,
          hasChildcareAssistance: false,
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
