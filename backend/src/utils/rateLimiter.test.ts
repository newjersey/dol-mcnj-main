import { rateLimiter } from './rateLimiter';
import express, { Express } from 'express';
import request from 'supertest';

describe('rateLimiter middleware', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(rateLimiter(1, 2)); // 1-second window, limit 2 requests
    app.get('/', (req, res) => res.status(200).json({ message: 'Success' }));
  });

  it('should allow requests under the limit', async () => {
    const response1 = await request(app).get('/');
    const response2 = await request(app).get('/');

    expect(response1.statusCode).toBe(200);
    expect(response2.statusCode).toBe(200);
  });

  it('should block requests over the limit', async () => {
    await request(app).get('/');
    await request(app).get('/');

    const response = await request(app).get('/');
    expect(response.statusCode).not.toBe(200);
    expect(response.text).toMatch("Too many requests, please try again later.")
  });

  it('should reset the limit after the interval', async () => {
    await request(app).get('/');
    await request(app).get('/');

  
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
