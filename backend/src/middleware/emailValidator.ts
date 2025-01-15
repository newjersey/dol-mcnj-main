import dns from 'dns';
import * as EmailValidator from 'email-validator';

export const isValidEmail = async (email: string): Promise<boolean> => {
    if (!EmailValidator.validate(email)) {
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
    const rootDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : domain; // If subdomain exists

    return new Promise((resolve) => {
        // Trying full domain first
        dns.resolveMx(domain, (err, addresses) => {
            if (!err && addresses.length > 0) {
                console.log(`Valid MX records found for ${domain}:`, addresses);
                return resolve(true);
            }

            // Fallback to root domain if the full domain fails
            dns.resolveMx(rootDomain, (rootErr, rootAddresses) => {
                if (!rootErr && rootAddresses.length > 0) {
                    console.log(`Valid MX records found for ${rootDomain}:`, rootAddresses);
                    resolve(true);
                } else {
                    console.log(`Invalid domain or no MX records for: ${domain}`);
                    resolve(false);
                }
            });
        });
    });
};


