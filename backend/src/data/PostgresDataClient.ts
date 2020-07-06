/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DataClient } from "../domain/DataClient";
import pgPromise, { IDatabase, ParameterizedQuery } from "pg-promise";
import { CipSocCrosswalkEntity, JoinedEntity } from "./ProgramEntity";
import { Program } from "../domain/Program";

const pgp = pgPromise();

export class PostgresDataClient implements DataClient {
  db: IDatabase<any>;

  constructor(connection: any) {
    this.db = pgp(connection);
  }

  joinStatement =
    "SELECT programs.id, programs.providerid, programs.officialname, programs.totalcost, " +
    "outcomes_cip.PerEmployed2, providers.city " +
    "FROM programs " +
    "LEFT OUTER JOIN outcomes_cip " +
    "ON outcomes_cip.cipcode = programs.cipcode " +
    "AND outcomes_cip.providerid = programs.providerid " +
    "LEFT OUTER JOIN providers " +
    "ON providers.providerid = programs.providerid ";

  findAllPrograms = (): Promise<Program[]> => {
    const sqlSelect = this.joinStatement + ";";

    return this.dbQueryForProgramOutcomeEntities(sqlSelect);
  };

  searchPrograms = (searchQuery: string): Promise<Program[]> => {
    const sqlSearch =
      this.joinStatement +
      "WHERE LOWER(officialname) LIKE LOWER('%' || $1 || '%') " +
      "OR LOWER(description) LIKE LOWER('%' || $1 || '%');";

    return this.dbQueryForProgramOutcomeEntities(sqlSearch, [searchQuery]);
  };

  findProgramsByCips = (cips: string[]): Promise<Program[]> => {
    if (cips.length === 0) {
      return Promise.resolve([]);
    }

    const values = cips.map((cip) => "'" + cip + "'").join(",");
    const sqlSearch = this.joinStatement + `WHERE programs.cipcode IN (${values});`;

    return this.dbQueryForProgramOutcomeEntities(sqlSearch);
  };

  searchCipsBySocKeyword = (searchQuery: string): Promise<string[]> => {
    const sql =
      "SELECT * FROM soccipcrosswalk " + "WHERE LOWER(soc2018title) LIKE LOWER('%' || $1 || '%')";
    const paramaterizedQuery = new ParameterizedQuery({ text: sql, values: [searchQuery] });
    return this.db
      .any(paramaterizedQuery)
      .then((data: CipSocCrosswalkEntity[]) => {
        return data.map((entity) => entity.cip2020code.replace(/\./g, ""));
      })
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  private dbQueryForProgramOutcomeEntities = (
    sql: string,
    values?: string[]
  ): Promise<Program[]> => {
    const paramaterizedQuery = new ParameterizedQuery({ text: sql, values: values });
    return this.db
      .any(paramaterizedQuery)
      .then((data: JoinedEntity[]) => {
        return data.map(this.mapJoinedEntityToProgram);
      })
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  private mapJoinedEntityToProgram = (entity: JoinedEntity): Program => {
    return {
      id: entity.id,
      name: entity.officialname,
      totalCost: parseFloat(entity.totalcost),
      percentEmployed: this.formatPercentEmployed(entity.peremployed2),
      provider: {
        id: entity.providerid,
        city: entity.city,
      },
    };
  };

  private formatPercentEmployed = (perEmployed: string): number | null => {
    const NAN_INDICATOR = "-99999";
    if (perEmployed === null || perEmployed === NAN_INDICATOR) {
      return null;
    }

    return parseFloat(perEmployed);
  };

  disconnect() {
    pgp.end();
  }
}
