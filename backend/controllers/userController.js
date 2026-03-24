const dataService = require('../services/dataService');
const notificationService = require('../services/notificationService');
const { sanitizeUser, paginate } = require('../utils/helpers');
const { createError } = require('../utils/helpers');

const getProfile = (req, res, next) => {
  try {
    const user = dataService.getUserById(req.user.id);
    if (!user) return next(createError('User not found', 404));
    res.json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (err) {
    next(err);
  }
};

const updateProfile = (req, res, next) => {
  try {
    const updated = dataService.updateUser(req.user.id, req.body);
    if (!updated) return next(createError('User not found', 404));
    res.json({ success: true, message: 'Profile updated', data: { user: sanitizeUser(updated) } });
  } catch (err) {
    next(err);
  }
};

const getNotifications = (req, res, next) => {
  try {
    const notifications = notificationService.getUserNotifications(req.user.id);
    res.json({ success: true, data: { notifications } });
  } catch (err) {
    next(err);
  }
};

const markNotificationRead = (req, res, next) => {
  try {
    const notification = notificationService.markAsRead(req.params.id);
    if (!notification) return next(createError('Notification not found', 404));
    res.json({ success: true, data: { notification } });
  } catch (err) {
    next(err);
  }
};

const addReview = (req, res, next) => {
  try {
    const { appointmentId, serviceProviderId, rating, comment } = req.body;

    // Check appointment exists and belongs to user
    const appointment = dataService.getAppointmentById(appointmentId);
    if (!appointment) return next(createError('Appointment not found', 404));
    if (appointment.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (appointment.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed appointments' });
    }

    // Check not already reviewed
    const existing = dataService.getReviews().find((r) => r.appointmentId === appointmentId);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Appointment already reviewed' });
    }

    const review = dataService.createReview({
      userId: req.user.id,
      appointmentId,
      serviceProviderId,
      rating,
      comment: comment || null,
    });

    // Update provider's average rating
    const allReviews = dataService.getReviewsByProviderId(serviceProviderId);
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    dataService.updateServiceProvider(serviceProviderId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    res.status(201).json({ success: true, message: 'Review added', data: { review } });
  } catch (err) {
    next(err);
  }
};

const getMyReviews = (req, res, next) => {
  try {
    const reviews = dataService.getReviewsByUserId(req.user.id);
    res.json({ success: true, data: { reviews } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getNotifications,
  markNotificationRead,
  addReview,
  getMyReviews,
};
