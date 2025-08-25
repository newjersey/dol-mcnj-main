"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = void 0;
const tslib_1 = require("tslib");
const dns_1 = tslib_1.__importDefault(require("dns"));
const emailTester = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const validateEmailFormat = (email) => {
    if (!email || email.length > 254) {
        return false;
    }
    const valid = emailTester.test(email);
    if (!valid) {
        return false;
    }
    const parts = email.split("@");
    if (parts[0].length > 64) {
        return false;
    }
    const domainParts = parts[1].split(".");
    if (domainParts.some((part) => part.length > 63)) {
        return false;
    }
    return true;
};
const isValidEmail = (email) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!validateEmailFormat(email)) {
        console.log("Invalid email format");
        return false;
    }
    try {
        const isValidDomain = yield validateDomainMX(email);
        return isValidDomain;
    }
    catch (error) {
        console.error("Error during MX record validation:", error);
        return false;
    }
});
exports.isValidEmail = isValidEmail;
const validateDomainMX = (email) => {
    const domain = email.split('@')[1];
    const domainParts = domain.split('.');
    const rootDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : domain;
    return new Promise((resolve) => {
        dns_1.default.resolveMx(domain, (err, addresses) => {
            if (err) {
                console.error("DNS error while resolving MX for domain", domain, ":", err.message);
            }
            if (!err && addresses.length > 0) {
                console.log("Valid MX records found for", domain, ":", addresses);
                return resolve(true);
            }
            dns_1.default.resolveMx(rootDomain, (rootErr, rootAddresses) => {
                if (rootErr) {
                    console.error("DNS error while resolving MX for root domain", rootDomain, ":", rootErr.message);
                }
                if (!rootErr && rootAddresses.length > 0) {
                    console.log("Valid MX records found for", rootDomain, ":", rootAddresses);
                    resolve(true);
                }
                else {
                    console.log("Invalid domain or no MX records for:", domain);
                    resolve(false);
                }
            });
        });
    });
};
