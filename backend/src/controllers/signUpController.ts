import { Request, Response } from "express";
import { addSubscriberToDynamoEncrypted } from "../dynamodb/writeSignupEmailsEncrypted";
import { createSafeLogger, auditPIIOperation, validateAndSanitizePII } from "../utils/piiSafety";
import crypto from "crypto";

const logger = createSafeLogger(console.log);

export const submitSignupForm = async (req: Request, res: Response) => {
  const requestId = crypto.randomUUID();
  
  try {
    // Validate and sanitize input data
    const sanitizedData = validateAndSanitizePII(req.body || {});
    const { firstName, lastName, email } = sanitizedData;

    // Validate required fields
    if (!email) {
      logger.info("Signup attempt failed: missing email", { requestId });
      return res.status(400).json({ 
        error: "Email address is required." 
      });
    }

    // Add subscriber with encryption (fresh start - always encrypted)
    await addSubscriberToDynamoEncrypted(firstName || "", lastName || "", email || "");
    
    // Audit successful PII operation
    auditPIIOperation('CREATE', 'EMAIL', true, undefined, { requestId });
    
    logger.info("Encrypted signup successful", { requestId, hasFirstName: !!firstName, hasLastName: !!lastName });
    
    return res.status(200).json({ 
      message: "Signup successful" 
    });
    
  } catch (error: unknown) {
    // Audit failed PII operation
    auditPIIOperation('CREATE', 'EMAIL', false, undefined, { requestId });
    
    let errorMessage = "An unexpected error occurred. Please try again later.";
    let logMessage = "Signup failed";

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();

      if (errorMsg.includes("is already a list member")) {
        errorMessage = "This email address is already registered for My Career NJ updates. If you believe this is an error or need assistance, please contact support.";
        logMessage = "Signup failed: duplicate email";
      } else if (errorMsg.includes("invalid email")) {
        errorMessage = "The email address provided is not valid. Please check for typos and try again.";
        logMessage = "Signup failed: invalid email format";
      } else if (errorMsg.includes("email address is required")) {
        errorMessage = "Email address is required.";
        logMessage = "Signup failed: missing email";
      }
    }

    // Log error without exposing PII
    logger.error(logMessage, error, { requestId });

    return res.status(400).json({ error: errorMessage });
  }
};
