const mongoose = require('mongoose');

// Define the schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: Number, 
    otpExpire: Date
});


// Function to clean up expired OTPs
const cleanupExpiredOTPs = async () => {
    const now = Date.now();
    try {
        // Find users with expired OTPs and update their records
        await User.updateMany(
            { otpExpire: { $lt: now } }, // Condition: OTP expired
            { $unset: { otp: "", otpExpire: "" } } // Remove OTP and OTP expiration
        );
        console.log('Expired OTPs cleaned up');
    } catch (err) {
        console.error('Error cleaning up expired OTPs:', err);
    }
};

// Set an interval to check for expired OTPs every 5 minutes (300000 ms)
setInterval(cleanupExpiredOTPs, 15 * 60 * 1000); // OTP clear up - 15 mins


// Export the model
const User = mongoose.model('User', userSchema);
module.exports = User;
