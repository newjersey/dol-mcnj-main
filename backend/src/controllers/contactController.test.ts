import { submitContactForm } from './contactController';
import { sendEmail } from '../utils/emailService';
import { Request, Response } from 'express';

jest.mock('../utils/emailService', () => ({
  sendEmail: jest.fn(),
}));

describe('submitContactForm', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        message: 'Hello',
        topic: 'test',
        url: 'http://example.com',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    (sendEmail as jest.Mock).mockClear();
  });

  it('should send an email and respond with success', async () => {
    (sendEmail as jest.Mock).mockResolvedValueOnce({});

    await submitContactForm(req as Request, res as Response);

    expect(sendEmail).toHaveBeenCalledWith({
      subject: `[My Career NJ] New Contact Request from test@example.com`,
      body: expect.any(String),
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Your message has been sent successfully.' });
  });

  it('should handle errors when sending an email fails', async () => {
    const error = new Error('Failed to send email');
    (sendEmail as jest.Mock).mockRejectedValueOnce(error);

    await submitContactForm(req as Request, res as Response);

    expect(sendEmail).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'There was an error sending your message.',
      error: error
  });
  });
});
