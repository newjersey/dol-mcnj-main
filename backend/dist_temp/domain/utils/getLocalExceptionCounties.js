"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalExceptionCounties = getLocalExceptionCounties;
const tslib_1 = require("tslib");
const convertToTitleCaseIfUppercase_1 = require("./convertToTitleCaseIfUppercase");
function getLocalExceptionCounties(dataClient, cipCode) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const localExceptions = yield dataClient.getLocalExceptionsByCip();
        return localExceptions
            .filter((localException) => localException.cipcode === cipCode)
            .map((localException) => (0, convertToTitleCaseIfUppercase_1.convertToTitleCaseIfUppercase)(localException.county));
    });
}
