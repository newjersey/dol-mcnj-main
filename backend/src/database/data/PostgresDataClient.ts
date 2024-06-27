import knex from "knex";
import { type Knex } from "knex";
import {
  LocalException,
  SocDefinition,
  CipDefinition,
  EducationText,
  SalaryEstimate,
  NullableOccupation,
  OutcomeDefinition,
} from "../../domain/training/Program";
import { DataClient } from "../../domain/DataClient";
import { Occupation } from "../../domain/occupations/Occupation";
export class PostgresDataClient implements DataClient {
  kdb: Knex;

  constructor(connection: Knex.PgConnectionConfig) {
    this.kdb = knex({
      client: "pg",
      connection: connection,
    });
  }

  getLocalExceptionsByCip = (): Promise<LocalException[]> => {
    return this.kdb("localexceptioncips")
      .distinctOn(["cipcode", "county"])
      .select("cipcode", "county")
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  getLocalExceptionsBySoc = (): Promise<LocalException[]> => {
    return this.kdb
        .select("localexceptioncips.soc", "localexceptioncips.county", "localexceptioncips.occupation as title")
        .from("localexceptioncips")
        // Join with the indemandsocs table to exclude in-demand SOCs
        .leftJoin("indemandsocs", "localexceptioncips.soc", "indemandsocs.soc")
        // Left join with a crosswalk table to support both 2010 and 2018 SOC codes
        .leftJoin("soc2010to2018crosswalk", "localexceptioncips.soc", "soc2010to2018crosswalk.soccode2018")
        .leftJoin("indemandsocs as indemandsocs2010", "soc2010to2018crosswalk.soccode2010", "indemandsocs2010.soc")
        // Filter out SOCs that are in the indemandsocs table for both 2010 and 2018 codes
        .whereNull("indemandsocs.soc")
        .whereNull("indemandsocs2010.soc")
        .then((result) => {
          // console.log("Local exceptions:", result);
          return result;
        })
        .catch((e) => {
          console.log("DB error:", e);
          return Promise.reject();
        });
  };

  findLocalExceptionsBySoc = (soc: string): Promise<LocalException[]> => {
    return this.kdb("localexceptioncips")
      .select("soc", "county", "occupation as title")
      .where("soc", soc)
      .distinctOn("soc")
      .then((result) => {
        // console.log("Local exceptions:", result);
        return result;
      })
      .catch((e) => {
        console.log("DB error:", e);
        return Promise.reject();
      });
  };

  findOccupationsByCip = (cip: string): Promise<Occupation[]> => {
    return this.kdb("soccipcrosswalk")
      .select("soc2018code as soc", "soc2018title as title")
      .where("cipcode", cip)
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  findSocDefinitionBySoc = (soc: string): Promise<SocDefinition> => {
    return this.kdb("socdefinitions")
      .select("soccode as soc", "soctitle as title", "socdefinition as definition")
      .where("soccode", soc)
      .first()
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  findCipDefinitionBySoc2018 = (soc: string): Promise<CipDefinition[]> => {
    return this.kdb("soccipcrosswalk")
      .select("cipcode", "cip2020title as ciptitle")
      .where("soc2018code", soc)
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  findCipDefinitionByCip = (cip: string): Promise<CipDefinition[]> => {
    return this.kdb("soccipcrosswalk")
      .select("cipcode", "cip2020title as ciptitle")
      .where("cipcode", cip)
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  findOutcomeDefinition = (providerid: string, cip: string): Promise<OutcomeDefinition> => {
    return this.kdb("outcomes_cip")
      .select("peremployed2", "avgquarterlywage2")
      .where("cipcode", cip)
      .where("providerid", providerid)
      .first()
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  }

  find2018OccupationsBySoc2010 = (soc2010: string): Promise<Occupation[]> => {
    return this.kdb("soc2010to2018crosswalk")
      .select("soccode2018 as soc", "socdefinitions.soctitle as title")
      .where("soccode2010", soc2010)
      .leftOuterJoin(
        "socdefinitions",
        "socdefinitions.soccode",
        "soc2010to2018crosswalk.soccode2018",
      )
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  find2010OccupationsBySoc2018 = (soc2018: string): Promise<Occupation[]> => {
    return this.kdb("soc2010to2018crosswalk")
      .select("soccode2010 as soc", "soctitle2010 as title")
      .where("soccode2018", soc2018)
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  getOccupationsInDemand = async (): Promise<NullableOccupation[]> => {
    return this.kdb("indemandsocs")
      .select("soc", "socdefinitions.soctitle as title")
      .leftOuterJoin("socdefinitions", "socdefinitions.soccode", "indemandsocs.soc")
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  getCIPsInDemand = async (): Promise<CipDefinition[]> => {
    return this.kdb("indemandcips")
      .select("cipcode as cipcode")
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

  getOESOccupationBySoc = (soc: string): Promise<Occupation> => {
    return this.kdb("oeshybridcrosswalk")
      .select("oes2019estimatescode as soc", "oes2019estimatestitle as title")
      .where("soccode2018", soc)
      .first()
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  getNeighboringOccupations = (soc: string): Promise<Occupation[]> => {
    const firstFiveDigits = soc.slice(0, 6);
    return this.kdb("socdefinitions")
      .select("soccode as soc", "soctitle as title")
      .where("soccode", "like", `${firstFiveDigits}%`)
      .andWhere("socgroup", "Detailed")
      .andWhereNot("soccode", soc)
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  disconnect = async (): Promise<void> => {
    await this.kdb.destroy();
  };
}
