"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSignupForm = void 0;
const tslib_1 = require("tslib");
const mailchimpAPI_1 = require("../mailchimp/mailchimpAPI");
const submitSignupForm = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, } = req.body;
    try {
        yield (0, mailchimpAPI_1.addSubscriberToMailchimp)(firstName, lastName, email);
        return res.status(200).json({ message: "Signup successful" });
    }
    catch (error) {
        let errorMessage = "An unexpected error occurred. Please try again later.";
        if (error instanceof Error) {
            const errorMsg = error.message.toLowerCase();
            if (errorMsg.includes("is already a list member")) {
                errorMessage = `The email "${email}" is already registered for My Career NJ updates. If you believe this is an error or need assistance, please contact support.`;
            }
            else if (errorMsg.includes("invalid email")) {
                errorMessage = `The email address "${email}" is not valid. Please check for typos and try again.`;
            }
        }
        return res.status(400).json({ error: errorMessage });
    }
});
exports.submitSignupForm = submitSignupForm;
