"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerOneStopClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const CareerOneStopClient = (baseUrl, userId, authToken) => {
    return (soc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return axios_1.default
            .get(`${baseUrl}/v1/jobsearch/${userId}/${soc}/NJ/1000/0/0/0/10/0?source=NLx&showFilters=false`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => {
            return parseInt(response.data.Jobcount);
        })
            .catch(() => {
            return null;
        });
    });
};
exports.CareerOneStopClient = CareerOneStopClient;
