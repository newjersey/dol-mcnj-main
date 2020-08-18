import {OccupationEntity,} from "./Entities";
import knex from "knex";
import Knex, {PgConnectionConfig} from "knex";
import {Error} from "../../domain/Error";
import {Occupation} from "../../domain/occupations/Occupation";
import {LocalException, OccupationTitle, Program} from "../../domain/training/Program";
import {TrainingDataClient} from "../../domain/training/TrainingDataClient";

const APPROVED = 'Approved';

export class PostgresDataClient implements TrainingDataClient {
  kdb: Knex;

  constructor(connection: PgConnectionConfig) {
    this.kdb = knex({
      client: "pg",
      connection: connection,
    });
  }

  findProgramsByIds = async (ids: string[]): Promise<Program[]> => {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    const programs = await this.kdb("programs")
      .select(
        "programs.programid",
        "programs.providerid",
        "programs.officialname",
        "programs.calendarlengthid",
        "programs.description",
        "programs.cipcode",
        "programs.totalcost",
        "providers.website",
        "providers.name as providername",
        "providers.street1",
        "providers.street2",
        "providers.city",
        "providers.state",
        "providers.zip",
        "indemandcips.cipcode as indemandcip",
        "onlineprograms.programid as onlineprogramid",
        "outcomes_cip.peremployed2",
        "outcomes_cip.avgquarterlywage2",
      )
      .leftOuterJoin("providers", "providers.providerid", "programs.providerid")
      .leftOuterJoin("indemandcips", "indemandcips.cipcode", "programs.cipcode")
      .leftOuterJoin("onlineprograms", "onlineprograms.programid", "programs.programid")
      .leftOuterJoin("outcomes_cip", function () {
        this
          .on("outcomes_cip.cipcode", "programs.cipcode")
          .on("outcomes_cip.providerid", "programs.providerid");
      })
      .joinRaw(`join unnest('{${ids.join(",")}}'::varchar[]) WITH ORDINALITY t(programid, ord) ON programs.programid = t.programid`)
      .whereIn("programs.programid", ids)
      .andWhere('programs.statusname', APPROVED)
      .andWhere('providers.statusname', APPROVED)
      .orderByRaw("t.ord");

    if (programs.length === 0) {
      return Promise.reject(Error.NOT_FOUND)
    }

    return programs;
  };

  getLocalExceptions = (): Promise<LocalException[]> => {
    return this.kdb("localexceptioncips")
      .select(
        "cipcode",
        "county"
      );
  }

  findOccupationTitlesByCip = (cip: string): Promise<OccupationTitle[]> => {
    return this.kdb("soccipcrosswalk")
      .select(
        "soc2018code as soc",
        "soc2018title as soctitle",
      )
      .where("cipcode", cip);
  }

  getInDemandOccupations = async (): Promise<Occupation[]> => {
    return this.kdb("indemandsocs")
      .select(
        "soc",
        "socdefinitions.soctitle"
      )
      .innerJoin('socdefinitions', 'socdefinitions.soccode', 'indemandsocs.soc')
      .then((data: OccupationEntity[]) => data.map(entity => ({
        soc: entity.soc,
        title: entity.soctitle
      })))
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  disconnect = async (): Promise<void> => {
    await this.kdb.destroy();
  }
}
