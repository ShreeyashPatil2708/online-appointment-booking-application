const ROLES = {
  CUSTOMER: 'customer',
  SERVICE_PROVIDER: 'service_provider',
  ADMIN: 'admin',
};

const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  BLOCKED: 'blocked',
};

const NOTIFICATION_TYPES = {
  APPOINTMENT_BOOKED: 'appointment_booked',
  APPOINTMENT_CONFIRMED: 'appointment_confirmed',
  APPOINTMENT_CANCELLED: 'appointment_cancelled',
  APPOINTMENT_COMPLETED: 'appointment_completed',
  APPOINTMENT_REJECTED: 'appointment_rejected',
  APPOINTMENT_REMINDER: 'appointment_reminder',
};

module.exports = {
  ROLES,
  APPOINTMENT_STATUS,
  SLOT_STATUS,
  NOTIFICATION_TYPES,
};
