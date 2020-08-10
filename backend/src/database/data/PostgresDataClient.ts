import {DataClient} from "../../domain/DataClient";
import {CalendarLength, Status, Training, TrainingResult} from "../../domain/Training";
import {CountyEntity, IdCountyEntity, IdEntity, JoinedEntity, OccupationEntity, ProgramEntity,} from "./Entities";
import knex from "knex";
import Knex, {PgConnectionConfig} from "knex";
import {Error} from "../../domain/Error";

export class PostgresDataClient implements DataClient {
  kdb: Knex;

  constructor(connection: PgConnectionConfig) {
    this.kdb = knex({
      client: "pg",
      connection: connection,
    });
  }

  findAllTrainingResults = async (): Promise<TrainingResult[]> => {
    return this.findTrainingResultsByIds(
      await this.kdb("programs")
        .select("id")
        .then((data: IdEntity[]) => data.map((it) => it.id.toString()))
    );
  };

  findTrainingResultsByIds = async (ids: string[]): Promise<TrainingResult[]> => {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    const joinedEntities: JoinedEntity[] = await this.kdb("programs")
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
        "indemandcips.cipcode as indemandcip",
        "onlineprograms.programid as onlineprogram"
      )
      .joinRaw(`join unnest('{${ids.join(",")}}'::int[]) WITH ORDINALITY t(id, ord) USING (id)`)
      .leftOuterJoin("outcomes_cip", function () {
        this
          .on("outcomes_cip.cipcode", "programs.cipcode")
          .on("outcomes_cip.providerid", "programs.providerid"
          );
      })
      .leftOuterJoin("providers", "providers.providerid", "programs.providerid")
      .leftOuterJoin("indemandcips", "indemandcips.cipcode", "programs.cipcode")
      .leftOuterJoin("onlineprograms", "onlineprograms.programid", "programs.programid")
      .whereIn("programs.id", ids)
      .orderByRaw("t.ord");

    const localExceptionCounties: IdCountyEntity[] = await this.kdb("programs")
      .select("id", "county")
      .innerJoin("localexceptioncips", "localexceptioncips.cipcode", "programs.cipcode")
      .whereIn("id", ids);

    const localExceptionCountiesLookup = localExceptionCounties.reduce(
      (result: Record<string, string[]>, item: IdCountyEntity) => ({
        ...result,
        [item.id]: [...(result[item.id] || []), item.county],
      }),
      {}
    );

    return Promise.resolve(
      joinedEntities.map((entity) => ({
        id: entity.id.toString(),
        name: entity.officialname,
        totalCost: parseFloat(entity.totalcost),
        percentEmployed: this.formatPercentEmployed(entity.peremployed2),
        status: this.mapStatus(entity.statusname),
        calendarLength:
          entity.calendarlengthid !== null
            ? parseInt(entity.calendarlengthid)
            : CalendarLength.NULL,
        inDemand: entity.indemandcip !== null,
        provider: {
          id: entity.providerid,
          city: entity.city,
          name: entity.providername ? entity.providername : "",
          status: this.mapStatus(entity.providerstatus),
        },
        highlight: "",
        localExceptionCounty: localExceptionCountiesLookup[entity.id] || [],
        online: !!entity.onlineprogram,
      }))
    );
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
        "programs.totalcost",
        "providers.website",
        "providers.name as providername",
        "providers.street1",
        "providers.street2",
        "providers.city",
        "providers.state",
        "providers.zip",
        "indemandcips.cipcode as indemandcip",
        "onlineprograms.programid as onlineprogram",
        "outcomes_cip.peremployed2",
      )
      .leftOuterJoin("providers", "providers.providerid", "programs.providerid")
      .leftOuterJoin("indemandcips", "indemandcips.cipcode", "programs.cipcode")
      .leftOuterJoin("onlineprograms", "onlineprograms.programid", "programs.programid")
      .leftOuterJoin("outcomes_cip", function () {
        this
          .on("outcomes_cip.cipcode", "programs.cipcode")
          .on("outcomes_cip.providerid", "programs.providerid"
        );
      })
      .where("programs.id", id)
      .first()
      .catch(() => undefined)

    if (!programEntity) {
      return Promise.reject(Error.NOT_FOUND)
    }

    const matchingOccupations: OccupationEntity[] = await this.kdb("soccipcrosswalk")
      .select("soc2018title")
      .where("cipcode", programEntity.cipcode);

    const localExceptionCounties: CountyEntity[] = await this.kdb("localexceptioncips")
      .select("county")
      .where("cipcode", programEntity.cipcode);

    return Promise.resolve({
      id: programEntity.id.toString(),
      name: programEntity.officialname,
      description: programEntity.description,
      calendarLength:
        programEntity.calendarlengthid !== null
          ? parseInt(programEntity.calendarlengthid)
          : CalendarLength.NULL,
      occupations: matchingOccupations.map((it) => it.soc2018title),
      inDemand: programEntity.indemandcip !== null,
      localExceptionCounty: localExceptionCounties.map((it) => it.county),
      totalCost: parseFloat(programEntity.totalcost),
      online: !!programEntity.onlineprogram,
      percentEmployed: this.formatPercentEmployed(programEntity.peremployed2),
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

  disconnect = async (): Promise<void> => {
    await this.kdb.destroy();
  }
}
