const { isCelebrateError } = require('celebrate');
const { sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${req.method} ${req.url} - ${err.message}`);

  // Handle validation errors
  if (isCelebrateError(err)) {
    const errorDetails = Array.from(err.details.values())[0].details[0].message;
    return sendError(res, errorDetails, 400);
  }

  // Handle HTTP errors (from http-errors)
  if (err.status) {
    return sendError(res, err.message, err.status);
  }

  // Handle generic errors
  return sendError(res, 'Internal Server Error', 500);
};

module.exports = errorHandler;
