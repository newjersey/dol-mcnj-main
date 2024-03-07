import { Request, Response } from 'express';
import { sendEmail } from '../utils/emailService';

interface ContactFormRequest extends Request {
  body: {
    email: string;
    topic: string;
    message: string;
    url?: string;
  };
}

export const submitContactForm = async (req: ContactFormRequest, res: Response): Promise<void> => {
  const { email, topic, message, url } = req.body;
  const emailBody = `
    Email: ${email}\n
    Topic: ${topic}\n
    Message: ${message}\n
    URL: ${url || 'N/A'}
  `;
 
  try {
    await sendEmail({
      subject: `[My Career NJ] New Contact Request from ${email}`,
      body: emailBody,
    });
    res.status(200).json({ message: 'Your message has been sent successfully.' });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: 'There was an error sending your message.', error: error});
  }
};