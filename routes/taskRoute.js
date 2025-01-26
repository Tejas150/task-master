const express = require("express");
const { createTask, getTasks, updateTaskStatus, assignTask, filterTasks, searchTasks, addComment, addAttachment } = require("../controllers/taskController");
const { validateCreateTask, validateUpdateTaskStatus, validateAssignTask, validateAddComment, validateAddAttachment } = require("../middlewares/validateRequest");
const authenticate = require('../middlewares/authenticate');
const authorizeRole = require('../middlewares/authorizeRole');

const router = express.Router();

router.post("/create", authenticate, authorizeRole(['owner', 'manager']), validateCreateTask, createTask);
router.get("/", authenticate, getTasks);
router.put("/status", authenticate, validateUpdateTaskStatus, updateTaskStatus);
router.put("/assign", authenticate, validateAssignTask, assignTask);
router.get("/filter", authenticate, filterTasks);
router.get("/search", authenticate, searchTasks);
router.post("/comment", authenticate, validateAddComment, addComment);
router.post("/attachment", authenticate, validateAddAttachment, addAttachment);

module.exports = router;
