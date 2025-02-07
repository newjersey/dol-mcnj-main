import { Request, Response, NextFunction } from "express";
import { isValidEmail } from "../helpers/emailValidator";
import { isValidPhoneNumber } from "../helpers/phoneValidator";
import { isValidName } from "../helpers/nameValidator";

export const validateSignupForm = (req: Request, res: Response, next: NextFunction) => {
  const { email, phone, fname, lname } = req.body;

  // Validate email (Required)
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate first name (Optional but must be a safe string if provided)
  if (fname && (!isValidName(fname))) {
    return res.status(400).json({ error: "Invalid first name" });
  }

  // Validate last name (Optional but must be a safe string if provided)
  if (lname && (!isValidName(lname))) {
    return res.status(400).json({ error: "Invalid last name" });
  }

  // Validate phone number (Optional but must be valid if provided)
  if (phone && !isValidPhoneNumber(phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  next();
};
