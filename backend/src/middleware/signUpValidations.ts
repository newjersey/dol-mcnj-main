import { Request, Response, NextFunction } from "express";
import { isValidEmail } from "../helpers/emailValidator";
import { isValidPhoneNumber } from "../helpers/phoneValidator";
import { isValidName } from "../helpers/nameValidator";

export const validateSignupForm = async (req: Request, res: Response, next: NextFunction) => {
  const { email, phone, fname, lname } = req.body;

  // Validate email (Required)
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const isEmailValid = await isValidEmail(email); // 🔹 Await the validation here

  if (!isEmailValid) {
    return res.status(400).json({ error: "This email address seems invalid. Please check for typos or try a different one." });
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
