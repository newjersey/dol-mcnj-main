/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DataClient, TrainingId } from "../domain/DataClient";
import pgPromise, { IDatabase, ParameterizedQuery } from "pg-promise";
import { CalendarLength, Status, Training, TrainingResult } from "../domain/Training";
import { JoinedEntity, OccupationEntity, ProgramEntity, SearchedEntity } from "./Entities";

const pgp = pgPromise();

export class PostgresDataClient implements DataClient {
  db: IDatabase<any>;

  constructor(connection: any) {
    this.db = pgp(connection);
  }

  joinStatement =
    "SELECT programs.id, programs.providerid, programs.officialname, programs.totalcost, programs.calendarlengthid, " +
    "outcomes_cip.PerEmployed2, programs.statusname, " +
    "providers.city, providers.statusname AS providerstatus, providers.name AS providername " +
    "FROM programs " +
    "LEFT OUTER JOIN outcomes_cip " +
    "ON outcomes_cip.cipcode = programs.cipcode " +
    "AND outcomes_cip.providerid = programs.providerid " +
    "LEFT OUTER JOIN providers " +
    "ON providers.providerid = programs.providerid ";

  findAllTrainings = (): Promise<TrainingResult[]> => {
    const sqlSelect = this.joinStatement + ";";

    return this.dbQueryForJoinedEntities(sqlSelect);
  };

  findTrainingsByIds = (ids: string[]): Promise<TrainingResult[]> => {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    const values = ids.map((id) => "'" + id + "'").join(",");
    const sqlSearch = this.joinStatement + `WHERE programs.id IN (${values});`;

    return this.dbQueryForJoinedEntities(sqlSearch);
  };

  findTrainingById = async (id: string): Promise<Training> => {
    const sql =
      "SELECT programs.id, programs.providerid, programs.officialname, programs.calendarlengthid, programs.description, " +
      "programs.cipcode, providers.website, providers.name AS providername, " +
      "providers.street1, providers.street2, providers.city, providers.state, providers.zip " +
      "FROM programs " +
      "LEFT OUTER JOIN providers " +
      "ON providers.providerid = programs.providerid " +
      "WHERE programs.id = $1;";

    const parameterizedQuery = new ParameterizedQuery({ text: sql, values: [id] });
    const programEntity: ProgramEntity = await this.db.one(parameterizedQuery);

    const selectOccupations = "SELECT soc2018title from soccipcrosswalk where cipcode = $1;";

    const parameterizedSelectOccupations = new ParameterizedQuery({
      text: selectOccupations,
      values: [programEntity.cipcode],
    });

    const matchingOccipations: OccupationEntity[] = await this.db.any(
      parameterizedSelectOccupations
    );

    return Promise.resolve({
      id: programEntity.id,
      name: programEntity.officialname,
      description: programEntity.description,
      calendarLength:
        programEntity.calendarlengthid !== null
          ? parseInt(programEntity.calendarlengthid)
          : CalendarLength.NULL,
      occupations: matchingOccipations.map((it) => it.soc2018title),
      provider: {
        id: programEntity.providerid,
        url: programEntity.website ? programEntity.website : "",
        address: {
          street1: programEntity.street1,
          street2: programEntity.street2 ? programEntity.street2 : "",
          city: programEntity.city,
          state: programEntity.state,
          zipCode: programEntity.zip,
        },
      },
    });
  };

  search = (searchQuery: string): Promise<TrainingId[]> => {
    const sql = "select id from programtokens " + "where tokens @@ websearch_to_tsquery($1);";

    const parameterizedQuery = new ParameterizedQuery({ text: sql, values: [searchQuery] });
    return this.db
      .any(parameterizedQuery)
      .then((data: SearchedEntity[]) => {
        return data.map((entity) => entity.id);
      })
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  private dbQueryForJoinedEntities = (
    sql: string,
    values?: string[]
  ): Promise<TrainingResult[]> => {
    const parameterizedQuery = new ParameterizedQuery({ text: sql, values: values });
    return this.db
      .any(parameterizedQuery)
      .then((data: JoinedEntity[]) => {
        return data.map(this.mapJoinedEntityToTrainingResult);
      })
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  private mapJoinedEntityToTrainingResult = (entity: JoinedEntity): TrainingResult => {
    return {
      id: entity.id,
      name: entity.officialname,
      totalCost: parseFloat(entity.totalcost),
      percentEmployed: this.formatPercentEmployed(entity.peremployed2),
      status: this.mapStatus(entity.statusname),
      calendarLength:
        entity.calendarlengthid !== null ? parseInt(entity.calendarlengthid) : CalendarLength.NULL,
      provider: {
        id: entity.providerid,
        city: entity.city,
        name: entity.providername,
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
