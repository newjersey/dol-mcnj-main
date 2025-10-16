"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSignupForm = void 0;
const tslib_1 = require("tslib");
const writeSignupEmailsEncrypted_1 = require("../dynamodb/writeSignupEmailsEncrypted");
const piiSafety_1 = require("../utils/piiSafety");
const crypto = tslib_1.__importStar(require("crypto"));
const logger = (0, piiSafety_1.createSafeLogger)(console.log);
const submitSignupForm = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const requestId = crypto.randomUUID();
    try {
        const sanitizedData = (0, piiSafety_1.validateAndSanitizePII)(req.body || {});
        const { firstName, lastName, email } = sanitizedData;
        if (!email) {
            logger.info("Signup attempt failed: missing email", { requestId });
            return res.status(400).json({
                error: "Email address is required."
            });
        }
        yield (0, writeSignupEmailsEncrypted_1.addSubscriberToDynamoEncrypted)(firstName || "", lastName || "", email || "");
        (0, piiSafety_1.auditPIIOperation)('CREATE', 'EMAIL', true, undefined, { requestId });
        logger.info("Encrypted signup successful", { requestId, hasFirstName: !!firstName, hasLastName: !!lastName });
        return res.status(200).json({
            message: "Signup successful"
        });
    }
    catch (error) {
        (0, piiSafety_1.auditPIIOperation)('CREATE', 'EMAIL', false, undefined, { requestId });
        let errorMessage = "An unexpected error occurred. Please try again later.";
        let logMessage = "Signup failed";
        if (error instanceof Error) {
            const errorMsg = error.message.toLowerCase();
            if (errorMsg.includes("is already a list member")) {
                errorMessage = "This email address is already registered for My Career NJ updates. If you believe this is an error or need assistance, please contact support.";
                logMessage = "Signup failed: duplicate email";
            }
            else if (errorMsg.includes("invalid email")) {
                errorMessage = "The email address provided is not valid. Please check for typos and try again.";
                logMessage = "Signup failed: invalid email format";
            }
            else if (errorMsg.includes("email address is required")) {
                errorMessage = "Email address is required.";
                logMessage = "Signup failed: missing email";
            }
        }
        logger.error(logMessage, error, { requestId });
        return res.status(400).json({ error: errorMessage });
    }
});
exports.submitSignupForm = submitSignupForm;
