"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCipCode = exports.isCipCodeQuery = void 0;
const cipPrefixes = ['01', '03', '04', '05', '09', '10', '11', '12', '13', '14', '15', '16', '19', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '60', '61'];
const isCipCodeQuery = (query) => {
    if (!query || typeof query !== 'string') {
        return false;
    }
    const trimmedQuery = query.trim();
    if (/^[0-9]{6}$/.test(trimmedQuery)) {
        const firstTwoDigits = trimmedQuery.slice(0, 2);
        return cipPrefixes.includes(firstTwoDigits);
    }
    if (/^[0-9]{2}\.[0-9]{4}$/.test(trimmedQuery)) {
        const firstTwoDigits = trimmedQuery.slice(0, 2);
        return cipPrefixes.includes(firstTwoDigits);
    }
    return false;
};
exports.isCipCodeQuery = isCipCodeQuery;
const normalizeCipCode = (cipCode) => {
    if (!cipCode || typeof cipCode !== 'string') {
        return cipCode;
    }
    const trimmedCode = cipCode.trim();
    if (/^[0-9]{2}\.[0-9]{4}$/.test(trimmedCode)) {
        return trimmedCode.replace('.', '');
    }
    return trimmedCode;
};
exports.normalizeCipCode = normalizeCipCode;
