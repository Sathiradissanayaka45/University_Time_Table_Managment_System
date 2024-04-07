const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Registration Route
router.post('/register', UserController.register);
// Login Route
router.post('/login', UserController.login);

module.exports = router;


