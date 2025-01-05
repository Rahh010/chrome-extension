const express = require('express');
const { register, login, ValidateOTP } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/validate', ValidateOTP)

module.exports = router