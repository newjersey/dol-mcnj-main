"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEducationTextFactory = void 0;
const tslib_1 = require("tslib");
const getEducationTextFactory = (dataClient) => {
    return (soc) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        try {
            const oesCode = (yield dataClient.getOESOccupationBySoc(soc)).soc;
            const dirtyText = yield dataClient.getEducationTextBySoc(oesCode);
            return dirtyText.howtobecomeone.split("<p>")[1].split("</p>")[0];
        }
        catch (_a) {
            return "";
        }
    });
};
exports.getEducationTextFactory = getEducationTextFactory;
