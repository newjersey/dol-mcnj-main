"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidName = void 0;
const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s'-]{1,50}$/;
    return typeof name === "string" && nameRegex.test(name);
};
exports.isValidName = isValidName;
