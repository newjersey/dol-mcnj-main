"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnetClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const Error_1 = require("../domain/Error");
const OnetClient = (baseUrl, auth, convert2010SocTo2018Occupations) => {
    const onetConfig = {
        auth: auth,
        headers: {
            "User-Agent": "nodejs-OnetWebService/1.00 (bot)",
            Accept: "application/json",
        },
        timeout: 10000,
        maxRedirects: 0,
    };
    const getTasks = (soc) => {
        return axios_1.default
            .get(`${baseUrl}/ws/online/occupations/${soc}.00/summary/tasks?display=long`, onetConfig)
            .then((response) => {
            return response.data.task.map((task) => task.name);
        })
            .catch(() => {
            return Promise.resolve([]);
        });
    };
    const getRelatedOccupations = (soc) => {
        return axios_1.default
            .get(`${baseUrl}/ws/online/occupations/${soc}.00/details/related_occupations?display=long`, onetConfig)
            .then((response) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const socs2010 = response.data.occupation
                .filter((occupation) => occupation.code.split(".")[1] === "00")
                .map((occupation) => occupation.code.split(".")[0]);
            const occupations2018Promises = socs2010.map((soc2010) => convert2010SocTo2018Occupations(soc2010));
            const occupations2018Arrays = yield Promise.all(occupations2018Promises);
            return occupations2018Arrays.reduce((prev, cur) => prev.concat(cur), []);
        }))
            .catch(() => {
            return Promise.resolve([]);
        });
    };
    return (soc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        return axios_1.default
            .get(`${baseUrl}/ws/online/occupations/${soc}.00`, onetConfig)
            .then((response) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const formattedCode = response.data.code.split(".")[0];
            return {
                soc: formattedCode,
                title: response.data.title,
                description: response.data.description,
                tasks: yield getTasks(soc),
                relatedOccupations: yield getRelatedOccupations(soc),
            };
        }))
            .catch(() => {
            return Promise.reject(Error_1.Error.SYSTEM_ERROR);
        });
    });
};
exports.OnetClient = OnetClient;
