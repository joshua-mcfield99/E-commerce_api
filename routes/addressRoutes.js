const express = require('express');
const { addAddress } = require('../controllers/addressController');
const authenticateSession = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Add a new address for the authenticated user
 *     tags:
 *       - Addresses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               postal_code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address created successfully.
 *       500:
 *         description: Server error.
 */
router.post('/', authenticateSession, addAddress);

module.exports = router;