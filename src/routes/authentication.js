const express = require('express');
const router = express.Router();

// Import Middleware
const { authMiddleware } = require('../middleware/auth_middleware');

// Import Handlers
const { signup, login, logout } = require('../handlers/authentication');

// Define Authentication Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

module.exports = router;
