import knex from "knex";
import { type Knex } from "knex";
import { CareerTrackEntity, HeadlineEntity, SearchEntity } from "./Entities";
import { SearchClient, SearchResult } from "../../domain/search/SearchClient";
import { isCipCodeQuery, normalizeCipCode } from "../../domain/search/cipCodeUtils";
import { createSafeLogger } from "../../utils/piiSafety";

const logger = createSafeLogger(console.log);

export class PostgresSearchClient implements SearchClient {
  kdb: Knex;

  constructor(connection: Knex.PgConnectionConfig) {
    this.kdb = knex({
      client: "pg",
      connection: connection,
    });
  }

  search = (searchQuery: string): Promise<SearchResult[]> => {
    logger.info("Executing search for training programs", { queryLength: searchQuery.length });

    // Check if the search query is a CIP code
    if (isCipCodeQuery(searchQuery)) {
      return this.searchByCipCode(searchQuery);
    }

    // Otherwise, use full-text search
    return this.searchByFullText(searchQuery);
  };

  private searchByCipCode = (searchQuery: string): Promise<SearchResult[]> => {
    const normalizedCipCode = normalizeCipCode(searchQuery);
    logger.info("Searching by CIP code", { normalizedCipCode });

    return this.kdb("etpl")
      .select("programid")
      .where("cipcode", normalizedCipCode)
      .then((data: { programid: string }[]) => {
        logger.info("CIP code search completed", { 
          normalizedCipCode, 
          resultCount: data.length 
        });

        const results = data.map((entity, index) => ({
          id: entity.programid,
          rank: data.length - index, // Higher rank for earlier results
        }));

        return results;
      })
      .catch((e) => {
        logger.error("Error during CIP code search operation", e, { normalizedCipCode });
        return Promise.reject(new Error("SEARCH_FAILURE"));
      });
  };

  private searchByFullText = (searchQuery: string): Promise<SearchResult[]> => {
    return this.kdb("programtokens")
      .select(
        "programid",
        this.kdb.raw("ts_rank_cd(tokens, websearch_to_tsquery(?), 1) AS rank", [searchQuery]),
      )
      .whereRaw("tokens @@ websearch_to_tsquery(?)", searchQuery)
      .orderBy("rank", "desc")
      .then((data: SearchEntity[]) => {
        logger.info("Full-text search completed", { 
          queryLength: searchQuery.length,
          resultCount: data.length 
        });

        if (data.length === 0) {
          logger.info("No results found for search query");
        }

        const results = data.map((entity) => {
          const rank = entity.rank || 0;
          if (rank === 0) {
            logger.info("Search result has rank of 0", { programId: entity.programid });
          }
          return {
            id: entity.programid,
            rank: rank,
          };
        });

        return results;
      })
      .catch((e) => {
        logger.error("Error during full-text search operation", e, { 
          queryLength: searchQuery.length 
        });
        if (e.message === "NOT_FOUND") {
          return Promise.reject(new Error("NOT_FOUND"));
        }
        return Promise.reject(new Error("SEARCH_FAILURE"));
      });
  };

  getHighlight = async (id: string, searchQuery: string): Promise<string> => {
    const careerTracksJoined = await this.kdb("soccipcrosswalk")
      .select("soc2018title")
      .whereRaw("soccipcrosswalk.cipcode = (select cipcode from etpl where programid = ?)", id)
      .then((data: CareerTrackEntity[]) => data.map((it) => it.soc2018title).join(", "))
      .catch((e) => {
        logger.error("Database error in getHighlight career tracks query", e);
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
        logger.error("Database error in getHighlight headline query", e);
        return Promise.reject();
      });
  };

  disconnect = async (): Promise<void> => {
    await this.kdb.destroy();
  };
}
