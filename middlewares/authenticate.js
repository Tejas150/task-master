const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user');
const BlacklistedToken = require('../models/blacklistedToken');
const { JWT_SECRET } = require('../config/env');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw createError(401, "Access token is missing");
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      throw createError(401, "Token is blacklisted");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw createError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, 'Authentication error'));
  }
};

module.exports = authenticate;
