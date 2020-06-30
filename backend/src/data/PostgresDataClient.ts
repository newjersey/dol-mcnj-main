/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DataClient } from "../domain/DataClient";
import pgPromise, { IDatabase } from "pg-promise";
import { ProgramOutcomeEntity } from "./ProgramEntity";
import { Program } from "../domain/Program";

const pgp = pgPromise();

export class PostgresDataClient implements DataClient {
  db: IDatabase<any>;

  constructor(connection: any) {
    this.db = pgp(connection);
  }

  findAllPrograms(): Promise<Program[]> {
    const sqlSelect =
      "SELECT programs.id, programs.officialname, programs.totalcost, outcomes_cip.PerEmployed2 " +
      "FROM programs " +
      "LEFT OUTER JOIN outcomes_cip " +
      "ON outcomes_cip.cipcode = programs.cipcode " +
      "AND outcomes_cip.providerid = programs.providerid;";

    return this.dbQueryForProgramOutcomeEntities(sqlSelect);
  }

  searchPrograms(searchQuery: string): Promise<Program[]> {
    const sqlSearch =
      "SELECT programs.id, programs.officialname, programs.totalcost, outcomes_cip.PerEmployed2 " +
      "FROM programs " +
      "LEFT OUTER JOIN outcomes_cip " +
      "ON outcomes_cip.cipcode = programs.cipcode " +
      "AND outcomes_cip.providerid = programs.providerid " +
      `WHERE LOWER(officialname) LIKE LOWER('%${searchQuery}%') ` +
      `OR LOWER(description) LIKE LOWER('%${searchQuery}%');`;

    return this.dbQueryForProgramOutcomeEntities(sqlSearch);
  }

  private dbQueryForProgramOutcomeEntities = (sql: string): Promise<Program[]> => {
    return this.db
      .any(sql)
      .then((data: ProgramOutcomeEntity[]) => {
        return data.map(this.mapProgramOutcomeEntityToProgram);
      })
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  private mapProgramOutcomeEntityToProgram = (entity: ProgramOutcomeEntity): Program => {
    return {
      id: entity.id,
      name: entity.officialname,
      totalCost: parseFloat(entity.totalcost),
      percentEmployed: this.formatPercentEmployed(entity.peremployed2),
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
