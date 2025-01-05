// sendEmail.js
const nodemailer = require('nodemailer');

// Function to send an email
const sendEmail = async ({ email, name, otp }) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.APP_PASS,
            },
        });

        // Define mail options
        const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: 'OTP for Collectify',
            text: `Hi, ${name},
                    You have initiated an OTP from Collectify.
                    Your OTP is ${otp}.

                    This will expire in 10 minutes.
                    Don't forward this email.
                    If you didn't initiate this OTP, just ignore it.`,
                                html: `
                    <p>Hi, <strong>${name}</strong>,</p>
                    <p>You have initiated an OTP from <strong>Collectify</strong>.</p>
                    <p>Your OTP is <strong>${otp}</strong>.</p>
                    <p>This will expire in <strong>10 minutes</strong>.</p>
                    <p><em>Don't forward this email.</em></p>
                    <p>If you didn't initiate this OTP, ignore it.</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
