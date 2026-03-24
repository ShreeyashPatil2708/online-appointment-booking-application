const dataService = require('./dataService');
const { SLOT_STATUS } = require('../config/constants');
const { createError } = require('../utils/helpers');

const getAvailableSlots = (providerId, date) => {
  const provider = dataService.getServiceProviderById(providerId);
  if (!provider) throw createError('Service provider not found', 404);
  return dataService.getAvailableTimeSlots(providerId, date);
};

const getSlotsByProvider = (providerId) => {
  return dataService.getTimeSlotsByProvider(providerId);
};

const createSlot = (providerId, slotData) => {
  const { date, startTime, endTime } = slotData;

  // Check for overlapping slots
  const existing = dataService.getTimeSlotsByProvider(providerId).find(
    (s) => s.date === date && s.startTime === startTime,
  );
  if (existing) {
    throw createError('A time slot already exists at this time', 409);
  }

  return dataService.createTimeSlot({
    serviceProviderId: providerId,
    date,
    startTime,
    endTime,
    status: SLOT_STATUS.AVAILABLE,
  });
};

const blockSlot = (slotId, providerId) => {
  const slot = dataService.getTimeSlotById(slotId);
  if (!slot) throw createError('Time slot not found', 404);
  if (slot.serviceProviderId !== providerId) {
    throw createError('Not authorized to modify this slot', 403);
  }
  if (slot.status === SLOT_STATUS.BOOKED) {
    throw createError('Cannot block a booked slot', 400);
  }
  return dataService.updateTimeSlot(slotId, { status: SLOT_STATUS.BLOCKED });
};

const unblockSlot = (slotId, providerId) => {
  const slot = dataService.getTimeSlotById(slotId);
  if (!slot) throw createError('Time slot not found', 404);
  if (slot.serviceProviderId !== providerId) {
    throw createError('Not authorized to modify this slot', 403);
  }
  return dataService.updateTimeSlot(slotId, { status: SLOT_STATUS.AVAILABLE });
};

const deleteSlot = (slotId, providerId) => {
  const slot = dataService.getTimeSlotById(slotId);
  if (!slot) throw createError('Time slot not found', 404);
  if (slot.serviceProviderId !== providerId) {
    throw createError('Not authorized to delete this slot', 403);
  }
  if (slot.status === SLOT_STATUS.BOOKED) {
    throw createError('Cannot delete a booked slot', 400);
  }
  return dataService.deleteTimeSlot(slotId);
};

module.exports = { getAvailableSlots, getSlotsByProvider, createSlot, blockSlot, unblockSlot, deleteSlot };
