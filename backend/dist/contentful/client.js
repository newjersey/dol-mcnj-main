"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentfulClient = void 0;
const graphql_request_1 = require("graphql-request");
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
    const client = new graphql_request_1.GraphQLClient(`https://${process.env.BASE_URL}/${process.env.SPACE_ID}`, {
        headers,
    });
    return client.request(query, variables);
};
exports.contentfulClient = contentfulClient;
