const express = require('express');
const router = express.Router();

// Importing Middleware
const { authMiddleware } = require('../middleware/auth_middleware');

// Importing Handlers
const { getMe, patchMe, deleteMe } = require('../handlers/users/me')
const { searchByUsername } = require('../handlers/users/users')
const { getFriends, addFriend, deleteFriend } = require('../handlers/users/friend')

// Personal Account Routes
router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, patchMe);
router.delete('/me', authMiddleware, deleteMe);

// Getting Other Users
router.get('/search/:username', searchByUsername) // By Username

// Friending
router.get('/friends', getFriends)
router.post('/friends', addFriend);
router.delete('/friends/:friend', deleteFriend)

module.exports = router;