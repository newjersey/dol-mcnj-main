"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPhoneNumber = void 0;
const isValidPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || typeof phoneNumber !== "string") {
        console.error("Invalid input: phone number must be a string.");
        return false;
    }
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    if (cleanedNumber.length !== 10) {
        console.error("Invalid phone number: must be exactly 10 digits.");
        return false;
    }
    return true;
};
exports.isValidPhoneNumber = isValidPhoneNumber;
