const Project = require('../models/project');
const createError = require("http-errors");
const logger = require('../utils/logger');

exports.createProject = async ({ name, description, owner }) => {
	try {
		logger.info(`Creating project with name: ${name}, description: ${description}, owner: ${owner}`);
		const project = await Project.create({
			name,
			description,
			owner,
			members: [owner]
		});
		logger.info(`Project created: ${project}`);
		return project;
	} catch (error) {
		logger.error(`Create project error: ${error.message}`);
		throw error;
	}
};

exports.inviteMember = async ({ projectId, memberId }) => {
	try {
		logger.info(`Inviting member with ID: ${memberId} to project with ID: ${projectId}`);
		const project = await Project.findByIdAndUpdate(projectId, {
			$addToSet: { members: memberId }
		}, { new: true });
		if (!project) {
			throw createError(404, "Project not found");
		}
		logger.info(`Member invited: ${project}`);
		return project;
	} catch (error) {
		logger.error(`Invite member error: ${error.message}`);
		throw error;
	}
};

exports.makeManager = async ({ projectId, memberId }) => {
	try {
		logger.info(`Promoting member with ID: ${memberId} to manager in project with ID: ${projectId}`);
		const project = await Project.findByIdAndUpdate(projectId, {
			$addToSet: { managers: memberId }
		}, { new: true });
		if (!project) {
			throw createError(404, "Project not found");
		}
		logger.info(`Member promoted to manager: ${project}`);
		return project;
	} catch (error) {
		logger.error(`Make manager error: ${error.message}`);
		throw error;
	}
};
