import dns from "dns";
import { createSafeLogger } from "../utils/piiSafety";

const logger = createSafeLogger(console.log);

const emailTester =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

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
    logger.info("Invalid email format provided");
    return false;
  }

  try {
    const isValidDomain = await validateDomainMX(email);
    return isValidDomain;
  } catch (error) {
    logger.error("Error during MX record validation", error);
    return false;
  }
};

const validateDomainMX = (email: string): Promise<boolean> => {
  const domain = email.split("@")[1];
  const domainParts = domain.split(".");
  const rootDomain = domainParts.length > 2 ? domainParts.slice(-2).join(".") : domain;

  return new Promise((resolve) => {
    // Trying full domain first
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        logger.error("DNS error while resolving MX for domain", err, { domain: "[REDACTED]" });
      }
      if (!err && addresses.length > 0) {
        logger.info("Valid MX records found for domain");
        return resolve(true);
      }

      // Fallback to root domain if the full domain fails
      dns.resolveMx(rootDomain, (rootErr, rootAddresses) => {
        if (rootErr) {
          logger.error("DNS error while resolving MX for root domain", rootErr, {
            rootDomain: "[REDACTED]",
          });
        }
        if (!rootErr && rootAddresses.length > 0) {
          logger.info("Valid MX records found for root domain");
          resolve(true);
        } else {
          logger.info("Invalid domain or no MX records found");
          resolve(false);
        }
      });
    });
  });
};
