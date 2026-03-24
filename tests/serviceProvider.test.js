const request = require('supertest');
const app = require('../server');
const dataService = require('../services/dataService');

let providerToken;
let providerId;

beforeEach(async () => {
  dataService.resetData();

  await request(app).post('/api/auth/register').send({
    name: 'Dr. Test Provider',
    email: 'provider@test.com',
    password: 'password123',
    role: 'service_provider',
  });
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'provider@test.com',
    password: 'password123',
  });
  providerToken = loginRes.body.data.accessToken;
  const providers = await request(app).get('/api/providers');
  providerId = providers.body.data.data[0].id;
});

describe('Service Provider API', () => {
  describe('GET /api/providers', () => {
    it('should return list of providers', async () => {
      const res = await request(app).get('/api/providers');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.data)).toBe(true);
    });

    it('should filter by specialty', async () => {
      // Update provider with specialty first
      await request(app)
        .put('/api/providers/me/profile')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ specialty: 'Cardiology' });

      const res = await request(app).get('/api/providers?specialty=Cardiology');
      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/providers/:id', () => {
    it('should return a specific provider', async () => {
      const res = await request(app).get(`/api/providers/${providerId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.provider.id).toBe(providerId);
    });

    it('should return 404 for non-existent provider', async () => {
      const res = await request(app).get('/api/providers/non-existent-id');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/providers/me/profile', () => {
    it('should return provider profile for authenticated provider', async () => {
      const res = await request(app)
        .get('/api/providers/me/profile')
        .set('Authorization', `Bearer ${providerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.provider).toBeDefined();
    });

    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/providers/me/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/providers/me/profile', () => {
    it('should update provider profile', async () => {
      const res = await request(app)
        .put('/api/providers/me/profile')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ specialty: 'Dermatology', phone: '+1-555-9999' });
      expect(res.status).toBe(200);
      expect(res.body.data.provider.specialty).toBe('Dermatology');
    });
  });

  describe('POST /api/providers/me/slots', () => {
    it('should create a time slot', async () => {
      const res = await request(app)
        .post('/api/providers/me/slots')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ date: '2030-12-01', startTime: '09:00', endTime: '09:30' });
      expect(res.status).toBe(201);
      expect(res.body.data.slot).toBeDefined();
    });

    it('should return 409 for duplicate slot', async () => {
      await request(app)
        .post('/api/providers/me/slots')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ date: '2030-12-01', startTime: '09:00', endTime: '09:30' });
      const res = await request(app)
        .post('/api/providers/me/slots')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ date: '2030-12-01', startTime: '09:00', endTime: '09:30' });
      expect(res.status).toBe(409);
    });

    it('should return 400 for invalid slot data', async () => {
      const res = await request(app)
        .post('/api/providers/me/slots')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ date: 'not-a-date', startTime: '09:00', endTime: '09:30' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/providers/:id/slots', () => {
    it('should return available slots for provider', async () => {
      await request(app)
        .post('/api/providers/me/slots')
        .set('Authorization', `Bearer ${providerToken}`)
        .send({ date: '2030-12-01', startTime: '10:00', endTime: '10:30' });

      const res = await request(app)
        .get(`/api/providers/${providerId}/slots?date=2030-12-01`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.slots)).toBe(true);
    });
  });
});
