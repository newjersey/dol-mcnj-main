"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighlight = getHighlight;
const tslib_1 = require("tslib");
function getHighlight(inputString, query) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const words = inputString.split(' ');
        const queryIndex = words.findIndex(word => word.includes(query));
        if (queryIndex === -1) {
            return words.slice(0, 19).join(' ');
        }
        const startIndex = Math.max(queryIndex - 10, 0);
        const endIndex = Math.min(queryIndex + 11, words.length);
        return words.slice(startIndex, endIndex).join(' ');
    });
}
