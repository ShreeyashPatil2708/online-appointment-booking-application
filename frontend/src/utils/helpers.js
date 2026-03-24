import { format, parseISO } from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr;
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy HH:mm');
  } catch {
    return dateStr;
  }
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'An unexpected error occurred';
}
