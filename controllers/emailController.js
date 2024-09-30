const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../database_sql/pool');

exports.sendPasswordResetEmail = async (user) => {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000).toISOString(); // 1-hour expiration

    // Store token and expiry in DB
    await pool.query(
        'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
        [resetToken, resetTokenExpires, user.email]
    );

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Configure the mail transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Reset Your Password',
        html: `<p>Please reset your password by clicking the link below:</p>
               <p><a href="${resetUrl}">Reset Password</a></p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Email failed to send');
    }
};