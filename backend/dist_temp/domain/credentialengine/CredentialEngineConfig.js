"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
exports.api = axios_1.default.create({
    withCredentials: false,
    baseURL: `https://${process.env.CE_ENVIRONMENT}.credentialengine.org`,
    responseType: "json",
    headers: {
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type, Authorization",
        Authorization: `Bearer ${process.env.CE_AUTH_TOKEN}`,
        "Content-type": "application/json",
    },
});
const errorHandler = (error) => {
    var _a;
    const statusCode = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
    if (statusCode && statusCode !== 401) {
        console.error(error);
    }
    return Promise.reject(error);
};
exports.api.interceptors.response.use(undefined, (error) => {
    return errorHandler(error);
});
