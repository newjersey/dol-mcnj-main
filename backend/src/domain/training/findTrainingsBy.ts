import { stripSurroundingQuotes } from "../utils/stripSurroundingQuotes";
import { stripUnicode } from "../utils/stripUnicode";
import { convertToTitleCaseIfUppercase } from "../utils/convertToTitleCaseIfUppercase";
import { formatZip } from "../utils/formatZipCode";
import { FindTrainingsBy } from "../types";
import { Training } from "./Training";
import { CalendarLength } from "../CalendarLength";
import { LocalException, Program } from "./Program";
import { DataClient } from "../DataClient";
import { Selector } from "./Selector";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI"
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
        console.log(`RECORDS RESPONSE: ${certificate["ceterms:ctid"]}`)
        let cip:any = null;
        const ownedBy = certificate["ceterms:ownedBy"][0];
        const ownedByCtid:string = await credentialEngineUtils.getCtidFromURL(ownedBy);
        const ownedByRecord = await credentialEngineAPI.getResourceByCTID(ownedByCtid);
        const instructionalProgramType = certificate["ceterms:instructionalProgramType"];
        if (instructionalProgramType != null) {
          if (instructionalProgramType["ceterms:frameworkName"].equals("Classification of Instructional Programs")) {
            cip = instructionalProgramType["ceterms:codedNotation"].toString();
          }
        }

        const matchingOccupations = (cip != null) ? await dataClient.findOccupationsByCip(certificate.cipcode) : [];
        /*const localExceptionCounties = (await dataClient.getLocalExceptions())
          .filter((localException: LocalException) => localException.cipcode === certificate.cipCode)
          .map((localException: LocalException) =>
            convertToTitleCaseIfUppercase(localException.county)
          );*/
        const training = {
          id: certificate["ceterms:ctid"],
          name: certificate["ceterms:name"],
          cipCode: cip,
          provider: {
            id: ownedByRecord["ceterms:ctid"],
            name: ownedByRecord['ceterms:name']['en-US'],
            url: ownedByRecord['ceterms:subjectWebpage'],

            contactName:"",
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
          prerequisites: "",
          calendarLength: CalendarLength.NULL,
          occupations: matchingOccupations.map((it) => ({
            title: it.title,
            soc: it.soc,
          })),
          inDemand: inDemandCIPCodes.includes(cip),
          //localExceptionCounty: localExceptionCounties,
          localExceptionCounty: [""],
          tuitionCost: 0,
          feesCost: 0,
          booksMaterialsCost: 0,
          suppliesToolsCost: 0,
          otherCost: 0,
          totalCost: 0,
          online: false,
          percentEmployed: 0,
          averageSalary: 0,
          hasEveningCourses: false,
          languages: [""],
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
