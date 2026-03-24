export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ROLES = {
  CUSTOMER: 'customer',
  PROVIDER: 'service_provider',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-800',
};
