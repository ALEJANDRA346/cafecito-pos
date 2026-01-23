const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// Cuando alguien envíe datos a "/login", ejecuta la función loginUser
router.post('/login', loginUser);

module.exports = router;