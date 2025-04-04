import { Request, Response } from "express";
import { addSubscriberToMailchimp } from "../mailchimp/mailchimpAPI";

export const submitSignupForm = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone } = req.body;

  try {
    await addSubscriberToMailchimp(firstName, lastName, email, phone);
    return res.status(200).json({ message: "Signup successful" });
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred. Please try again later.";

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();

      if (errorMsg.includes("is already a list member")) {
        errorMessage = `The email "${email}" is already registered for My Career NJ updates. If you believe this is an error or need assistance, please contact support.`;
      } else if (errorMsg.includes("invalid email")) {
        errorMessage = `The email address "${email}" is not valid. Please check for typos and try again.`;
      } else if (errorMsg.includes("phone number invalid")) {
        errorMessage = `The phone number "${phone}" is not valid. Please enter a US phone number in the format XXX-XXX-XXXX.`;
      }
    }

    return res.status(400).json({ error: errorMessage });
  }
};
