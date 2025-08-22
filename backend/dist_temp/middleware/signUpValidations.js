"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignupForm = void 0;
const tslib_1 = require("tslib");
const emailValidator_1 = require("../helpers/emailValidator");
const nameValidator_1 = require("../helpers/nameValidator");
const validateSignupForm = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { email, fname, lname } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }
    const isEmailValid = yield (0, emailValidator_1.isValidEmail)(email);
    if (!isEmailValid) {
        return res.status(400).json({ error: "This email address seems invalid. Please check for typos or try a different one." });
    }
    if (fname && (!(0, nameValidator_1.isValidName)(fname))) {
        return res.status(400).json({ error: "Invalid first name" });
    }
    if (lname && (!(0, nameValidator_1.isValidName)(lname))) {
        return res.status(400).json({ error: "Invalid last name" });
    }
    next();
});
exports.validateSignupForm = validateSignupForm;
