const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    ValidateOTP, 
    logOut
} = require('../controllers/authController');

// checking route
router.get('/', (req, res) => res.json({ message: "vanakkam da mapla" }) )

// Register Route - api/auth/register
router.post('/register', register)


// Login Route - api/auth/login
router.post('/login', login)

// login ValidateOTP - api/auth/validate
router.post('/validate', ValidateOTP)

// logout - api/auth/logout
router.post('/logout', logOut)

module.exports = router