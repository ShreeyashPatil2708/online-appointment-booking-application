const appointmentService = require('../services/appointmentService');
const dataService = require('../services/dataService');
const { paginate } = require('../utils/helpers');
const { ROLES } = require('../config/constants');

const createAppointment = (req, res, next) => {
  try {
    const appointment = appointmentService.createAppointment(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Appointment booked', data: { appointment } });
  } catch (err) {
    next(err);
  }
};

const getMyAppointments = (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const appointments = appointmentService.getUserAppointments(req.user.id);
    res.json({ success: true, data: paginate(appointments, Number(page), Number(limit)) });
  } catch (err) {
    next(err);
  }
};

const getAppointmentById = (req, res, next) => {
  try {
    const appointment = appointmentService.getAppointmentById(req.params.id);
    // Only allow owner, provider, or admin
    if (
      req.user.role !== ROLES.ADMIN &&
      appointment.userId !== req.user.id
    ) {
      const provider = dataService.getServiceProviderByUserId(req.user.id);
      if (!provider || appointment.serviceProviderId !== provider.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }
    res.json({ success: true, data: { appointment } });
  } catch (err) {
    next(err);
  }
};

const cancelAppointment = (req, res, next) => {
  try {
    const appointment = appointmentService.cancelAppointment(req.params.id, req.user.id, req.user.role);
    res.json({ success: true, message: 'Appointment cancelled', data: { appointment } });
  } catch (err) {
    next(err);
  }
};

const confirmAppointment = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const appointment = appointmentService.confirmAppointment(req.params.id, provider.id);
    res.json({ success: true, message: 'Appointment confirmed', data: { appointment } });
  } catch (err) {
    next(err);
  }
};

const rejectAppointment = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const appointment = appointmentService.rejectAppointment(req.params.id, provider.id);
    res.json({ success: true, message: 'Appointment rejected', data: { appointment } });
  } catch (err) {
    next(err);
  }
};

const completeAppointment = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const appointment = appointmentService.completeAppointment(req.params.id, provider.id);
    res.json({ success: true, message: 'Appointment completed', data: { appointment } });
  } catch (err) {
    next(err);
  }
};

const rescheduleAppointment = (req, res, next) => {
  try {
    const { timeSlotId } = req.body;
    if (!timeSlotId) {
      return res.status(400).json({ success: false, message: 'timeSlotId is required' });
    }
    const appointment = appointmentService.rescheduleAppointment(req.params.id, req.user.id, timeSlotId);
    res.json({ success: true, message: 'Appointment rescheduled', data: { appointment } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  confirmAppointment,
  rejectAppointment,
  completeAppointment,
  rescheduleAppointment,
};
