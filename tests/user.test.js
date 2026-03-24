const request = require('supertest');
const app = require('../server');
const dataService = require('../services/dataService');

let customerToken;
let adminToken;
let customerId;

beforeEach(async () => {
  dataService.resetData();

  // Register admin
  const adminUser = dataService.createUser({
    name: 'Admin',
    email: 'admin@test.com',
    password: '$2b$10$rQnZ8vU.sWoTYG3y1yRpquXsTtXkqiSeTk3VkNGv.9XT9A5gbJfGm', // admin123
    role: 'admin',
    isActive: true,
  });

  // Register customer
  const regRes = await request(app).post('/api/auth/register').send({
    name: 'Customer',
    email: 'customer@test.com',
    password: 'password123',
    role: 'customer',
  });
  customerId = regRes.body.data.user.id;

  const customerLogin = await request(app).post('/api/auth/login').send({
    email: 'customer@test.com',
    password: 'password123',
  });
  customerToken = customerLogin.body.data.accessToken;

  // Login admin (use direct password)
  const bcrypt = require('bcryptjs');
  const hashedPwd = await bcrypt.hash('adminpass', 10);
  dataService.updateUser(adminUser.id, { password: hashedPwd });
  const adminLogin = await request(app).post('/api/auth/login').send({
    email: 'admin@test.com',
    password: 'adminpass',
  });
  adminToken = adminLogin.body.data.accessToken;
});

describe('User API', () => {
  describe('GET /api/users/profile', () => {
    it('should return user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('customer@test.com');
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Updated Name', phone: '+1-555-7777' });
      expect(res.status).toBe(200);
      expect(res.body.data.user.name).toBe('Updated Name');
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'X' }); // too short
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/users/notifications', () => {
    it('should return notifications', async () => {
      const res = await request(app)
        .get('/api/users/notifications')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.notifications)).toBe(true);
    });
  });
});

describe('Admin API', () => {
  describe('GET /api/admin/stats', () => {
    it('should return system stats for admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.stats).toBeDefined();
    });

    it('should return 403 for non-admin', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return all users for admin', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.data)).toBe(true);
    });
  });

  describe('PATCH /api/admin/users/:id/deactivate', () => {
    it('should deactivate a user', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${customerId}/deactivate`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.user.isActive).toBe(false);
    });
  });

  describe('GET /api/admin/appointments', () => {
    it('should return all appointments', async () => {
      const res = await request(app)
        .get('/api/admin/appointments')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });
  });
});
