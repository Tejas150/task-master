const { createProject, inviteMember, makeManager } = require('../services/projectService');
const { sendSuccess } = require("../utils/apiResponse");
const logger = require('../utils/logger');

exports.createProject = async (req, res, next) => {
	try {
		logger.info('Creating project');
		const project = await createProject({
			name: req.body.name,
			description: req.body.description,
			owner: req.user.id
		});
		sendSuccess(res, "Project created successfully", project);
	} catch (error) {
		logger.error(`Create project error: ${error.message}`);
		next(error);
	}
};

exports.inviteMember = async (req, res, next) => {
	try {
		logger.info('Inviting member');
		const project = await inviteMember({
			projectId: req.body.projectId,
			memberId: req.body.memberId
		});
		sendSuccess(res, "Member invited successfully", project);
	} catch (error) {
		logger.error(`Invite member error: ${error.message}`);
		next(error);
	}
};

exports.makeManager = async (req, res, next) => {
	try {
		logger.info('Promoting member to manager');
		const project = await makeManager({
			projectId: req.body.projectId,
			memberId: req.body.memberId
		});
		sendSuccess(res, "Member promoted to manager successfully", project);
	} catch (error) {
		logger.error(`Make manager error: ${error.message}`);
		next(error);
	}
};
