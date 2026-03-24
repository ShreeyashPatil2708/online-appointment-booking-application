const dataService = require('../services/dataService');
const serviceProviderService = require('../services/serviceProviderService');
const { sanitizeUsers, sanitizeUser, paginate, createError } = require('../utils/helpers');
const { ROLES } = require('../config/constants');

const getStats = (req, res, next) => {
  try {
    const stats = dataService.getStats();
    res.json({ success: true, data: { stats } });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    let users = dataService.getUsers();
    if (role) users = users.filter((u) => u.role === role);
    const result = paginate(sanitizeUsers(users), Number(page), Number(limit));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getUserById = (req, res, next) => {
  try {
    const user = dataService.getUserById(req.params.id);
    if (!user) return next(createError('User not found', 404));
    res.json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (err) {
    next(err);
  }
};

const deactivateUser = (req, res, next) => {
  try {
    const user = dataService.getUserById(req.params.id);
    if (!user) return next(createError('User not found', 404));
    if (user.role === ROLES.ADMIN) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate admin' });
    }
    const updated = dataService.updateUser(req.params.id, { isActive: false });
    res.json({ success: true, message: 'User deactivated', data: { user: sanitizeUser(updated) } });
  } catch (err) {
    next(err);
  }
};

const activateUser = (req, res, next) => {
  try {
    const user = dataService.getUserById(req.params.id);
    if (!user) return next(createError('User not found', 404));
    const updated = dataService.updateUser(req.params.id, { isActive: true });
    res.json({ success: true, message: 'User activated', data: { user: sanitizeUser(updated) } });
  } catch (err) {
    next(err);
  }
};

const getAllProviders = (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const providers = dataService.getServiceProviders();
    res.json({ success: true, data: paginate(providers, Number(page), Number(limit)) });
  } catch (err) {
    next(err);
  }
};

const getAllAppointments = (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let appointments = dataService.getAppointments();
    if (status) appointments = appointments.filter((a) => a.status === status);
    res.json({ success: true, data: paginate(appointments, Number(page), Number(limit)) });
  } catch (err) {
    next(err);
  }
};

const deleteUser = (req, res, next) => {
  try {
    const user = dataService.getUserById(req.params.id);
    if (!user) return next(createError('User not found', 404));
    if (user.role === ROLES.ADMIN) {
      return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    }
    dataService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  getUserById,
  deactivateUser,
  activateUser,
  getAllProviders,
  getAllAppointments,
  deleteUser,
};
