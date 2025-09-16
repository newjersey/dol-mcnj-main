import { Request, Response, NextFunction } from "express";
import { isValidEmail } from "../helpers/emailValidator";
// import { isValidPhoneNumber } from "../helpers/phoneValidator";
import { isValidName } from "../helpers/nameValidator";
import { createSafeLogger, auditPIIOperation } from "../utils/piiSafety";
import crypto from "crypto";

const logger = createSafeLogger(console.log);

/**
 * Enhanced validation middleware with PII safety measures
 * - Length limits to prevent abuse
 * - Input sanitization to remove harmful characters
 * - Audit logging for validation attempts
 * - Safe error messages without PII exposure
 */
export const validateSignupForm = async (req: Request, res: Response, next: NextFunction) => {
  const operationId = crypto.randomUUID();
  const { email, /*phone,*/ fname, lname } = req.body;

  try {
    // Validate email (Required)
    if (!email) {
      logger.info("Validation failed: missing email", { operationId });
      return res.status(400).json({ error: "Email is required." });
    }

    // Email length validation (RFC 5321 standard)
    if (email.length > 254) {
      logger.info("Validation failed: email too long", { operationId, emailLength: email.length });
      auditPIIOperation('VALIDATION', 'EMAIL', false, 'EMAIL_TOO_LONG', { operationId });
      return res.status(400).json({ error: "Email address exceeds maximum length." });
    }

    // Sanitize email (remove leading/trailing whitespace)
    const sanitizedEmail = email.trim();
    
    const isEmailValid = await isValidEmail(sanitizedEmail);
    if (!isEmailValid) {
      logger.info("Validation failed: invalid email format", { operationId });
      auditPIIOperation('VALIDATION', 'EMAIL', false, 'INVALID_FORMAT', { operationId });
      return res.status(400).json({
        error: "This email address seems invalid. Please check for typos or try a different one.",
      });
    }

    // First name validation with length limits
    if (fname !== undefined) {
      // Length validation (reasonable limit for names)
      if (fname.length > 50) {
        logger.info("Validation failed: first name too long", { operationId, fnameLength: fname.length });
        return res.status(400).json({ error: "First name exceeds maximum length." });
      }
      
      // Sanitize and validate
      const sanitizedFname = fname.trim();
      if (sanitizedFname && !isValidName(sanitizedFname)) {
        logger.info("Validation failed: invalid first name", { operationId });
        return res.status(400).json({ error: "Invalid first name" });
      }
      
      // Update request with sanitized value
      req.body.fname = sanitizedFname || null;
    }

    // Last name validation with length limits
    if (lname !== undefined) {
      // Length validation
      if (lname.length > 50) {
        logger.info("Validation failed: last name too long", { operationId, lnameLength: lname.length });
        return res.status(400).json({ error: "Last name exceeds maximum length." });
      }
      
      // Sanitize and validate
      const sanitizedLname = lname.trim();
      if (sanitizedLname && !isValidName(sanitizedLname)) {
        logger.info("Validation failed: invalid last name", { operationId });
        return res.status(400).json({ error: "Invalid last name" });
      }
      
      // Update request with sanitized value
      req.body.lname = sanitizedLname || null;
    }

    // Update request with sanitized email
    req.body.email = sanitizedEmail;

    // Log successful validation (without PII)
    logger.info("Validation successful", { 
      operationId, 
      hasFirstName: !!req.body.fname,
      hasLastName: !!req.body.lname 
    });
    
    auditPIIOperation('VALIDATION', 'EMAIL', true, undefined, { operationId });

    next();

  } catch (error) {
    // Handle unexpected validation errors
    logger.error("Validation middleware error", error, { operationId });
    auditPIIOperation('VALIDATION', 'EMAIL', false, 'SYSTEM_ERROR', { operationId });
    
    return res.status(500).json({ 
      error: "Validation service temporarily unavailable. Please try again later." 
    });
  }
};

// Validate phone number (Optional but must be valid if provided)
// if (phone && !isValidPhoneNumber(phone)) {
//   return res.status(400).json({ error: "Invalid phone number format" });
// }
