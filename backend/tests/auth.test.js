const request = require('supertest');
const app = require('../server');
const dataService = require('../services/dataService');

beforeEach(() => {
  dataService.resetData();
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new customer', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should register a service provider and create provider profile', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Dr. Test',
        email: 'drtest@example.com',
        password: 'password123',
        role: 'service_provider',
      });
      expect(res.status).toBe(201);
      expect(res.body.data.user.role).toBe('service_provider');
    });

    it('should return 409 for duplicate email', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'dup@example.com',
        password: 'password123',
      });
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User 2',
        email: 'dup@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(409);
    });

    it('should return 400 for invalid input', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'T',
        email: 'not-an-email',
        password: '123',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should return 401 for invalid password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(401);
    });

    it('should return 401 for non-existent email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Refresh User',
        email: 'refresh@example.com',
        password: 'password123',
      });
      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'refresh@example.com',
        password: 'password123',
      });
      const { refreshToken } = loginRes.body.data;

      const res = await request(app).post('/api/auth/refresh').send({ refreshToken });
      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should return 401 for invalid refresh token', async () => {
      const res = await request(app).post('/api/auth/refresh').send({ refreshToken: 'invalid-token' });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app).post('/api/auth/logout').send({});
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Me User',
        email: 'me@example.com',
        password: 'password123',
      });
      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'me@example.com',
        password: 'password123',
      });
      const { accessToken } = loginRes.body.data;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('me@example.com');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
