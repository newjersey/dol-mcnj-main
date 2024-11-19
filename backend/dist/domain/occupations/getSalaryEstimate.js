"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalaryEstimateFactory = void 0;
const tslib_1 = require("tslib");
const getSalaryEstimateFactory = (dataClient) => {
    return (soc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const oesCode = (yield dataClient.getOESOccupationBySoc(soc)).soc;
            const dirtyText = yield dataClient.getSalaryEstimateBySoc(oesCode);
            return parseInt(dirtyText.mediansalary.replace(",", ""));
        }
        catch (_a) {
            return null;
        }
    });
};
exports.getSalaryEstimateFactory = getSalaryEstimateFactory;
