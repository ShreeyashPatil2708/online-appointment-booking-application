const serviceProviderService = require('../services/serviceProviderService');
const timeSlotService = require('../services/timeSlotService');
const appointmentService = require('../services/appointmentService');
const dataService = require('../services/dataService');
const { paginate } = require('../utils/helpers');

const getAllProviders = (req, res, next) => {
  try {
    const { specialty, page = 1, limit = 10 } = req.query;
    const providers = serviceProviderService.getAllProviders({ specialty });
    res.json({ success: true, data: paginate(providers, Number(page), Number(limit)) });
  } catch (err) {
    next(err);
  }
};

const getProviderById = (req, res, next) => {
  try {
    const provider = serviceProviderService.getProviderById(req.params.id);
    res.json({ success: true, data: { provider } });
  } catch (err) {
    next(err);
  }
};

const getMyProfile = (req, res, next) => {
  try {
    const provider = serviceProviderService.getProviderByUserId(req.user.id);
    res.json({ success: true, data: { provider } });
  } catch (err) {
    next(err);
  }
};

const updateMyProfile = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const updated = serviceProviderService.updateProvider(provider.id, req.body);
    res.json({ success: true, message: 'Profile updated', data: { provider: updated } });
  } catch (err) {
    next(err);
  }
};

const getProviderSlots = (req, res, next) => {
  try {
    const { date } = req.query;
    let slots;
    if (date) {
      slots = timeSlotService.getAvailableSlots(req.params.id, date);
    } else {
      slots = timeSlotService.getSlotsByProvider(req.params.id);
    }
    res.json({ success: true, data: { slots } });
  } catch (err) {
    next(err);
  }
};

const addTimeSlot = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const slot = timeSlotService.createSlot(provider.id, req.body);
    res.status(201).json({ success: true, message: 'Time slot created', data: { slot } });
  } catch (err) {
    next(err);
  }
};

const blockTimeSlot = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const slot = timeSlotService.blockSlot(req.params.slotId, provider.id);
    res.json({ success: true, message: 'Slot blocked', data: { slot } });
  } catch (err) {
    next(err);
  }
};

const unblockTimeSlot = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const slot = timeSlotService.unblockSlot(req.params.slotId, provider.id);
    res.json({ success: true, message: 'Slot unblocked', data: { slot } });
  } catch (err) {
    next(err);
  }
};

const deleteTimeSlot = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    timeSlotService.deleteSlot(req.params.slotId, provider.id);
    res.json({ success: true, message: 'Slot deleted' });
  } catch (err) {
    next(err);
  }
};

const getProviderAppointments = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const { page = 1, limit = 10 } = req.query;
    const appointments = appointmentService.getProviderAppointments(provider.id);
    res.json({ success: true, data: paginate(appointments, Number(page), Number(limit)) });
  } catch (err) {
    next(err);
  }
};

const getProviderStats = (req, res, next) => {
  try {
    const provider = dataService.getServiceProviderByUserId(req.user.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }
    const stats = serviceProviderService.getProviderStats(provider.id);
    res.json({ success: true, data: { stats } });
  } catch (err) {
    next(err);
  }
};

const getProviderReviews = (req, res, next) => {
  try {
    const reviews = dataService.getReviewsByProviderId(req.params.id);
    res.json({ success: true, data: { reviews } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProviders,
  getProviderById,
  getMyProfile,
  updateMyProfile,
  getProviderSlots,
  addTimeSlot,
  blockTimeSlot,
  unblockTimeSlot,
  deleteTimeSlot,
  getProviderAppointments,
  getProviderStats,
  getProviderReviews,
};
