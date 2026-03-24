const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

const sanitizeUsers = (users) => users.map(sanitizeUser);

const paginate = (array, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    pagination: {
      page,
      limit,
      total: array.length,
      pages: Math.ceil(array.length / limit),
    },
  };
};

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { sanitizeUser, sanitizeUsers, paginate, createError };
