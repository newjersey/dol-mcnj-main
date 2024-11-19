"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitContactForm = void 0;
const tslib_1 = require("tslib");
const emailService_1 = require("../utils/emailService");
const submitContactForm = (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const { email, topic, message, url } = req.body;
    const emailBody = `
    Email: ${email}\n
    Topic: ${topic}\n
    Message: ${message}\n
    URL: ${url || 'N/A'}
  `;
    try {
        yield (0, emailService_1.sendEmail)({
            subject: `[My Career NJ] New Contact Request from ${email}`,
            body: emailBody,
        });
        res.status(200).json({ message: 'Your message has been sent successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'There was an error sending your message.', error: error });
    }
});
exports.submitContactForm = submitContactForm;
