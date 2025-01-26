const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { DB_URI } = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message ?? error.toString());
    throw new Error('Failed to connect to MongoDB');
  }
};

module.exports = connectDB;
