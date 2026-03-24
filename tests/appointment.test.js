const request = require('supertest');
const app = require('../server');
const dataService = require('../services/dataService');

let customerToken;
let providerToken;
let providerId;
let slotId;

beforeEach(async () => {
  dataService.resetData();

  // Register customer
  await request(app).post('/api/auth/register').send({
    name: 'Customer',
    email: 'customer@test.com',
    password: 'password123',
    role: 'customer',
  });
  const customerLogin = await request(app).post('/api/auth/login').send({
    email: 'customer@test.com',
    password: 'password123',
  });
  customerToken = customerLogin.body.data.accessToken;

  // Register provider
  await request(app).post('/api/auth/register').send({
    name: 'Provider',
    email: 'provider@test.com',
    password: 'password123',
    role: 'service_provider',
  });
  const providerLogin = await request(app).post('/api/auth/login').send({
    email: 'provider@test.com',
    password: 'password123',
  });
  providerToken = providerLogin.body.data.accessToken;

  // Get provider ID
  const providers = await request(app).get('/api/providers');
  providerId = providers.body.data.data[0].id;

  // Create a time slot
  const slotRes = await request(app)
    .post('/api/providers/me/slots')
    .set('Authorization', `Bearer ${providerToken}`)
    .send({
      date: '2030-12-01',
      startTime: '10:00',
      endTime: '10:30',
    });
  slotId = slotRes.body.data.slot.id;
});

describe('Appointment API', () => {
  describe('POST /api/appointments', () => {
    it('should book an appointment', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          serviceProviderId: providerId,
          timeSlotId: slotId,
          notes: 'Test booking',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.appointment.status).toBe('pending');
    });

    it('should return 409 when booking an already booked slot', async () => {
      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ serviceProviderId: providerId, timeSlotId: slotId });

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ serviceProviderId: providerId, timeSlotId: slotId });
      expect(res.status).toBe(409);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({ serviceProviderId: providerId, timeSlotId: slotId });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/appointments/my', () => {
    it('should return user appointments', async () => {
      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ serviceProviderId: providerId, timeSlotId: slotId });

      const res = await request(app)
        .get('/api/appointments/my')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.data.length).toBe(1);
    });
  });

  describe('PATCH /api/appointments/:id/cancel', () => {
    it('should cancel an appointment', async () => {
      const bookRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ serviceProviderId: providerId, timeSlotId: slotId });
      const appointmentId = bookRes.body.data.appointment.id;

      const res = await request(app)
        .patch(`/api/appointments/${appointmentId}/cancel`)
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.appointment.status).toBe('cancelled');
    });
  });

  describe('PATCH /api/appointments/:id/confirm', () => {
    it('should confirm an appointment as provider', async () => {
      const bookRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ serviceProviderId: providerId, timeSlotId: slotId });
      const appointmentId = bookRes.body.data.appointment.id;

      const res = await request(app)
        .patch(`/api/appointments/${appointmentId}/confirm`)
        .set('Authorization', `Bearer ${providerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.appointment.status).toBe('confirmed');
    });
  });

  describe('PATCH /api/appointments/:id/reject', () => {
    it('should reject an appointment as provider', async () => {
      const bookRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ serviceProviderId: providerId, timeSlotId: slotId });
      const appointmentId = bookRes.body.data.appointment.id;

      const res = await request(app)
        .patch(`/api/appointments/${appointmentId}/reject`)
        .set('Authorization', `Bearer ${providerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.appointment.status).toBe('rejected');
    });
  });
});
