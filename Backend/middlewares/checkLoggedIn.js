const jwt = require('jsonwebtoken');

const checkLoggedIn = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(400).json({ message: "You need to Login/Register first" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const { email, loggedIn } = decode;

        if(!loggedIn) {
            return res.status(401).json({message: "You should verify OTP and Log IN"})
        }

        // Attach the email to the request object for use in the route
        req.email = email;
        console.log(req.email)
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        console.error("Invalid token:", err.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = checkLoggedIn

