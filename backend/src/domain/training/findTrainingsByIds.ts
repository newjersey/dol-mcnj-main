import { stripSurroundingQuotes } from "../utils/stripSurroundingQuotes";
import { stripUnicode } from "../utils/stripUnicode";
import { convertToTitleCaseIfUppercase } from "../utils/convertToTitleCaseIfUppercase";
import { FindTrainingsByIds } from "../types";
import { Training } from "./Training";
import { CalendarLength } from "../CalendarLength";
import { LocalException, Program } from "./Program";
import { DataClient } from "./DataClient";

export const findTrainingsByIdsFactory = (dataClient: DataClient): FindTrainingsByIds => {
  return async (ids: string[]): Promise<Training[]> => {
    const programs = await dataClient.findProgramsByIds(ids);

    return Promise.all(
      programs.map(async (program: Program) => {
        const matchingOccupations = await dataClient.findOccupationTitlesByCip(program.cipcode);
        const localExceptionCounties = (await dataClient.getLocalExceptions())
          .filter((localException: LocalException) => localException.cipcode === program.cipcode)
          .map((localException: LocalException) =>
            convertToTitleCaseIfUppercase(localException.county)
          );

        return {
          id: program.programid,
          name: stripSurroundingQuotes(convertToTitleCaseIfUppercase(program.officialname)),
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
              zipCode: program.zip ? program.zip : "",
            },
          },
          description: stripSurroundingQuotes(stripUnicode(program.description)),
          calendarLength: program.calendarlengthid
            ? parseInt(program.calendarlengthid)
            : CalendarLength.NULL,
          occupations: matchingOccupations.map((it) => it.soctitle),
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
        };
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
