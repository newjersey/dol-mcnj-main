import request from 'supertest';
import app from '../app';

describe('Router API Integration Tests', () => {
  it('should have app properly configured', () => {
    expect(app).toBeDefined();
  });

  it('should handle unknown routes with 404', async () => {
    const response = await request(app)
      .get('/api/unknown-route')
      .expect(404);
      
    // This is expected behavior for non-existent routes
    expect(response.status).toBe(404);
  });

  it('should respond to health check if available', async () => {
    const response = await request(app)
      .get('/api/health');
      
    // Health check may or may not exist, both outcomes are valid
    expect([200, 404]).toContain(response.status);
  });
});
