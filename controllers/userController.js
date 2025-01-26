const { sendSuccess } = require("../utils/apiResponse");
const { register, login, getUserProfile, updateUserProfile, logout } = require("../services/userService");
const logger = require('../utils/logger');

exports.registerUser = async (req, res, next) => {
	try {
		const user = await register({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			profile: {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				bio: req.body.bio,
				location: req.body.location,
				phoneNumber: req.body.phoneNumber
			}
		});
		sendSuccess(res, "User registered successfully", user);
	} catch (error) {
		logger.error(`Register user error: ${error.message}`);
		next(error);
	}
};

exports.loginUser = async (req, res, next) => {
	try {
		const token = await login({
			identifier: req.body.identifier, // Accept email or username
			password: req.body.password
		});
		sendSuccess(res, "Login successful", token);
	} catch (error) {
		logger.error(`Login user error: ${error.message}`);
		next(error);
	}
};

exports.getUserProfile = async (req, res, next) => {
	try {
		const user = await getUserProfile(req.user.id);
		sendSuccess(res, "User profile fetched successfully", user);
	} catch (error) {
		logger.error(`Get user profile error: ${error.message}`);
		next(error);
	}
};

exports.updateUserProfile = async (req, res, next) => {
	try {
		const user = await updateUserProfile(req.user.id, { profile: req.body.profile });
		sendSuccess(res, "User profile updated successfully", user);
	} catch (error) {
		logger.error(`Update user profile error: ${error.message}`);
		next(error);
	}
};

exports.logoutUser = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1]; // Extract token from header
		await logout(req.user.id, token);
		sendSuccess(res, "Logout successful");
	} catch (error) {
		logger.error(`Logout user error: ${error.message}`);
		next(error);
	}
};
