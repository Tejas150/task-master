const express = require("express");
const { validateLogin, validateRegister, validateUpdateProfile, errors } = require("../middlewares/validateRequest");
const { registerUser, loginUser, getUserProfile, updateUserProfile, logoutUser } = require("../controllers/userController");
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, validateUpdateProfile, updateUserProfile);
router.post('/logout', authenticate, logoutUser);

// Attach Celebrate error handler
router.use(errors());

module.exports = router;
