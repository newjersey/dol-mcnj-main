import dns from 'dns';

const emailTester = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

const validateEmailFormat = (email: string): boolean => {
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

export const isValidEmail = async (email: string): Promise<boolean> => {
    if (!validateEmailFormat(email)) {
        console.log("Invalid email format");
        return false;
    }

    try {
        const isValidDomain = await validateDomainMX(email);
        return isValidDomain;
    } catch (error) {
        console.error("Error during MX record validation:", error);
        return false;
    }
};

const validateDomainMX = (email: string): Promise<boolean> => {
    const domain = email.split('@')[1];
    const domainParts = domain.split('.');
    const rootDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : domain;

    return new Promise((resolve) => {
        // Trying full domain first
        dns.resolveMx(domain, (err, addresses) => {
            if (err) {
                console.error("DNS error while resolving MX for domain", domain, ":", err.message);
            }
            if (!err && addresses.length > 0) {
                console.log("Valid MX records found for", domain, ":", addresses);
                return resolve(true);
            }

            // Fallback to root domain if the full domain fails
            dns.resolveMx(rootDomain, (rootErr, rootAddresses) => {
                if (rootErr) {
                    console.error("DNS error while resolving MX for root domain", rootDomain, ":", rootErr.message);
                }
                if (!rootErr && rootAddresses.length > 0) {
                    console.log("Valid MX records found for", rootDomain, ":", rootAddresses);
                    resolve(true);
                } else {
                    console.log("Invalid domain or no MX records for:", domain);
                    resolve(false);
                }
            });
        });
    });
};


