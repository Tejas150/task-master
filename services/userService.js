const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BlacklistedToken = require("../models/blacklistedToken");
const logger = require("../utils/logger");
const createError = require("http-errors");
const { JWT_SECRET } = require('../config/env')

exports.register = async ({ username, email, password, profile }) => {
    // Check if the user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw createError(400, "User with this email or username already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = await User.create({ username, email, password: hashedPassword, profile });

    logger.info(`User registered: ${email}`);
    return { id: newUser._id, email: newUser.email, role: newUser.role };
};

// Service for user login
exports.login = async ({ identifier, password }) => {
    // Find user by email or username
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) {
        throw createError(401, "Invalid email/username or password");
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw createError(401, "Invalid email/username or password");
    }

    // Generate a JWT
    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    logger.info(`User logged in: ${user._id}`);
    return { token };
};

exports.getUserProfile = async (userId) => {
	const user = await User.findById(userId).select("-password");
	if (!user) {
		throw createError(404, "User not found");
	}
	return user;
};

exports.updateUserProfile = async (userId, updateData) => {
	const user = await User.findByIdAndUpdate(userId, { $set: { profile: updateData.profile } }, { new: true }).select("-password");
	if (!user) {
		throw createError(404, "User not found");
	}
	logger.info(`User profile updated: ${userId}`);
	return user;
};

exports.logout = async (userId, token) => {
	// Blacklist the token
	await BlacklistedToken.create({ token });
	logger.info(`User logged out and token blacklisted: ${userId}`);
};
