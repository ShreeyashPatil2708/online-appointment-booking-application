const environment = require('./environment');

const jwtConfig = {
  secret: environment.jwtSecret,
  expiresIn: environment.jwtExpiresIn,
  refreshSecret: environment.jwtRefreshSecret,
  refreshExpiresIn: environment.jwtRefreshExpiresIn,
};

module.exports = jwtConfig;
