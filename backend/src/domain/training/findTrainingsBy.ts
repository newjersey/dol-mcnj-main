import { stripSurroundingQuotes } from "../utils/stripSurroundingQuotes";
import { stripUnicode } from "../utils/stripUnicode";
import { convertToTitleCaseIfUppercase } from "../utils/convertToTitleCaseIfUppercase";
import { formatZip } from "../utils/formatZipCode";
import { FindTrainingsBy } from "../types";
import { Training } from "./Training";
import { CalendarLength } from "../CalendarLength";
import { Program } from "./Program";
import { DataClient } from "../DataClient";
import { Selector } from "./Selector";
import * as Sentry from "@sentry/node";

export const findTrainingsByFactory = (dataClient: DataClient): FindTrainingsBy => {
  return async (selector: Selector, values: string[]): Promise<Training[]> => {
    try {
      const programs = await dataClient.findProgramsBy(selector, values);

      return (
        await Promise.all(
          programs.map(async (program: Program) => {
            try {
              const matchingOccupations = await dataClient.findOccupationsByCip(program.cipcode);
              const localExceptionCounties = (await dataClient.getLocalExceptionsByCip())
                .filter((localException) => localException.cipcode === program.cipcode)
                .map((localException) => convertToTitleCaseIfUppercase(localException.county));

              const cipDefinition = await dataClient.findCipDefinitionByCip(program.cipcode);

              return {
                id: program.programid,
                name: stripSurroundingQuotes(convertToTitleCaseIfUppercase(program.officialname)),
                cipDefinition: cipDefinition !== undefined ? cipDefinition[0] : null,
                provider: {
                  id: program.providerid,
                  name: program.providername ? stripSurroundingQuotes(program.providername) : "",
                  url: program.website ?? "",
                  contactName:
                    program.contactfirstname && program.contactlastname
                      ? `${stripSurroundingQuotes(
                          program.contactfirstname,
                        )} ${stripSurroundingQuotes(program.contactlastname)}`
                      : "",
                  contactTitle: stripSurroundingQuotes(program.contacttitle ?? ""),
                  phoneNumber: program.phone ?? "",
                  phoneExtension: program.phoneextension ?? "",
                  county: formatCounty(program.county),
                  address: {
                    street1: stripSurroundingQuotes(program.street1 ?? ""),
                    street2: stripSurroundingQuotes(program.street2 ?? ""),
                    city: program.city ?? "",
                    state: program.state ?? "",
                    zipCode: program.zip ? formatZip(program.zip) : "",
                  },
                },
                description: stripSurroundingQuotes(stripUnicode(program.description ?? "")),
                certifications: program.industrycredentialname,
                prerequisites: formatPrerequisites(program.prerequisites),
                calendarLength: program.calendarlengthid
                  ? parseInt(program.calendarlengthid)
                  : CalendarLength.NULL,
                totalClockHours: parseInt(program.totalclockhours),
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
                  mapStrNumToBool(program.childcare) ||
                  mapStrNumToBool(program.assistobtainingchildcare),
              };
            } catch (error) {
              console.error(`Error while processing program id ${program.programid}: `, error);

              Sentry.withScope((scope) => {
                scope.setLevel("error");
                scope.setExtra("programId", program.programid);
                Sentry.captureException(error);
              });

              throw error;
            }
          }),
        )
      ).filter((item): item is Training => item !== null);
    } catch (error) {
      console.error(`Error while fetching programs: `, error);

      Sentry.withScope((scope) => {
        scope.setLevel("error");
        scope.setExtra("selector", selector);
        Sentry.captureException(error);
      });

      throw error;
    }
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
