/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DataClient, ProgramId } from "../domain/DataClient";
import pgPromise, { IDatabase, ParameterizedQuery } from "pg-promise";
import { JoinedEntity, SearchedEntity } from "./ProgramEntity";
import { Program, Status } from "../domain/Program";

const pgp = pgPromise();

export class PostgresDataClient implements DataClient {
  db: IDatabase<any>;

  constructor(connection: any) {
    this.db = pgp(connection);
  }

  joinStatement =
    "SELECT programs.id, programs.providerid, programs.officialname, programs.totalcost, " +
    "outcomes_cip.PerEmployed2, providers.city, programs.statusname, providers.statusname AS providerstatus " +
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

  findProgramsByIds = (ids: string[]): Promise<Program[]> => {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    const values = ids.map((id) => "'" + id + "'").join(",");
    const sqlSearch = this.joinStatement + `WHERE programs.id IN (${values});`;

    return this.dbQueryForProgramOutcomeEntities(sqlSearch);
  };

  search = (searchQuery: string): Promise<ProgramId[]> => {
    const sql = "select id from programtokens " + "where tokens @@ websearch_to_tsquery($1);";

    const paramaterizedQuery = new ParameterizedQuery({ text: sql, values: [searchQuery] });
    return this.db
      .any(paramaterizedQuery)
      .then((data: SearchedEntity[]) => {
        return data.map((entity) => entity.id);
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
      status: this.mapStatus(entity.statusname),
      provider: {
        id: entity.providerid,
        city: entity.city,
        status: this.mapStatus(entity.providerstatus),
      },
    };
  };

  private mapStatus = (status: string): Status => {
    switch (status) {
      case "Approved":
        return Status.APPROVED;
      case "Pending":
        return Status.PENDING;
      case "Suspend":
        return Status.SUSPENDED;
      default:
        return Status.UNKNOWN;
    }
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
