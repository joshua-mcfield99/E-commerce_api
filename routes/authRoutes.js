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

// Login route using Passport for local strategy
router.post('/login', (req, res, next) => {
    console.log('Login route hit');
    
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
        }

        if (!user) {
            console.log('Login failed:', info ? info.message : 'Invalid credentials');
            return res.status(401).json({ message: info ? info.message : 'Login failed. Invalid credentials.' });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error('Error logging user in:', err);
                return res.status(500).json({ message: 'Error logging in. Please try again later.' });
            }

            console.log('Login successful, user logged in:', user);
            return res.status(200).json({
                message: 'Login successful',
                user: req.user,
            });
        });
    })(req, res, next);
});

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

        console.log('OAuth callback: User found', user);  // Log the user found during OAuth

        // Check if password reset is required
        if (user.password_reset_required) {
            console.log('User needs a password reset. Sending reset email.');
            await sendPasswordResetEmail(user);
            return res.redirect('http://localhost:3000/profile?passwordReset=true');
        }

        // No password reset required, proceed to profile
        console.log('Password reset not required. Redirecting to profile.');
        res.redirect('http://localhost:3000/profile');
    }
);

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Retrieve the current authenticated user
 *     tags:
 *       - Authentication
 *     description: This route returns the current authenticated user's details if they are logged in.
 *     responses:
 *       200:
 *         description: Successfully retrieved the authenticated user's details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: User is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authenticated
 */
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

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

/*router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    // If user is authenticated, return the user profile
    res.json({
        user: req.user  // Contains user details
    });
});*/


/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the user and destroy session
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       500:
 *         description: Error logging out or ending session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error logging out. Please try again later.
 */

// Logout user and destroy session
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out. Please try again later.' });
        }
        
        // Clear session cookie or any relevant data
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error ending session. Please try again later.' });
            }

            // Send response confirming logout
            res.status(200).json({ message: 'Logout successful' });
        });
    });
});

module.exports = router;