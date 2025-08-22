"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentfulClient = void 0;
const tslib_1 = require("tslib");
const graphql_request_1 = require("graphql-request");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const contentfulClient = ({ query, variables, includeDrafts, excludeInvalid, accessToken }) => {
    const headers = {
        authorization: `Bearer ${accessToken}`,
    };
    if (includeDrafts) {
        headers["X-Include-Drafts"] = "true";
    }
    if (excludeInvalid) {
        headers["X-Exclude-Invalid"] = "true";
    }
    const environment = process.env.ENVIRONMENT || "master";
    const client = new graphql_request_1.GraphQLClient(`https://${process.env.BASE_URL}/${process.env.SPACE_ID}/environments/${environment}`, {
        headers,
    });
    return client.request(query, variables);
};
exports.contentfulClient = contentfulClient;
