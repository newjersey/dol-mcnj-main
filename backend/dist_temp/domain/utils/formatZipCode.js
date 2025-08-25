"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZip = void 0;
const formatZip = (text) => {
    const formattedText = text.length < 5 ? "0" + text : text;
    return formattedText;
};
exports.formatZip = formatZip;
