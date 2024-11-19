"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripOccupations = void 0;
const stripOccupations = (text) => {
    return text ? text.replace(/ Occupations$/, "") : text;
};
exports.stripOccupations = stripOccupations;
