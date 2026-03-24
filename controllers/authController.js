const userService = require('../services/userService');
const dataService = require('../services/dataService');
const { sanitizeUser } = require('../utils/helpers');

const register = async (req, res, next) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user: sanitizeUser(user) },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await userService.login(email, password);
    res.json({
      success: true,
      message: 'Login successful',
      data: { accessToken, refreshToken, user: sanitizeUser(user) },
    });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const { accessToken } = userService.refreshAccessToken(token);
    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (token) userService.logout(token);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

const getMe = (req, res) => {
  const user = dataService.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: { user: sanitizeUser(user) } });
};

module.exports = { register, login, refreshToken, logout, getMe };
