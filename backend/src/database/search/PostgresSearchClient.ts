import knex from "knex";
import { type Knex } from "knex";
import { CareerTrackEntity, HeadlineEntity, SearchEntity } from "./Entities";
import { SearchClient, SearchResult } from "../../domain/search/SearchClient";

export class PostgresSearchClient implements SearchClient {
  kdb: Knex;

  constructor(connection: Knex.PgConnectionConfig) {
    this.kdb = knex({
      client: "pg",
      connection: connection,
    });
  }

  search = (searchQuery: string): Promise<SearchResult[]> => {
    return this.kdb("programtokens")
      .select(
        "programid",
        this.kdb.raw("ts_rank_cd(tokens, websearch_to_tsquery(?), 1) AS rank", [searchQuery])
      )
      .whereRaw("tokens @@ websearch_to_tsquery(?)", searchQuery)
      .orderBy("rank", "desc")
      .then((data: SearchEntity[]) =>
        data.map((entity) => ({
          id: entity.programid,
          rank: entity.rank,
        }))
      )
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  disconnect = async (): Promise<void> => {
    await this.kdb.destroy();
  };
}
