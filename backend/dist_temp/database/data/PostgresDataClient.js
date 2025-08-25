"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDataClient = void 0;
const tslib_1 = require("tslib");
const knex_1 = tslib_1.__importDefault(require("knex"));
class PostgresDataClient {
    constructor(connection) {
        this.getLocalExceptionsByCip = () => {
            return this.kdb("localexceptioncips")
                .distinctOn(["cipcode", "county"])
                .select("cipcode", "county")
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.getLocalExceptionsBySoc = () => {
            return this.kdb
                .select("localexceptioncips.soc", "localexceptioncips.county", "localexceptioncips.occupation as title")
                .from("localexceptioncips")
                .leftJoin("indemandsocs", "localexceptioncips.soc", "indemandsocs.soc")
                .leftJoin("soc2010to2018crosswalk", "localexceptioncips.soc", "soc2010to2018crosswalk.soccode2018")
                .leftJoin("indemandsocs as indemandsocs2010", "soc2010to2018crosswalk.soccode2010", "indemandsocs2010.soc")
                .whereNull("indemandsocs.soc")
                .whereNull("indemandsocs2010.soc")
                .then((result) => {
                return result;
            })
                .catch((e) => {
                console.log("DB error:", e);
                return Promise.reject();
            });
        };
        this.findLocalExceptionsBySoc = (soc) => {
            return this.kdb("localexceptioncips")
                .select("soc", "county", "occupation as title")
                .where("soc", soc)
                .distinctOn("soc")
                .then((result) => {
                return result;
            })
                .catch((e) => {
                console.log("DB error:", e);
                return Promise.reject();
            });
        };
        this.findOccupationsByCip = (cip) => {
            return this.kdb("soccipcrosswalk")
                .select("soc2018code as soc", "soc2018title as title")
                .where("cipcode", cip)
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.findSocDefinitionBySoc = (soc) => {
            return this.kdb("socdefinitions")
                .select("soccode as soc", "soctitle as title", "socdefinition as definition")
                .where("soccode", soc)
                .first()
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.findCipDefinitionBySoc2018 = (soc) => {
            return this.kdb("soccipcrosswalk")
                .select("cipcode", "cip2020title as ciptitle")
                .where("soc2018code", soc)
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.findCipDefinitionByCip = (cip) => {
            return this.kdb("soccipcrosswalk")
                .select("cipcode", "cip2020title as ciptitle")
                .where("cipcode", cip)
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.findOutcomeDefinition = (providerid, cip) => {
            return this.kdb("outcomes_cip")
                .select("peremployed2", "avgquarterlywage2")
                .where("cipcode", cip)
                .where("providerid", providerid)
                .first()
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.find2018OccupationsBySoc2010 = (soc2010) => {
            return this.kdb("soc2010to2018crosswalk")
                .select("soccode2018 as soc", "socdefinitions.soctitle as title")
                .where("soccode2010", soc2010)
                .leftOuterJoin("socdefinitions", "socdefinitions.soccode", "soc2010to2018crosswalk.soccode2018")
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.find2010OccupationsBySoc2018 = (soc2018) => {
            return this.kdb("soc2010to2018crosswalk")
                .select("soccode2010 as soc", "soctitle2010 as title")
                .where("soccode2018", soc2018)
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.getOccupationsInDemand = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.kdb("indemandsocs")
                .select("soc", "socdefinitions.soctitle as title")
                .leftOuterJoin("socdefinitions", "socdefinitions.soccode", "indemandsocs.soc")
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        });
        this.getCIPsInDemand = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.kdb("indemandcips")
                .select("cipcode as cipcode")
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        });
        this.getEducationTextBySoc = (soc) => {
            return this.kdb("blsoccupationhandbook")
                .select("occupation_summary_how_to_become_one as howtobecomeone")
                .where("occupation_soc_coverage_soc_code", soc)
                .first()
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.getSalaryEstimateBySoc = (soc) => {
            return this.kdb("oesestimates")
                .select("a_median as mediansalary")
                .where("occ_code", soc)
                .where("area_title", "New Jersey")
                .first()
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.getOESOccupationBySoc = (soc) => {
            return this.kdb("oeshybridcrosswalk")
                .select("oes2019estimatescode as soc", "oes2019estimatestitle as title")
                .where("soccode2018", soc)
                .first()
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.getNeighboringOccupations = (soc) => {
            const firstFiveDigits = soc.slice(0, 6);
            return this.kdb("socdefinitions")
                .select("soccode as soc", "soctitle as title")
                .where("soccode", "like", `${firstFiveDigits}%`)
                .andWhere("socgroup", "Detailed")
                .andWhereNot("soccode", soc)
                .catch((e) => {
                console.log("db error: ", e);
                return Promise.reject();
            });
        };
        this.disconnect = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.kdb.destroy();
        });
        this.kdb = (0, knex_1.default)({
            client: "pg",
            connection: connection,
        });
    }
}
exports.PostgresDataClient = PostgresDataClient;
