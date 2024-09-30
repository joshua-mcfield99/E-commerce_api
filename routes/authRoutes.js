const express = require('express');
const passport = require('passport');
const pool = require('../database_sql/pool');
const { registerUser, loginUser, resetPassword } = require('../controllers/authController');
const { sendPasswordResetEmail } = require('../controllers/emailController');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered.
 *       400:
 *         description: Invalid input.
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in.
 *       401:
 *         description: Invalid credentials.
 *       404:
 *         description: User does not exist.
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth login route
 *     tags:
 *       - Authentication
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback route
 *     tags:
 *       - Authentication
 */
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        const user = req.user;

        // Check if password reset is required
        if (user.password_reset_required) {
            await sendPasswordResetEmail(user);
            return res.redirect(`http://localhost:3000/profile?passwordReset=true`);
        }

        // No password reset required
        res.redirect('http://localhost:3000/profile');
    }
);

/**
 * @swagger
 * /api/auth/password-reset-request:
 *   post:
 *     summary: Request a password reset
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.post('/password-reset-request', async (req, res) => {
    const { email } = req.body;

    try {
        // Fetch the user by email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await sendPasswordResetEmail(user);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing password reset' });
    }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset the password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid or expired token.
 *       500:
 *         description: Server error.
 */
router.post('/reset-password', resetPassword);

module.exports = router;