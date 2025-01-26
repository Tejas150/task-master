const Task = require('../models/task');
const createError = require("http-errors");
const logger = require('../utils/logger');

exports.createTask = async ({ title, description, dueDate, assignedTo, createdBy }) => {
	try {
		const task = await Task.create({
			title,
			description,
			dueDate,
			assignedTo,
			createdBy
		});
		return task;
	} catch (error) {
		logger.error(`Create task error: ${error.message}`);
		throw error;
	}
};

exports.getTasks = async (userId) => {
	try {
		const tasks = await Task.find({ assignedTo: userId });
		return tasks;
	} catch (error) {
		logger.error(`Get tasks error: ${error.message}`);
		throw error;
	}
};

exports.updateTaskStatus = async ({ taskId, status }) => {
	try {
		const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
		if (!task) {
			throw createError(404, "Task not found");
		}
		return task;
	} catch (error) {
		logger.error(`Update task status error: ${error.message}`);
		throw error;
	}
};

exports.assignTask = async ({ taskId, assignedTo }) => {
	try {
		const task = await Task.findByIdAndUpdate(taskId, { assignedTo }, { new: true });
		if (!task) {
			throw createError(404, "Task not found");
		}
		return task;
	} catch (error) {
		logger.error(`Assign task error: ${error.message}`);
		throw error;
	}
};

exports.filterTasks = async ({ userId, status }) => {
	try {
		const tasks = await Task.find({ assignedTo: userId, status });
		return tasks;
	} catch (error) {
		logger.error(`Filter tasks error: ${error.message}`);
		throw error;
	}
};

exports.searchTasks = async ({ userId, query }) => {
	try {
		const tasks = await Task.find({
			assignedTo: userId,
			$or: [
				{ title: { $regex: query, $options: 'i' } },
				{ description: { $regex: query, $options: 'i' } }
			]
		});
		return tasks;
	} catch (error) {
		logger.error(`Search tasks error: ${error.message}`);
		throw error;
	}
};

exports.addComment = async ({ taskId, userId, comment }) => {
	try {
		const task = await Task.findByIdAndUpdate(taskId, {
			$push: { comments: { user: userId, comment } }
		}, { new: true });
		if (!task) {
			throw createError(404, "Task not found");
		}
		return task;
	} catch (error) {
		logger.error(`Add comment error: ${error.message}`);
		throw error;
	}
};

exports.addAttachment = async ({ taskId, attachment }) => {
	try {
		const task = await Task.findByIdAndUpdate(taskId, {
			$push: { attachments: { file: attachment, attachedAt: new Date() } }
		}, { new: true });
		if (!task) {
			throw createError(404, "Task not found");
		}
		return task;
	} catch (error) {
		logger.error(`Add attachment error: ${error.message}`);
		throw error;
	}
};
