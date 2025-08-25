"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSocCode = void 0;
const normalizeSocCode = (socCode) => {
    socCode = socCode.replace(/[^0-9-]/g, '');
    if (/^\d{2}-\d{4}$/.test(socCode)) {
        return socCode;
    }
    socCode = socCode.replace('-', '');
    socCode = socCode.padStart(6, '0');
    const firstPart = socCode.slice(0, 2);
    const secondPart = socCode.slice(2, 6);
    return `${firstPart}-${secondPart}`;
};
exports.normalizeSocCode = normalizeSocCode;
