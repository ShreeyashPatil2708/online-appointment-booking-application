require('dotenv').config();

const environment = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_in_production',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  persistData: process.env.PERSIST_DATA === 'true',
  dataDir: process.env.DATA_DIR || './data',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

module.exports = environment;
