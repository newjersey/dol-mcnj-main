"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripUnicode = void 0;
const stripUnicode = (text) => {
    if (text) {
        return text.replace(/[\u00BF]/g, "").replace(/[\u221A][\u00A9]/g, "e");
    }
    else {
        return text;
    }
};
exports.stripUnicode = stripUnicode;
