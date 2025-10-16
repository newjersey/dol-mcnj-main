"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignupForm = void 0;
const tslib_1 = require("tslib");
const emailValidator_1 = require("../helpers/emailValidator");
const nameValidator_1 = require("../helpers/nameValidator");
const piiSafety_1 = require("../utils/piiSafety");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const logger = (0, piiSafety_1.createSafeLogger)(console.log);
const validateSignupForm = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const operationId = crypto_1.default.randomUUID();
    const { email, fname, lname } = req.body;
    try {
        if (!email) {
            logger.info("Validation failed: missing email", { operationId });
            return res.status(400).json({ error: "Email is required." });
        }
        if (email.length > 254) {
            logger.info("Validation failed: email too long", { operationId, emailLength: email.length });
            (0, piiSafety_1.auditPIIOperation)('VALIDATION', 'EMAIL', false, 'EMAIL_TOO_LONG', { operationId });
            return res.status(400).json({ error: "Email address exceeds maximum length." });
        }
        const sanitizedEmail = email.trim();
        const isEmailValid = yield (0, emailValidator_1.isValidEmail)(sanitizedEmail);
        if (!isEmailValid) {
            logger.info("Validation failed: invalid email format", { operationId });
            (0, piiSafety_1.auditPIIOperation)('VALIDATION', 'EMAIL', false, 'INVALID_FORMAT', { operationId });
            return res.status(400).json({
                error: "This email address seems invalid. Please check for typos or try a different one.",
            });
        }
        if (fname !== undefined) {
            if (fname.length > 50) {
                logger.info("Validation failed: first name too long", { operationId, fnameLength: fname.length });
                return res.status(400).json({ error: "First name exceeds maximum length." });
            }
            const sanitizedFname = fname.trim();
            if (sanitizedFname && !(0, nameValidator_1.isValidName)(sanitizedFname)) {
                logger.info("Validation failed: invalid first name", { operationId });
                return res.status(400).json({ error: "Invalid first name" });
            }
            req.body.fname = sanitizedFname || null;
        }
        if (lname !== undefined) {
            if (lname.length > 50) {
                logger.info("Validation failed: last name too long", { operationId, lnameLength: lname.length });
                return res.status(400).json({ error: "Last name exceeds maximum length." });
            }
            const sanitizedLname = lname.trim();
            if (sanitizedLname && !(0, nameValidator_1.isValidName)(sanitizedLname)) {
                logger.info("Validation failed: invalid last name", { operationId });
                return res.status(400).json({ error: "Invalid last name" });
            }
            req.body.lname = sanitizedLname || null;
        }
        req.body.email = sanitizedEmail;
        logger.info("Validation successful", {
            operationId,
            hasFirstName: !!req.body.fname,
            hasLastName: !!req.body.lname
        });
        (0, piiSafety_1.auditPIIOperation)('VALIDATION', 'EMAIL', true, undefined, { operationId });
        next();
    }
    catch (error) {
        logger.error("Validation middleware error", error, { operationId });
        (0, piiSafety_1.auditPIIOperation)('VALIDATION', 'EMAIL', false, 'SYSTEM_ERROR', { operationId });
        return res.status(500).json({
            error: "Validation service temporarily unavailable. Please try again later."
        });
    }
});
exports.validateSignupForm = validateSignupForm;
