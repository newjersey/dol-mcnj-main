"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresSearchClient = void 0;
const tslib_1 = require("tslib");
const knex_1 = tslib_1.__importDefault(require("knex"));
class PostgresSearchClient {
    constructor(connection) {
        this.search = (searchQuery) => {
            console.log(`Executing search for query: "${searchQuery}"`);
            return this.kdb("programtokens")
                .select("programid", this.kdb.raw("ts_rank_cd(tokens, websearch_to_tsquery(?), 1) AS rank", [searchQuery]))
                .whereRaw("tokens @@ websearch_to_tsquery(?)", searchQuery)
                .orderBy("rank", "desc")
                .then((data) => {
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
                console.error("Error during search operation: ", e);
                if (e.message === 'NOT_FOUND') {
                    return Promise.reject(new Error('NOT_FOUND'));
                }
                return Promise.reject(new Error('SEARCH_FAILURE'));
            });
        };
        this.getHighlight = (id, searchQuery) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const careerTracksJoined = yield this.kdb("soccipcrosswalk")
                .select("soc2018title")
                .whereRaw("soccipcrosswalk.cipcode = (select cipcode from etpl where programid = ?)", id)
                .then((data) => data.map((it) => it.soc2018title).join(", "))
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
            const queryJoinedWithOrs = searchQuery.split(" ").join(" or ");
            return this.kdb("etpl")
                .select(this.kdb.raw("ts_headline(standardized_description, websearch_to_tsquery(?)," +
                "'MaxFragments=1, MaxWords=20, MinWords=1, StartSel=[[, StopSel=]]') as descheadline", [searchQuery]), this.kdb.raw("ts_headline(standardized_description, websearch_to_tsquery(?)," +
                "'MaxFragments=1, MaxWords=20, MinWords=1, StartSel=[[, StopSel=]]') as descheadlineors", [queryJoinedWithOrs]), this.kdb.raw("ts_headline(?, websearch_to_tsquery(?)," +
                "'MaxFragments=1, MaxWords=20, MinWords=1, StartSel=[[, StopSel=]]') as careerheadline", [careerTracksJoined, searchQuery]), this.kdb.raw("ts_headline(?, websearch_to_tsquery(?)," +
                "'MaxFragments=1, MaxWords=20, MinWords=1, StartSel=[[, StopSel=]]') as careerheadlineors", [careerTracksJoined, queryJoinedWithOrs]))
                .where("programid", id)
                .first()
                .then((data) => {
                var _a, _b, _c, _d;
                if ((_a = data.descheadline) === null || _a === void 0 ? void 0 : _a.includes("[[")) {
                    return data.descheadline;
                }
                else if ((_b = data.careerheadline) === null || _b === void 0 ? void 0 : _b.includes("[[")) {
                    return "Career track: " + data.careerheadline;
                }
                else if ((_c = data.descheadlineors) === null || _c === void 0 ? void 0 : _c.includes("[[")) {
                    return data.descheadlineors;
                }
                else if ((_d = data.careerheadlineors) === null || _d === void 0 ? void 0 : _d.includes("[[")) {
                    return "Career track: " + data.careerheadlineors;
                }
                return "";
            })
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        });
        this.disconnect = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.kdb.destroy();
        });
        this.kdb = (0, knex_1.default)({
            client: "pg",
            connection: connection,
        });
    }
}
exports.PostgresSearchClient = PostgresSearchClient;
