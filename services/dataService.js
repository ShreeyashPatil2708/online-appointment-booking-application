const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { ROLES, APPOINTMENT_STATUS, SLOT_STATUS } = require('../config/constants');

// In-memory data stores
let users = [];
let serviceProviders = [];
let appointments = [];
let timeSlots = [];
let reviews = [];
let notifications = [];
let refreshTokens = [];

// Initialize with sample data
const initializeSampleData = async () => {
  // Sample admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  users.push({
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@example.com',
    password: adminPassword,
    role: ROLES.ADMIN,
    phone: '+1-555-0100',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Sample customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customerId = uuidv4();
  users.push({
    id: customerId,
    name: 'John Doe',
    email: 'john@example.com',
    password: customerPassword,
    role: ROLES.CUSTOMER,
    phone: '+1-555-0101',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Sample service provider users
  const providerPassword = await bcrypt.hash('provider123', 10);
  const providerUserId1 = uuidv4();
  const providerUserId2 = uuidv4();

  users.push({
    id: providerUserId1,
    name: 'Dr. Alice Smith',
    email: 'alice@example.com',
    password: providerPassword,
    role: ROLES.SERVICE_PROVIDER,
    phone: '+1-555-0102',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  users.push({
    id: providerUserId2,
    name: 'Dr. Bob Johnson',
    email: 'bob@example.com',
    password: providerPassword,
    role: ROLES.SERVICE_PROVIDER,
    phone: '+1-555-0103',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Sample service providers
  const spId1 = uuidv4();
  const spId2 = uuidv4();

  serviceProviders.push({
    id: spId1,
    userId: providerUserId1,
    name: 'Dr. Alice Smith',
    email: 'alice@example.com',
    phone: '+1-555-0102',
    specialty: 'General Medicine',
    services: [
      { id: uuidv4(), name: 'General Checkup', duration: 30, price: 100 },
      { id: uuidv4(), name: 'Blood Test', duration: 15, price: 50 },
    ],
    availability: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '15:00' },
    },
    rating: 4.8,
    totalReviews: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  serviceProviders.push({
    id: spId2,
    userId: providerUserId2,
    name: 'Dr. Bob Johnson',
    email: 'bob@example.com',
    phone: '+1-555-0103',
    specialty: 'Dentistry',
    services: [
      { id: uuidv4(), name: 'Dental Cleaning', duration: 60, price: 150 },
      { id: uuidv4(), name: 'Teeth Whitening', duration: 90, price: 300 },
    ],
    availability: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '16:00' },
    },
    rating: 4.5,
    totalReviews: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Sample time slots for today and next 7 days
  const today = new Date();
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];
    times.forEach((time) => {
      timeSlots.push({
        id: uuidv4(),
        serviceProviderId: spId1,
        date: dateStr,
        startTime: time,
        endTime: addMinutes(time, 30),
        status: SLOT_STATUS.AVAILABLE,
        createdAt: new Date().toISOString(),
      });

      timeSlots.push({
        id: uuidv4(),
        serviceProviderId: spId2,
        date: dateStr,
        startTime: time,
        endTime: addMinutes(time, 60),
        status: SLOT_STATUS.AVAILABLE,
        createdAt: new Date().toISOString(),
      });
    });
  }
};

const addMinutes = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMins = hours * 60 + mins + minutes;
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Data access methods
const dataService = {
  // Users
  getUsers: () => users,
  getUserById: (id) => users.find((u) => u.id === id),
  getUserByEmail: (email) => users.find((u) => u.email === email),
  createUser: (user) => {
    const newUser = { ...user, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    users.push(newUser);
    return newUser;
  },
  updateUser: (id, updates) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    return users[index];
  },
  deleteUser: (id) => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },

  // Service Providers
  getServiceProviders: () => serviceProviders,
  getServiceProviderById: (id) => serviceProviders.find((sp) => sp.id === id),
  getServiceProviderByUserId: (userId) => serviceProviders.find((sp) => sp.userId === userId),
  createServiceProvider: (sp) => {
    const newSp = { ...sp, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    serviceProviders.push(newSp);
    return newSp;
  },
  updateServiceProvider: (id, updates) => {
    const index = serviceProviders.findIndex((sp) => sp.id === id);
    if (index === -1) return null;
    serviceProviders[index] = { ...serviceProviders[index], ...updates, updatedAt: new Date().toISOString() };
    return serviceProviders[index];
  },
  deleteServiceProvider: (id) => {
    const index = serviceProviders.findIndex((sp) => sp.id === id);
    if (index === -1) return false;
    serviceProviders.splice(index, 1);
    return true;
  },

  // Appointments
  getAppointments: () => appointments,
  getAppointmentById: (id) => appointments.find((a) => a.id === id),
  getAppointmentsByUserId: (userId) => appointments.filter((a) => a.userId === userId),
  getAppointmentsByProviderId: (providerId) => appointments.filter((a) => a.serviceProviderId === providerId),
  createAppointment: (appointment) => {
    const newApp = { ...appointment, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    appointments.push(newApp);
    return newApp;
  },
  updateAppointment: (id, updates) => {
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) return null;
    appointments[index] = { ...appointments[index], ...updates, updatedAt: new Date().toISOString() };
    return appointments[index];
  },
  deleteAppointment: (id) => {
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) return false;
    appointments.splice(index, 1);
    return true;
  },

  // Time Slots
  getTimeSlots: () => timeSlots,
  getTimeSlotById: (id) => timeSlots.find((ts) => ts.id === id),
  getTimeSlotsByProvider: (providerId) => timeSlots.filter((ts) => ts.serviceProviderId === providerId),
  getAvailableTimeSlots: (providerId, date) => timeSlots.filter(
    (ts) => ts.serviceProviderId === providerId && ts.date === date && ts.status === SLOT_STATUS.AVAILABLE,
  ),
  createTimeSlot: (slot) => {
    const newSlot = { ...slot, id: uuidv4(), createdAt: new Date().toISOString() };
    timeSlots.push(newSlot);
    return newSlot;
  },
  updateTimeSlot: (id, updates) => {
    const index = timeSlots.findIndex((ts) => ts.id === id);
    if (index === -1) return null;
    timeSlots[index] = { ...timeSlots[index], ...updates };
    return timeSlots[index];
  },
  deleteTimeSlot: (id) => {
    const index = timeSlots.findIndex((ts) => ts.id === id);
    if (index === -1) return false;
    timeSlots.splice(index, 1);
    return true;
  },

  // Reviews
  getReviews: () => reviews,
  getReviewsByProviderId: (providerId) => reviews.filter((r) => r.serviceProviderId === providerId),
  getReviewsByUserId: (userId) => reviews.filter((r) => r.userId === userId),
  createReview: (review) => {
    const newReview = { ...review, id: uuidv4(), createdAt: new Date().toISOString() };
    reviews.push(newReview);
    return newReview;
  },
  updateReview: (id, updates) => {
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) return null;
    reviews[index] = { ...reviews[index], ...updates };
    return reviews[index];
  },
  deleteReview: (id) => {
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) return false;
    reviews.splice(index, 1);
    return true;
  },

  // Notifications
  getNotifications: () => notifications,
  getNotificationsByUserId: (userId) => notifications.filter((n) => n.userId === userId),
  createNotification: (notification) => {
    const newNotif = { ...notification, id: uuidv4(), read: false, createdAt: new Date().toISOString() };
    notifications.push(newNotif);
    return newNotif;
  },
  markNotificationRead: (id) => {
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return null;
    notifications[index] = { ...notifications[index], read: true };
    return notifications[index];
  },

  // Refresh tokens
  getRefreshTokens: () => refreshTokens,
  addRefreshToken: (token) => {
    refreshTokens.push(token);
  },
  removeRefreshToken: (token) => {
    const index = refreshTokens.indexOf(token);
    if (index !== -1) refreshTokens.splice(index, 1);
  },
  isRefreshTokenValid: (token) => refreshTokens.includes(token),

  // Statistics
  getStats: () => ({
    totalUsers: users.filter((u) => u.role !== 'admin').length,
    totalCustomers: users.filter((u) => u.role === 'customer').length,
    totalProviders: serviceProviders.length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter((a) => a.status === APPOINTMENT_STATUS.PENDING).length,
    confirmedAppointments: appointments.filter((a) => a.status === APPOINTMENT_STATUS.CONFIRMED).length,
    completedAppointments: appointments.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED).length,
    cancelledAppointments: appointments.filter((a) => a.status === APPOINTMENT_STATUS.CANCELLED).length,
    totalReviews: reviews.length,
  }),

  // Reset data (for testing)
  resetData: () => {
    users = [];
    serviceProviders = [];
    appointments = [];
    timeSlots = [];
    reviews = [];
    notifications = [];
    refreshTokens = [];
  },

  initializeSampleData,
};

module.exports = dataService;
