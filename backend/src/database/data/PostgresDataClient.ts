import knex from "knex";
import Knex, { PgConnectionConfig } from "knex";
import { Error } from "../../domain/Error";
import {
  LocalException,
  NullableOccupationTitle,
  OccupationTitle,
  SocDefinition,
  Program,
  EducationText,
  SalaryEstimate,
} from "../../domain/training/Program";
import { DataClient } from "../../domain/DataClient";

const APPROVED = "Approved";

export class PostgresDataClient implements DataClient {
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
        "programs.tuition",
        "programs.fees",
        "programs.booksmaterialscost",
        "programs.suppliestoolscost",
        "programs.othercosts",
        "programs.totalcost",
        "providers.website",
        "providers.name as providername",
        "providers.street1",
        "providers.street2",
        "providers.city",
        "providers.state",
        "providers.zip",
        "providers.county",
        "providers.contactfirstname",
        "providers.contactlastname",
        "providers.contacttitle",
        "providers.phone",
        "providers.phoneextension",
        "indemandcips.cipcode as indemandcip",
        "onlineprograms.programid as onlineprogramid",
        "outcomes_cip.peremployed2",
        "outcomes_cip.avgquarterlywage2"
      )
      .leftOuterJoin("providers", "providers.providerid", "programs.providerid")
      .leftOuterJoin("indemandcips", "indemandcips.cipcode", "programs.cipcode")
      .leftOuterJoin("onlineprograms", "onlineprograms.programid", "programs.programid")
      .leftOuterJoin("outcomes_cip", function () {
        this.on("outcomes_cip.cipcode", "programs.cipcode").on(
          "outcomes_cip.providerid",
          "programs.providerid"
        );
      })
      .joinRaw(
        `join unnest('{${ids.join(
          ","
        )}}'::varchar[]) WITH ORDINALITY t(programid, ord) ON programs.programid = t.programid`
      )
      .whereIn("programs.programid", ids)
      .andWhere("programs.statusname", APPROVED)
      .andWhere("providers.statusname", APPROVED)
      .orderByRaw("t.ord")
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });

    if (programs.length === 0) {
      return Promise.reject(Error.NOT_FOUND);
    }

    return programs;
  };

  getLocalExceptions = (): Promise<LocalException[]> => {
    return this.kdb("localexceptioncips")
      .select("cipcode", "county")
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  findOccupationTitlesByCip = (cip: string): Promise<OccupationTitle[]> => {
    return this.kdb("soccipcrosswalk")
      .select("soc2018code as soc", "soc2018title as soctitle")
      .where("cipcode", cip)
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  findSocDefinitionBySoc = (soc: string): Promise<SocDefinition> => {
    return this.kdb("socdefinitions")
      .select("soccode as soc", "soctitle", "socdefinition")
      .where("soccode", soc)
      .first()
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  find2018OccupationTitlesBySoc2010 = (soc2010: string): Promise<OccupationTitle[]> => {
    return this.kdb("soc2010to2018crosswalk")
      .select("soccode2018 as soc", "soctitle2018 as soctitle")
      .where("soccode2010", soc2010)
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  find2010OccupationTitlesBySoc2018 = (soc2018: string): Promise<OccupationTitle[]> => {
    return this.kdb("soc2010to2018crosswalk")
      .select("soccode2010 as soc", "soctitle2010 as soctitle")
      .where("soccode2018", soc2018)
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  getInDemandOccupationTitles = async (): Promise<NullableOccupationTitle[]> => {
    return this.kdb("indemandsocs")
      .select("soc", "socdefinitions.soctitle")
      .leftOuterJoin("socdefinitions", "socdefinitions.soccode", "indemandsocs.soc")
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  getEducationTextBySoc = (soc: string): Promise<EducationText> => {
    return this.kdb("blsoccupationhandbook")
      .select("occupation_summary_how_to_become_one as howtobecomeone")
      .where("occupation_soc_coverage_soc_code", soc)
      .first()
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  getSalaryEstimateBySoc = (soc: string): Promise<SalaryEstimate> => {
    return this.kdb("oesestimates")
      .select("a_median as mediansalary")
      .where("occ_code", soc)
      .where("area_title", "New Jersey")
      .first()
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  disconnect = async (): Promise<void> => {
    await this.kdb.destroy();
  };
}
