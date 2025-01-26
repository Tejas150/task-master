const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const { method, url, headers, ip } = req;

  // Log the HTTP request details (method, url, headers, ip)
  logger.info(`[${method}] ${url} - Headers: ${JSON.stringify(headers)} - Ip: ${ip}`);

  next();
};

module.exports = requestLogger;
