const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const sendEmail = require('../utils/sendEmail');

const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minute expiration time

// endpoint - api/auth/register
exports.register = async (req, res) => {
    const { name, email } = req.body;
    console.log(name,email)

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }   
        
        // Creates a random OTP
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        console.log(otp)
        
        // This creates a user with email, otp, and otp expiration
        const user = new User({ email, name, otp, otpExpire: Date.now() + OTP_EXPIRATION_TIME });
        await user.save();
        console.log(user)

        // Generating JWT Token
        const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
            expiresIn: "90d",
        });

        // This function send a mail to desired Email
        await sendEmail({ email, name, otp })
        
        // Sending response to the client
        res .status(200)
            .cookie('authToken', token, {
                httpOnly: true,
                maxAge: 90 * 24 * 60 * 60 * 1000,  // 90 days
            })
            .json({
                success: true,
                message: "OTP sent successfully"
            })

    } catch (err) {
        res .status(500)
            .json({ message: 'Server error', error: err.message });
    }
}

// endpoint - api/auth/login

exports.login = async (req, res) => {
    const { email } = req.body;

    try {
        // Finding the user with their email
        const existingUser = await User.findOne({ email });

        // if there is no user in that email
        if (!existingUser) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // Generate a new OTP and expiration time
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

        // Update the existing user's OTP and expiration
        existingUser.otp = otp;
        existingUser.otpExpire = Date.now() + OTP_EXPIRATION_TIME;
        await existingUser.save();

        // Send mail to desired Email
        await sendEmail({email, name: existingUser.name, otp})

        console.log('Updated OTP for user:', existingUser);

        // Generating JWT token
        const token = jwt.sign({ name: existingUser.name, email }, process.env.JWT_SECRET, {
            expiresIn: "90d",
        });


        res .status(200)
            .cookie('authToken', token, {
                httpOnly: true,    // Prevent JavaScript from accessing the cookie
                maxAge: 60 * 60 * 1000,  // 1 hour
                secure: process.env.NODE_ENV === 'production',      // Only secure when production
            })
            .json({ success: true, message: 'OTP sent' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// endpoint - api/auth/validate
exports.ValidateOTP = async (req, res) => {
    try {
        // Extract the token from the cookies
        const token = req.cookies.authToken;
        console.log(token)
        
        if (!token) {
            return res.status(400).json({ message: 'Token is missing' });
        }

        console.log(req.body)

        // Extract OTP from the request body
        const { otp } = req.body;

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(400).json({ message: 'Invalid Token' });
        }

        // Find the user associated with the email in the token
        const user = await User.findOne({ email: decoded.email });

        console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP matches and has not expired
        if (user.otp === Number(otp) && Date.now() < new Date(user.otpExpire).getTime()) {

            // Generating JWT token
            const token = jwt.sign({ name: user.name, email: user.email , loggedIn: true }, process.env.JWT_SECRET, {
                expiresIn: "90d",
            });

            
            // OTP is valid and not expired
            res .status(200)
            .cookie('authToken', token, {
                httpOnly: true,    // Prevent JavaScript from accessing the cookie
                maxAge: 90 * 24 * 60 * 60 * 1000,  // 90 days
                secure: process.env.NODE_ENV === 'production',      // Only secure when production
            })
            .json({ success: true, message: 'Logged In' });

        } else {
            // OTP is invalid or expired
            console.log("OTP is either invalid or expired.");
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (e) {
        // Handle errors
        console.error(e);
        return res.status(500).json({ message: 'Server error', error: e.message });
    }
};

// endpoint - api/auth/logout
exports.logOut = async (req, res) => {
    // Clear the HttpOnly cookie by setting an expired date
    res.clearCookie("authToken", {
        httpOnly: true, // Ensure it's an HttpOnly cookie
        secure: process.env.NODE_ENV === "production", // Set this to true in production if using HTTPS
        sameSite: "Strict", // Optional: Helps prevent CSRF attacks
        path: "/", // Specify the path where the cookie should be deleted
    });

    // Respond with a message after logout
    res.status(200).json({ message: "Logged out successfully" });
}