const { createTask, getTasks, updateTaskStatus, assignTask, filterTasks, searchTasks, addComment, addAttachment } = require('../services/taskService');
const { sendSuccess } = require("../utils/apiResponse");
const logger = require('../utils/logger');

exports.createTask = async (req, res, next) => {
	try {
		const task = await createTask({
			title: req.body.title,
			description: req.body.description,
			dueDate: req.body.dueDate,
			assignedTo: req.body.assignedTo,
			createdBy: req.user.id
		});
		sendSuccess(res, "Task created successfully", task);
	} catch (error) {
		logger.error(`Create task error: ${error.message}`);
		next(error);
	}
};

exports.getTasks = async (req, res, next) => {
	try {
		const tasks = await getTasks(req.user.id);
		sendSuccess(res, "Tasks fetched successfully", tasks);
	} catch (error) {
		logger.error(`Get tasks error: ${error.message}`);
		next(error);
	}
};

exports.updateTaskStatus = async (req, res, next) => {
	try {
		const task = await updateTaskStatus({
			taskId: req.body.taskId,
			status: req.body.status
		});
		sendSuccess(res, "Task status updated successfully", task);
	} catch (error) {
		logger.error(`Update task status error: ${error.message}`);
		next(error);
	}
};

exports.assignTask = async (req, res, next) => {
	try {
		const task = await assignTask({
			taskId: req.body.taskId,
			assignedTo: req.body.assignedTo
		});
		sendSuccess(res, "Task assigned successfully", task);
	} catch (error) {
		logger.error(`Assign task error: ${error.message}`);
		next(error);
	}
};

exports.filterTasks = async (req, res, next) => {
	try {
		const tasks = await filterTasks({
			userId: req.user.id,
			status: req.query.status
		});
		sendSuccess(res, "Tasks filtered successfully", tasks);
	} catch (error) {
		logger.error(`Filter tasks error: ${error.message}`);
		next(error);
	}
};

exports.searchTasks = async (req, res, next) => {
	try {
		const tasks = await searchTasks({
			userId: req.user.id,
			query: req.query.query
		});
		sendSuccess(res, "Tasks searched successfully", tasks);
	} catch (error) {
		logger.error(`Search tasks error: ${error.message}`);
		next(error);
	}
};

exports.addComment = async (req, res, next) => {
	try {
		const task = await addComment({
			taskId: req.body.taskId,
			userId: req.user.id,
			comment: req.body.comment
		});
		sendSuccess(res, "Comment added successfully", task);
	} catch (error) {
		logger.error(`Add comment error: ${error.message}`);
		next(error);
	}
};

exports.addAttachment = async (req, res, next) => {
	try {
		const task = await addAttachment({
			taskId: req.body.taskId,
			attachment: req.body.attachment,
			fileName: req.body.fileName,
			fileType: req.body.fileType,
			fileSize: req.body.fileSize
		});
		sendSuccess(res, "Attachment added successfully", task);
	} catch (error) {
		logger.error(`Add attachment error: ${error.message}`);
		next(error);
	}
};
