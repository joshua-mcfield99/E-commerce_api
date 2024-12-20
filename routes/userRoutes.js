const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUserById,
    getUserProfile
} = require('../controllers/userController');
const authenticateSession = require('../middleware/authMiddleware');
const authUser = require('../middleware/authUser');
const checkAdminRole = require('../middleware/adminMiddleware');

const router = express.Router();

// Get all users (Admin only)
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Only accessible by admin users.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users.
 *       403:
 *         description: Access denied.
 */
router.get('/users', authenticateSession, checkAdminRole, getAllUsers);

// Get user by ID - Admin or the user themselves
/**
 * @swagger
 * /api/users/{user_id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     description: Only accessible by the user themselves or an admin.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: A single user.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: User not found.
 */
router.get('/users/:user_id', authenticateSession, authUser, getUserById);

// Update user by ID - Admin or the user themselves
/**
 * @swagger
 * /api/users/{user_id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Only accessible by the user themselves or an admin.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID.
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
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: User not found.
 */
router.put('/users/:user_id', authenticateSession, authUser, updateUserById);

// Get the profile of the authenticated user
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieve the profile of the authenticated user, including addresses and orders.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User profile with addresses and orders.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
router.get('/profile', authenticateSession, getUserProfile);

module.exports = router;