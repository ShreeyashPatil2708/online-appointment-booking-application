const dataService = require('./dataService');

const createNotification = (userId, type, message, metadata = {}) => {
  return dataService.createNotification({ userId, type, message, metadata });
};

const getUserNotifications = (userId) => {
  return dataService.getNotificationsByUserId(userId);
};

const markAsRead = (notificationId) => {
  return dataService.markNotificationRead(notificationId);
};

module.exports = { createNotification, getUserNotifications, markAsRead };
