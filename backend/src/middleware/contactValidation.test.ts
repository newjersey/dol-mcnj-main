import express, { Request, Response } from 'express';
import request from 'supertest';
import { validateContactForm } from './contactValidation';

const app = express();
app.use(express.json());

app.post('/test-route', validateContactForm, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Success' });
});

describe('POST /test-route', () => {
  it('should respond with 400 if the email is invalid', async () => {
    const response = await request(app)
      .post('/test-route')
      .send({ email: 'invalid-email', message: 'Hello', url: 'http://valid.url.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Please provide a valid email address.',
        }),
      ]),
    );
  });

  it('should respond with 400 if the message is empty', async () => {
    const response = await request(app)
      .post('/test-route')
      .send({ email: 'test@example.com', message: '', url: 'http://valid.url.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'The message field cannot be empty.',
        }),
      ]),
    );
  });

  it('should respond with 400 if the URL is invalid', async () => {
    const response = await request(app)
      .post('/test-route')
      .send({ email: 'test@example.com', message: 'Hello', url: 'invalid-url' });

    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          msg: 'Please provide a valid URL.',
        }),
      ]),
    );
  });

  it('should respond with 200 if all fields are valid', async () => {
    const response = await request(app)
      .post('/test-route')
      .send({ email: 'test@example.com', message: 'Hello', url: 'http://valid.url.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Success' });
  });
});
