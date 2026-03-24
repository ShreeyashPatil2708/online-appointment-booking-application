const dataService = require('./dataService');
const { createError } = require('../utils/helpers');
const { v4: uuidv4 } = require('uuid');

const getAllProviders = (filters = {}) => {
  let providers = dataService.getServiceProviders().filter((p) => p.isActive);
  if (filters.specialty) {
    providers = providers.filter((p) =>
      p.specialty.toLowerCase().includes(filters.specialty.toLowerCase()),
    );
  }
  return providers;
};

const getProviderById = (id) => {
  const provider = dataService.getServiceProviderById(id);
  if (!provider) throw createError('Service provider not found', 404);
  return provider;
};

const getProviderByUserId = (userId) => {
  const provider = dataService.getServiceProviderByUserId(userId);
  if (!provider) throw createError('Service provider profile not found', 404);
  return provider;
};

const updateProvider = (id, updates) => {
  const provider = dataService.getServiceProviderById(id);
  if (!provider) throw createError('Service provider not found', 404);

  // If services are provided, ensure they have IDs
  if (updates.services) {
    updates.services = updates.services.map((s) => ({
      ...s,
      id: s.id || uuidv4(),
    }));
  }

  return dataService.updateServiceProvider(id, updates);
};

const getProviderStats = (providerId) => {
  const appointments = dataService.getAppointmentsByProviderId(providerId);
  const reviews = dataService.getReviewsByProviderId(providerId);
  const slots = dataService.getTimeSlotsByProvider(providerId);

  const statusCounts = appointments.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    totalAppointments: appointments.length,
    ...statusCounts,
    totalReviews: reviews.length,
    averageRating: Math.round(avgRating * 10) / 10,
    totalSlots: slots.length,
    availableSlots: slots.filter((s) => s.status === 'available').length,
  };
};

module.exports = { getAllProviders, getProviderById, getProviderByUserId, updateProvider, getProviderStats };
