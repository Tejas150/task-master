const createError = require('http-errors');
const Project = require('../models/project');

/**
 * authorize based on user roles
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const authorizeRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { user } = req;
      const { projectId } = req.body;

      const project = await Project.findById(projectId);
      if (!project) {
        throw createError(404, 'Project not found');
      }

      if (allowedRoles.includes('owner') && project.owner === user._id) {
        return next();
      }

      if (allowedRoles.includes('manager') && project.managers.some(manager => manager.equals(user._id))) {
        return next();
      }

      if (allowedRoles.includes('member') && project.members.some(member => member.equals(user._id))) {
        return next();
      }

      throw createError(403, 'Access denied. Insufficient permissions');
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorizeRole;
