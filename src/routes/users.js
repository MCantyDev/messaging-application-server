const express = require('express');
const router = express.Router();

const { getMe, patchMe, deleteMe } = require('../handlers/users/me')
const { searchByUsername } = require('../handlers/users/users')
const { getFriends, addFriend, deleteFriend } = require('../handlers/users/friend')

// Personal Account Routes
router.get('/me', getMe);
router.patch('/me', patchMe);
router.delete('/me', deleteMe);

// Getting Other Users
router.get('/search/:username', searchByUsername) // By Username

// Friending
router.get('/friends', getFriends)
router.post('/friends', addFriend);
router.delete('/friends/:friend', deleteFriend)

module.exports = router;