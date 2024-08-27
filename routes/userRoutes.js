const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUserById
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const authUser = require('../middleware/authUser');
const checkAdminRole = require('../middleware/adminMiddleware');

const router = express.Router();

// Get all users - Admin only
router.get('/users', authenticateToken, checkAdminRole, getAllUsers);

// Get user by ID - Admin or the user themselves
router.get('/users/:user_id', authenticateToken, authUser, getUserById);

// Update user by ID - Admin or the user themselves
router.put('/users/:user_id', authenticateToken, authUser, updateUserById);

module.exports = router;