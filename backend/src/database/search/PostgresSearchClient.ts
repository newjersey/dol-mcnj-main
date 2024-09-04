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
    console.log(`Executing search for query: "${searchQuery}"`);

    return this.kdb("programtokens")
        .select(
            "programid",
            this.kdb.raw("ts_rank_cd(tokens, websearch_to_tsquery(?), 1) AS rank", [searchQuery]),
        )
        .whereRaw("tokens @@ websearch_to_tsquery(?)", searchQuery)
        .orderBy("rank", "desc")
        .then((data: SearchEntity[]) => {
          console.log(`Raw search results for query "${searchQuery}":`, data);

          if (data.length === 0) {
            console.error(`No results found for query: ${searchQuery}`);
          }

          const results = data.map((entity) => {
            const rank = entity.rank || 0;
            if (rank === 0) {
              console.warn(`Rank is 0 for program ID: ${entity.programid}`);
            }
            return {
              id: entity.programid,
              rank: rank,
            };
          });

          console.log(`Processed search results:`, results);
          return results;
        })
        .catch((e) => {
          console.error(JSON.stringify(e));
          console.error("Error during search operation: ", e);
          if (e.message === 'NOT_FOUND') {
            return Promise.reject(new Error('NOT_FOUND'));
          }
          return Promise.reject(new Error('SEARCH_FAILURE'));
        });
  };

  getHighlight = async (id: string, searchQuery: string): Promise<string> => {
    const careerTracksJoined = await this.kdb("soccipcrosswalk")
      .select("soc2018title")
      .whereRaw("soccipcrosswalk.cipcode = (select cipcode from etpl where programid = ?)", id)
      .then((data: CareerTrackEntity[]) => data.map((it) => it.soc2018title).join(", "))
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });

    const queryJoinedWithOrs = searchQuery.split(" ").join(" or ");

    return this.kdb("etpl")
      .select(
        this.kdb.raw(
          "ts_headline(standardized_description, websearch_to_tsquery(?)," +
            "'MaxFragments=1, MaxWords=20, MinWords=1, StartSel=[[, StopSel=]]') as descheadline",
          [searchQuery],
        ),
        this.kdb.raw(
          "ts_headline(standardized_description, websearch_to_tsquery(?)," +
            "'MaxFragments=1, MaxWords=20, MinWords=1, StartSel=[[, StopSel=]]') as descheadlineors",
          [queryJoinedWithOrs],
        ),
        this.kdb.raw(
          "ts_headline(?, websearch_to_tsquery(?)," +
            "'MaxFragments=1, MaxWords=20, MinWords=1, StartSel=[[, StopSel=]]') as careerheadline",
          [careerTracksJoined, searchQuery],
        ),
        this.kdb.raw(
          "ts_headline(?, websearch_to_tsquery(?)," +
            "'MaxFragments=1, MaxWords=20, MinWords=1, StartSel=[[, StopSel=]]') as careerheadlineors",
          [careerTracksJoined, queryJoinedWithOrs],
        ),
      )
      .where("programid", id)
      .first()
      .then((data: HeadlineEntity) => {
        if (data.descheadline?.includes("[[")) {
          return data.descheadline;
        } else if (data.careerheadline?.includes("[[")) {
          return "Career track: " + data.careerheadline;
        } else if (data.descheadlineors?.includes("[[")) {
          return data.descheadlineors;
        } else if (data.careerheadlineors?.includes("[[")) {
          return "Career track: " + data.careerheadlineors;
        }
        return "";
      })
      .catch((e) => {
        console.log("db error: ", e);
        return Promise.reject();
      });
  };

  disconnect = async (): Promise<void> => {
    await this.kdb.destroy();
  };
}
