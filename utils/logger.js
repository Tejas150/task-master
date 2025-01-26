const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
    new transports.File({ filename: 'logs/combined.log' }), // Log all messages to file
  ],
});

module.exports = logger;
