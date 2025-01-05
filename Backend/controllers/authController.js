const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // ignore

// endpoint - api/auth/register
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        // Generate a token for the new user
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, username: newUser.name },
            process.env.JWT_SECRET, 
            { expiresIn: '90d' }
        );
        
        // sending result with status code, json, cookie
        res .status(201) // status code 'ok'
            .cookie('token', token, {
                httpOnly: true,  // Helps prevent XSS attacks by making the cookie inaccessible to JavaScript
                secure: process.env.NODE_ENV === 'production',  // Ensures the cookie is sent only over HTTPS in production
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),  // 90 days expiration
            })
            .json({ 
                message: 'User registered successfully' // Json message for that user registered sucessfully
            }) 

          
    } catch (err) {
        res
            .status(500)
            .json({ message: 'Server error', error: err.message });
    }
}


