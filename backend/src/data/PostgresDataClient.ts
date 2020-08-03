import { DataClient, TrainingId } from "../domain/DataClient";
import { CalendarLength, Status, Training, TrainingResult } from "../domain/Training";
import { JoinedEntity, OccupationEntity, ProgramEntity, IdEntity } from "./Entities";
import knex, { PgConnectionConfig } from "knex";
import Knex from "knex";

export class PostgresDataClient implements DataClient {
  kdb: Knex;

  constructor(connection: PgConnectionConfig) {
    this.kdb = knex({
      client: "pg",
      connection: connection,
    });
  }

  findAllTrainings = async (): Promise<TrainingResult[]> => {
    return this.findTrainingResultsByIds(
      await this.kdb("programs")
        .select("id")
        .then((data: IdEntity[]) => data.map((it) => it.id.toString()))
    );
  };

  findTrainingResultsByIds = (ids: string[]): Promise<TrainingResult[]> => {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    return this.kdb("programs")
      .select(
        "programs.id",
        "programs.providerid",
        "programs.officialname",
        "programs.totalcost",
        "programs.calendarlengthid",
        "programs.statusname",
        "outcomes_cip.peremployed2",
        "providers.city",
        "providers.statusname as providerstatus",
        "providers.name as providername",
        "indemandcips.cipcode as indemandcip"
      )
      .joinRaw(`join unnest('{${ids.join(",")}}'::int[]) WITH ORDINALITY t(id, ord) USING (id)`)
      .leftOuterJoin("outcomes_cip", function () {
        this.on("outcomes_cip.cipcode", "programs.cipcode").on(
          "outcomes_cip.providerid",
          "programs.providerid"
        );
      })
      .leftOuterJoin("providers", "providers.providerid", "programs.providerid")
      .leftOuterJoin("indemandcips", "indemandcips.cipcode", "programs.cipcode")
      .whereIn("programs.id", ids)
      .orderByRaw("t.ord")
      .then((data: JoinedEntity[]) => {
        return data.map(this.mapJoinedEntityToTrainingResult);
      })
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  findTrainingById = async (id: string): Promise<Training> => {
    const programEntity: ProgramEntity = await this.kdb("programs")
      .select(
        "programs.id",
        "programs.providerid",
        "programs.officialname",
        "programs.calendarlengthid",
        "programs.description",
        "programs.cipcode",
        "providers.website",
        "providers.name as providername",
        "providers.street1",
        "providers.street2",
        "providers.city",
        "providers.state",
        "providers.zip",
        "indemandcips.cipcode as indemandcip"
      )
      .leftOuterJoin("providers", "providers.providerid", "programs.providerid")
      .leftOuterJoin("indemandcips", "indemandcips.cipcode", "programs.cipcode")
      .where("programs.id", id)
      .first();

    const matchingOccupations: OccupationEntity[] = await this.kdb("soccipcrosswalk")
      .select("soc2018title")
      .where("cipcode", programEntity.cipcode);

    return Promise.resolve({
      id: programEntity.id,
      name: programEntity.officialname,
      description: programEntity.description,
      calendarLength:
        programEntity.calendarlengthid !== null
          ? parseInt(programEntity.calendarlengthid)
          : CalendarLength.NULL,
      occupations: matchingOccupations.map((it) => it.soc2018title),
      inDemand: programEntity.indemandcip !== null,
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
    return this.kdb("programtokens")
      .select(
        "id",
        this.kdb.raw("ts_rank_cd(tokens, websearch_to_tsquery(?), 1) AS rank", [searchQuery])
      )
      .whereRaw("tokens @@ websearch_to_tsquery(?)", searchQuery)
      .orderBy("rank", "desc")
      .then((data: IdEntity[]) => data.map((entity) => entity.id.toString()))
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
      inDemand: entity.indemandcip !== null,
      provider: {
        id: entity.providerid,
        city: entity.city,
        name: entity.providername ? entity.providername : "",
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

  disconnect(): void {
    this.kdb.destroy();
  }
}
