const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataService = require('./dataService');
const jwtConfig = require('../config/jwt');
const { ROLES } = require('../config/constants');
const { createError } = require('../utils/helpers');

const register = async (userData) => {
  const { name, email, password, role = ROLES.CUSTOMER, phone } = userData;

  const existing = dataService.getUserByEmail(email);
  if (existing) {
    throw createError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = dataService.createUser({
    name,
    email,
    password: hashedPassword,
    role,
    phone: phone || null,
    isActive: true,
  });

  // If registering as a service provider, create a provider record
  if (role === ROLES.SERVICE_PROVIDER) {
    dataService.createServiceProvider({
      userId: user.id,
      name,
      email,
      phone: phone || null,
      specialty: '',
      services: [],
      availability: {},
      rating: 0,
      totalReviews: 0,
      isActive: true,
    });
  }

  return user;
};

const login = async (email, password) => {
  const user = dataService.getUserByEmail(email);
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw createError('Account deactivated', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError('Invalid email or password', 401);
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn },
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn },
  );

  dataService.addRefreshToken(refreshToken);

  return { accessToken, refreshToken, user };
};

const refreshAccessToken = (refreshToken) => {
  if (!dataService.isRefreshTokenValid(refreshToken)) {
    throw createError('Invalid refresh token', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
  } catch {
    dataService.removeRefreshToken(refreshToken);
    throw createError('Refresh token expired or invalid', 401);
  }

  const user = dataService.getUserById(decoded.id);
  if (!user || !user.isActive) {
    throw createError('User not found or inactive', 401);
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn },
  );

  return { accessToken };
};

const logout = (refreshToken) => {
  dataService.removeRefreshToken(refreshToken);
};

module.exports = { register, login, refreshAccessToken, logout };
