const Joi = require('joi');
const { ROLES } = require('../config/constants');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid(ROLES.CUSTOMER, ROLES.SERVICE_PROVIDER).default(ROLES.CUSTOMER),
  phone: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const appointmentSchema = Joi.object({
  serviceProviderId: Joi.string().uuid().required(),
  timeSlotId: Joi.string().uuid().required(),
  serviceId: Joi.string().uuid().optional(),
  notes: Joi.string().max(500).optional(),
});

const updateAppointmentSchema = Joi.object({
  timeSlotId: Joi.string().uuid().optional(),
  notes: Joi.string().max(500).optional(),
});

const timeSlotSchema = Joi.object({
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
});

const reviewSchema = Joi.object({
  appointmentId: Joi.string().uuid().required(),
  serviceProviderId: Joi.string().uuid().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000).optional(),
});

const serviceProviderUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().optional(),
  specialty: Joi.string().optional(),
  services: Joi.array().items(
    Joi.object({
      id: Joi.string().optional(),
      name: Joi.string().required(),
      duration: Joi.number().min(5).required(),
      price: Joi.number().min(0).required(),
    }),
  ).optional(),
  availability: Joi.object().optional(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  appointmentSchema,
  updateAppointmentSchema,
  timeSlotSchema,
  reviewSchema,
  serviceProviderUpdateSchema,
  userUpdateSchema,
};
