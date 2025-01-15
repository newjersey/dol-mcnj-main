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
    let domain = email.split('@')[1];
    const domainParts = domain.split('.')
    if(domainParts.length > 2) {
        domain = domainParts.slice(-2).join('.')
    }
    return new Promise((resolve) => {
        dns.resolveMx(domain, (err, addresses) => {
            if (err || addresses.length === 0) {
                console.log(`Invalid domain or no MX records for: ${domain}`);
                resolve(false);
            } else {
                console.log(`Valid MX records found for ${domain}:`, addresses);
                resolve(true);
            }
        });
    });
};

