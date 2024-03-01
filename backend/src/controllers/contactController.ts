import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
// import { sendEmail } from '../utils/emailService';

export const submitContactForm = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, category, email, message, url } = req.body;
  const emailBody = `
    Name: ${name}\n
    Category: ${category}\n
    Email: ${email}\n
    Message: ${message}\n
    URL: ${url || 'N/A'}
  `;

  try {
    // await sendEmail({
    //   recipient: process.env.CONTACT_RECEIVER_EMAIL || '',
    //   subject: `[My Career NJ] New Contact Request from ${name}`,
    //   body: emailBody,
    // });
    res.status(200).json({ message: 'Your message has been sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'There was an error sending your message.' });
  }
};