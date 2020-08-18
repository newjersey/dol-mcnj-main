import {stripSurroundingQuotes} from "../utils/stripSurroundingQuotes";
import {stripUnicode} from "../utils/stripUnicode";
import {convertToTitleCase} from "../utils/convertToTitleCase";
import {FindTrainingsByIds} from "../types";
import {Training} from "./Training";
import {CalendarLength} from "../CalendarLength";
import {LocalException, Program} from "./Program";
import {TrainingDataClient} from "./TrainingDataClient";


export const findTrainingsByIdsFactory = (dataClient: TrainingDataClient): FindTrainingsByIds => {
  return async (ids: string[]): Promise<Training[]> => {

    const programs = await dataClient.findProgramsByIds(ids);

    return Promise.all(programs.map(async (program: Program) => {

      const matchingOccupations = await dataClient.findOccupationTitlesByCip(program.cipcode);
      const localExceptionCounties = (await dataClient.getLocalExceptions())
        .filter((localException: LocalException) => localException.cipcode === program.cipcode)
        .map((localException: LocalException) => convertToTitleCase(localException.county))

      return {
        id: program.programid,
        name: stripSurroundingQuotes(program.officialname),
        provider: {
          id: program.providerid,
          name: program.providername ? program.providername : "",
          url: program.website ? program.website : "",
          address: {
            street1: program.street1 ? program.street1 : "",
            street2: program.street2 ? program.street2 : "",
            city: program.city ? program.city : "",
            state: program.state ? program.state : "",
            zipCode: program.zip ? program.zip : "",
          },
        },
        description: stripSurroundingQuotes(stripUnicode(program.description)),
        calendarLength: program.calendarlengthid ?
          parseInt(program.calendarlengthid) :
          CalendarLength.NULL,
        occupations: matchingOccupations.map(it => it.soctitle),
        inDemand: !!program.indemandcip,
        localExceptionCounty: localExceptionCounties,
        totalCost: parseFloat(program.totalcost),
        online: !!program.onlineprogramid,
        percentEmployed: formatPercentEmployed(program.peremployed2),
        averageSalary: formatAverageSalary(program.avgquarterlywage2)
      }
    }))
  };
};

const NAN_INDICATOR = "-99999";

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

