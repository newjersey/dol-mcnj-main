"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
function sendEmail(emailParams) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!process.env.EMAIL_SOURCE) {
            throw 'Email Source not defined';
        }
        if (!process.env.CONTACT_RECEIVER_EMAIL) {
            throw 'Email Receiver not defined';
        }
        try {
            yield transporter.sendMail({
                from: process.env.EMAIL_SOURCE,
                to: process.env.CONTACT_RECEIVER_EMAIL,
                subject: emailParams.subject,
                text: emailParams.body,
            });
        }
        catch (error) {
            console.log("Error Sending Email Via SES", error);
        }
    });
}
