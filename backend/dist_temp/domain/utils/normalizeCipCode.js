"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCipCode = void 0;
const normalizeCipCode = (cipCode) => {
    cipCode = cipCode.replace(/[^0-9.]/g, '');
    if (/^\d{2}\.\d{4}$/.test(cipCode)) {
        return cipCode;
    }
    cipCode = cipCode.replace('.', '');
    cipCode = cipCode.padStart(6, '0');
    const firstPart = cipCode.slice(0, 2);
    const secondPart = cipCode.slice(2, 6);
    return `${firstPart}.${secondPart}`;
};
exports.normalizeCipCode = normalizeCipCode;
