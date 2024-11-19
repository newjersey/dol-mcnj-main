"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToTitleCaseIfUppercase = void 0;
const convertToTitleCaseIfUppercase = (text) => {
    if (text === null) {
        return "";
    }
    if (text !== text.toUpperCase()) {
        return text;
    }
    return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
exports.convertToTitleCaseIfUppercase = convertToTitleCaseIfUppercase;
