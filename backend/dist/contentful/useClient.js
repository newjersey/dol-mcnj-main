"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClient = void 0;
const tslib_1 = require("tslib");
const client_1 = require("./client");
const secretManager_1 = require("../utils/secretManager");
const node_cache_1 = tslib_1.__importDefault(require("node-cache"));
const apiKeyCache = new node_cache_1.default();
const REFRESH_INTERVAL = 3600;
const getApiKey = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let apiKey = apiKeyCache.get('CACHE_KEY');
    if (!apiKey) {
        console.log('Cache missing, fetching from AWS Secrets Manager');
        apiKey = yield (0, secretManager_1.getContentfulAccessToken)();
        apiKeyCache.set('CACHE_KEY', apiKey, REFRESH_INTERVAL);
    }
    return apiKey;
});
const useClient = (_a) => tslib_1.__awaiter(void 0, [_a], void 0, function* ({ query, variables }) {
    try {
        const accessToken = yield getApiKey();
        const result = yield (0, client_1.contentfulClient)({ query, accessToken, variables });
        return result;
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return { errors: [{ message: error.message }] };
        }
        return { errors: [{ message: 'An error occurred' }] };
    }
});
exports.useClient = useClient;
