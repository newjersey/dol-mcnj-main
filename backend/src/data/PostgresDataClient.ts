/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DataClient } from "../domain/DataClient";
import { IDatabase } from "pg-promise";
import { ProgramEntity } from "./ProgramEntity";
import pgPromise from "pg-promise";

const pgp = pgPromise();

export class PostgresDataClient implements DataClient {
  db: IDatabase<any>;

  constructor(connection: any) {
    this.db = pgp(connection);
  }

  findAllPrograms(): Promise<string[]> {
    return this.db
      .any("SELECT officialname FROM programs")
      .then((data: ProgramEntity[]) => {
        return data.map((it) => it.officialname);
      })
      .catch(() => {
        return Promise.reject();
      });
  }

  disconnect() {
    pgp.end();
  }
}
