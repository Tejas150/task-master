const express = require("express");
const { createProject, inviteMember, makeManager } = require("../controllers/projectController");
const { validateCreateProject, validateInviteMember, validateMakeManager } = require("../middlewares/validateRequest");
const authenticate = require('../middlewares/authenticate');
const authorizeRole = require('../middlewares/authorizeRole');

const router = express.Router();

router.post("/", authenticate, validateCreateProject, createProject);
router.post("/invite", authenticate, authorizeRole(['owner', 'manager']), validateInviteMember, inviteMember);
router.post("/make-manager", authenticate, authorizeRole(['owner']), validateMakeManager, makeManager);

module.exports = router;
