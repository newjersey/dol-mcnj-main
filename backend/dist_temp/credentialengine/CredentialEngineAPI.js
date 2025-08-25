"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentialEngineAPI = void 0;
const tslib_1 = require("tslib");
const CredentialEngineConfig_1 = require("./CredentialEngineConfig");
const CredentialEngineConfig_2 = require("./CredentialEngineConfig");
const searchGateway = `/assistant/search/ctdl`;
const graphGateway = `/graph`;
const resourcesGateway = `/resources`;
const DEFAULT_TAKE = 10;
exports.credentialEngineAPI = {
    getResults: function (query_1, skip_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (query, skip, take = DEFAULT_TAKE) {
            const response = yield CredentialEngineConfig_1.searchAPI.request({
                url: `${searchGateway}`,
                method: "post",
                data: {
                    Query: query,
                    Skip: skip,
                    Take: take,
                    Sort: "^search:relevance"
                },
            });
            return response;
        });
    },
    getGraphByCTID: function (ctid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield (0, CredentialEngineConfig_2.getRecordAPI)({
                url: `${graphGateway}/${ctid}`,
                method: "get",
            });
            return response.data;
        });
    },
    getResourceByCTID: function (ctid) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield (0, CredentialEngineConfig_2.getRecordAPI)({
                url: `${resourcesGateway}/${ctid}`,
                method: "get",
            });
            return response.data;
        });
    },
    getEnvelopeByCTID: (ctid) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const url = `/ce-registry/envelopes/${ctid}`;
        const response = yield CredentialEngineConfig_2.getRecordAPI.get(url);
        return response.data;
    })
};
