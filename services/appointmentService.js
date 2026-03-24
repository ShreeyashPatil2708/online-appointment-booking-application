const dataService = require('./dataService');
const { APPOINTMENT_STATUS, SLOT_STATUS, NOTIFICATION_TYPES } = require('../config/constants');
const { createError } = require('../utils/helpers');
const notificationService = require('./notificationService');

const createAppointment = (userId, appointmentData) => {
  const { serviceProviderId, timeSlotId, serviceId, notes } = appointmentData;

  const provider = dataService.getServiceProviderById(serviceProviderId);
  if (!provider) {
    throw createError('Service provider not found', 404);
  }

  const slot = dataService.getTimeSlotById(timeSlotId);
  if (!slot) {
    throw createError('Time slot not found', 404);
  }
  if (slot.serviceProviderId !== serviceProviderId) {
    throw createError('Time slot does not belong to this provider', 400);
  }
  if (slot.status !== SLOT_STATUS.AVAILABLE) {
    throw createError('Time slot is not available', 409);
  }

  let service = null;
  if (serviceId) {
    service = provider.services.find((s) => s.id === serviceId);
    if (!service) {
      throw createError('Service not found for this provider', 404);
    }
  }

  const appointment = dataService.createAppointment({
    userId,
    serviceProviderId,
    timeSlotId,
    serviceId: serviceId || null,
    serviceName: service ? service.name : null,
    servicePrice: service ? service.price : null,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: APPOINTMENT_STATUS.PENDING,
    notes: notes || null,
  });

  // Mark slot as booked
  dataService.updateTimeSlot(timeSlotId, { status: SLOT_STATUS.BOOKED, appointmentId: appointment.id });

  // Notify user
  notificationService.createNotification(
    userId,
    NOTIFICATION_TYPES.APPOINTMENT_BOOKED,
    `Your appointment on ${slot.date} at ${slot.startTime} has been booked.`,
    { appointmentId: appointment.id },
  );

  return appointment;
};

const getUserAppointments = (userId) => {
  const appointments = dataService.getAppointmentsByUserId(userId);
  return appointments.map((a) => enrichAppointment(a));
};

const getProviderAppointments = (providerId) => {
  const appointments = dataService.getAppointmentsByProviderId(providerId);
  return appointments.map((a) => enrichAppointment(a));
};

const getAppointmentById = (id) => {
  const appointment = dataService.getAppointmentById(id);
  if (!appointment) throw createError('Appointment not found', 404);
  return enrichAppointment(appointment);
};

const cancelAppointment = (appointmentId, userId, userRole) => {
  const appointment = dataService.getAppointmentById(appointmentId);
  if (!appointment) throw createError('Appointment not found', 404);

  const { ROLES } = require('../config/constants');
  if (userRole !== ROLES.ADMIN && appointment.userId !== userId) {
    throw createError('Not authorized to cancel this appointment', 403);
  }

  if ([APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED].includes(appointment.status)) {
    throw createError(`Cannot cancel an appointment that is already ${appointment.status}`, 400);
  }

  const updated = dataService.updateAppointment(appointmentId, { status: APPOINTMENT_STATUS.CANCELLED });

  // Free up the slot
  dataService.updateTimeSlot(appointment.timeSlotId, { status: SLOT_STATUS.AVAILABLE, appointmentId: null });

  notificationService.createNotification(
    appointment.userId,
    NOTIFICATION_TYPES.APPOINTMENT_CANCELLED,
    `Your appointment on ${appointment.date} at ${appointment.startTime} has been cancelled.`,
    { appointmentId },
  );

  return updated;
};

const confirmAppointment = (appointmentId, providerId) => {
  const appointment = dataService.getAppointmentById(appointmentId);
  if (!appointment) throw createError('Appointment not found', 404);
  if (appointment.serviceProviderId !== providerId) {
    throw createError('Not authorized to confirm this appointment', 403);
  }
  if (appointment.status !== APPOINTMENT_STATUS.PENDING) {
    throw createError('Only pending appointments can be confirmed', 400);
  }

  const updated = dataService.updateAppointment(appointmentId, { status: APPOINTMENT_STATUS.CONFIRMED });

  notificationService.createNotification(
    appointment.userId,
    NOTIFICATION_TYPES.APPOINTMENT_CONFIRMED,
    `Your appointment on ${appointment.date} at ${appointment.startTime} has been confirmed.`,
    { appointmentId },
  );

  return updated;
};

const rejectAppointment = (appointmentId, providerId) => {
  const appointment = dataService.getAppointmentById(appointmentId);
  if (!appointment) throw createError('Appointment not found', 404);
  if (appointment.serviceProviderId !== providerId) {
    throw createError('Not authorized to reject this appointment', 403);
  }
  if (appointment.status !== APPOINTMENT_STATUS.PENDING) {
    throw createError('Only pending appointments can be rejected', 400);
  }

  const updated = dataService.updateAppointment(appointmentId, { status: APPOINTMENT_STATUS.REJECTED });

  // Free up slot
  dataService.updateTimeSlot(appointment.timeSlotId, { status: SLOT_STATUS.AVAILABLE, appointmentId: null });

  notificationService.createNotification(
    appointment.userId,
    NOTIFICATION_TYPES.APPOINTMENT_REJECTED,
    `Your appointment on ${appointment.date} at ${appointment.startTime} has been rejected.`,
    { appointmentId },
  );

  return updated;
};

const completeAppointment = (appointmentId, providerId) => {
  const appointment = dataService.getAppointmentById(appointmentId);
  if (!appointment) throw createError('Appointment not found', 404);
  if (appointment.serviceProviderId !== providerId) {
    throw createError('Not authorized to complete this appointment', 403);
  }
  if (appointment.status !== APPOINTMENT_STATUS.CONFIRMED) {
    throw createError('Only confirmed appointments can be completed', 400);
  }

  const updated = dataService.updateAppointment(appointmentId, { status: APPOINTMENT_STATUS.COMPLETED });

  notificationService.createNotification(
    appointment.userId,
    NOTIFICATION_TYPES.APPOINTMENT_COMPLETED,
    `Your appointment on ${appointment.date} at ${appointment.startTime} has been marked as completed.`,
    { appointmentId },
  );

  return updated;
};

const rescheduleAppointment = (appointmentId, userId, newTimeSlotId) => {
  const appointment = dataService.getAppointmentById(appointmentId);
  if (!appointment) throw createError('Appointment not found', 404);
  if (appointment.userId !== userId) {
    throw createError('Not authorized to reschedule this appointment', 403);
  }
  if (![APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.CONFIRMED].includes(appointment.status)) {
    throw createError('Cannot reschedule this appointment', 400);
  }

  const newSlot = dataService.getTimeSlotById(newTimeSlotId);
  if (!newSlot) throw createError('New time slot not found', 404);
  if (newSlot.serviceProviderId !== appointment.serviceProviderId) {
    throw createError('New slot does not belong to the same provider', 400);
  }
  if (newSlot.status !== SLOT_STATUS.AVAILABLE) {
    throw createError('New time slot is not available', 409);
  }

  // Free old slot
  dataService.updateTimeSlot(appointment.timeSlotId, { status: SLOT_STATUS.AVAILABLE, appointmentId: null });

  // Book new slot
  dataService.updateTimeSlot(newTimeSlotId, { status: SLOT_STATUS.BOOKED, appointmentId });

  const updated = dataService.updateAppointment(appointmentId, {
    timeSlotId: newTimeSlotId,
    date: newSlot.date,
    startTime: newSlot.startTime,
    endTime: newSlot.endTime,
    status: APPOINTMENT_STATUS.PENDING,
  });

  return updated;
};

const enrichAppointment = (appointment) => {
  const provider = dataService.getServiceProviderById(appointment.serviceProviderId);
  const user = dataService.getUserById(appointment.userId);
  return {
    ...appointment,
    providerName: provider ? provider.name : null,
    userName: user ? user.name : null,
  };
};

module.exports = {
  createAppointment,
  getUserAppointments,
  getProviderAppointments,
  getAppointmentById,
  cancelAppointment,
  confirmAppointment,
  rejectAppointment,
  completeAppointment,
  rescheduleAppointment,
};
