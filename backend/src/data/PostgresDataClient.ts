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
      "SELECT programs.officialname, programs.totalcost, outcomes_cip.PerEmployed2 " +
      "FROM programs " +
      "LEFT OUTER JOIN outcomes_cip " +
      "ON outcomes_cip.cipcode = programs.cipcode AND outcomes_cip.providerid = programs.providerid;";

    return this.db
      .any(sqlSelect)
      .then((data: ProgramOutcomeEntity[]) => {
        return data.map((it) => {
          return {
            name: it.officialname,
            totalCost: parseFloat(it.totalcost),
            percentEmployed: this.formatPercentEmployed(it.peremployed2),
          };
        });
      })
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  }

  private formatPercentEmployed(peremployed: string): number | null {
    const NAN_INDICATOR = "-99999";
    if (peremployed === null || peremployed === NAN_INDICATOR) {
      return null;
    }

    return parseFloat(peremployed);
  }

  disconnect() {
    pgp.end();
  }
}
