"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripSurroundingQuotes = void 0;
const stripSurroundingQuotes = (text) => {
    return text.replace(/^"+|"+$/g, "");
};
exports.stripSurroundingQuotes = stripSurroundingQuotes;
