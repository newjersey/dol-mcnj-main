import { stripSurroundingQuotes } from "../utils/stripSurroundingQuotes";
import { stripUnicode } from "../utils/stripUnicode";
import { convertToTitleCaseIfUppercase } from "../utils/convertToTitleCaseIfUppercase";
import { formatZip } from "../utils/formatZipCode";
import { FindTrainingsBy, GetAllCertificates } from "../types";
import { Training } from "./Training";
import { CalendarLength } from "../CalendarLength";
import { LocalException, Program } from "./Program";
import { DataClient } from "../DataClient";
import { Selector } from "./Selector";
import { credentialEngineAPI } from "../../credentialengine/CredentialEngineAPI"
import { Certificate, Certificates, Keypair } from "../credentialengine/CredentialEngineInterface";
import { type } from "os";
import { credentialEngineUtils } from "../../credentialengine/CredentialEngineUtils";
import { credentialEngineFactory } from "../credentialengine/CredentialEngineFactory";


export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
   const programs = await dataClient.findProgramsBy(selector, values);
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
    const take = 100;
    const sort = "^search:recordCreated";
    const ceRecordsResponse = await credentialEngineAPI.getResults(query, skip, take, sort);
    const ownedByResponse = await credentialEngineAPI.getResourceByCTID("ce-9fe93f5f-e0cf-40b2-9194-2ed178e115bb");
    console.log(ownedByResponse['ceterms:name']['en-US']);
    return Promise.all(
      ceRecordsResponse.data.map(async (certificate : any) => {
        let cip = null;
        const instructionalProgramType = certificate["ceterms:instructionalProgramType"];
        if (instructionalProgramType != null) {
          if (instructionalProgramType["ceterms:frameworkName"].equals("Classification of Instructional Programs")) {
            cip = instructionalProgramType["ceterms:codedNotation"];
          }
        }

        // //const matchingOccupations = await dataClient.findOccupationsByCip(program.cipcode);
        // const localExceptionCounties = (await dataClient.getLocalExceptions())
        //   .filter((localException: LocalException) => localException.cipcode === certificate.cipcode)
        //   .map((localException: LocalException) =>
        //     convertToTitleCaseIfUppercase(localException.county)
        //   );

/*
        return {
          name: certificate["ceterms:name"],
          cipCode: cip,
          provider: {
            id: program.providerid,
            name: program.providername ? stripSurroundingQuotes(program.providername) : "",
            url: program.website ? program.website : "",
            contactName:
              program.contactfirstname && program.contactlastname
                ? `${stripSurroundingQuotes(program.contactfirstname)} ${stripSurroundingQuotes(
                    program.contactlastname
                  )}`
                : "",
            contactTitle: program.contacttitle ? stripSurroundingQuotes(program.contacttitle) : "",
            phoneNumber: program.phone ? program.phone : "",
            phoneExtension: program.phoneextension ? program.phoneextension : "",
            county: formatCounty(program.county),
            address: {
              street1: program.street1 ? stripSurroundingQuotes(program.street1) : "",
              street2: program.street2 ? stripSurroundingQuotes(program.street2) : "",
              city: program.city ? program.city : "",
              state: program.state ? program.state : "",
              zipCode: program.zip ? formatZip(program.zip) : "",
            },
          },
          description: stripSurroundingQuotes(stripUnicode(program.description ?? "")),
          certifications: program.industrycredentialname,
          prerequisites: formatPrerequisites(program.prerequisites),
          calendarLength: program.calendarlengthid
            ? parseInt(program.calendarlengthid)
            : CalendarLength.NULL,
          occupations: matchingOccupations.map((it) => ({
            title: it.title,
            soc: it.soc,
          })),
          inDemand: !!program.indemandcip,
          localExceptionCounty: localExceptionCounties,
          tuitionCost: parseFloat(program.tuition),
          feesCost: parseFloat(program.fees),
          booksMaterialsCost: parseFloat(program.booksmaterialscost),
          suppliesToolsCost: parseFloat(program.suppliestoolscost),
          otherCost: parseFloat(program.othercosts),
          totalCost: parseFloat(program.totalcost),
          online: !!program.onlineprogramid,
          percentEmployed: formatPercentEmployed(program.peremployed2),
          averageSalary: formatAverageSalary(program.avgquarterlywage2),
          hasEveningCourses: mapStrNumToBool(program.eveningcourses),
          languages: formatLanguages(program.languages),
          isWheelchairAccessible: mapStrNumToBool(program.accessfordisabled),
          hasJobPlacementAssistance: mapStrNumToBool(program.personalassist),
          hasChildcareAssistance:
            mapStrNumToBool(program.childcare) || mapStrNumToBool(program.assistobtainingchildcare),
        };
*/
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
