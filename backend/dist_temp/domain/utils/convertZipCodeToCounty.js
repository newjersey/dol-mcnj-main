"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertZipCodeToCounty = void 0;
const tslib_1 = require("tslib");
const zip_county_json_1 = tslib_1.__importDefault(require("./zip-county.json"));
const convertZipCodeToCounty = (zip) => {
    if (!zip) {
        console.info("no zip found");
        return "";
    }
    const county = zip_county_json_1.default.byZip[zip];
    if (!county) {
        return "";
    }
    return county;
};
exports.convertZipCodeToCounty = convertZipCodeToCounty;
