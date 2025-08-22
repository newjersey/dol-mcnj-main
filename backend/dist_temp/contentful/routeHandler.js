"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeHandler = void 0;
const tslib_1 = require("tslib");
const useClient_1 = require("./useClient");
const routeHandler = (query) => (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const variables = Object.assign(Object.assign({}, req.params), req.query);
    Object.keys(variables).forEach((key) => {
        const value = variables[key];
        if (typeof value === "string" && (value.startsWith('{') || value.startsWith('['))) {
            try {
                variables[key] = JSON.parse(variables[key]);
            }
            catch (error) {
                console.error(error);
            }
        }
    });
    try {
        const result = yield (0, useClient_1.useClient)({ query, variables });
        res.send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing your Contentful request.");
    }
});
exports.routeHandler = routeHandler;
