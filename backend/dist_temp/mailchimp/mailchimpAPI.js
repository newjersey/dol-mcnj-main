"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubscriberToMailchimp = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const API_KEY = process.env.MAILCHIMP_API_KEY || "";
const LIST_ID = process.env.MAILCHIMP_LIST_ID || "";
const DATACENTER = API_KEY.includes("-") ? API_KEY.split("-")[1] : "";
if (!API_KEY) {
    throw new Error("MAILCHIMP_API_KEY is missing in environment variables.");
}
if (!LIST_ID) {
    throw new Error("MAILCHIMP_LIST_ID is missing in environment variables.");
}
if (!DATACENTER) {
    throw new Error("MAILCHIMP_API_KEY format is incorrect. Expected format: 'key-usX' (e.g., '123456-us21').");
}
const MAILCHIMP_URL = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;
const addSubscriberToMailchimp = (fname, lname, email) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!email) {
        throw new Error("Email address is required.");
    }
    try {
        const response = yield axios_1.default.post(MAILCHIMP_URL, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname,
            },
        }, {
            auth: {
                username: "",
                password: API_KEY,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    catch (error) {
        if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            throw new Error(((_a = error.response.data) === null || _a === void 0 ? void 0 : _a.detail) || "Mailchimp API error");
        }
        else {
            throw new Error("Failed to connect to Mailchimp.");
        }
    }
});
exports.addSubscriberToMailchimp = addSubscriberToMailchimp;
